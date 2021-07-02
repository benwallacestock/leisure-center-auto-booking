using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using leisure_center_bookings.Dtos;
using leisure_center_bookings.Models;
using Microsoft.EntityFrameworkCore;

namespace leisure_center_bookings.Services
{
    public interface IClassQueueService
    {
        Task<Class> AddToQueue(string id);
        Task<Class> RemoveFromQueue(string id);
        Task CheckQueue();
        List<string> GetQueuedClassIds();
    }

    public class ClassQueueService : IClassQueueService
    {
        private LeisureCenterDbContext _dbContext;
        private ILeisureCenterService _leisureCenterService;

        public ClassQueueService(LeisureCenterDbContext dbContext, ILeisureCenterService leisureCenterService)
        {
            _dbContext = dbContext;
            _leisureCenterService = leisureCenterService;
        }

        private DateTime UnixTimeToDateTime(double unixtime)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddMilliseconds(unixtime).ToLocalTime();
            return dtDateTime;
        }

        public async Task<Class> AddToQueue(string id)
        {
            var queuedClass = await _dbContext.QueuedClasses.FirstOrDefaultAsync(c => c.ClassId == id);

            if (queuedClass != null)
            {
                throw new Exception();
            }
            
            var c = await _leisureCenterService.GetClass(id);

            if (c.Details.BookingWindowStart != null)
            {
                if (c.AttendeeDetails.AvailableActions.Contains("ADD_TO_WAITLIST") && !c.AttendeeDetails.WaitlistBooked)
                {
                    await _leisureCenterService.AddToWaitlist(id);
                }

                queuedClass = new QueuedClass()
                {
                    BookableDateTime = UnixTimeToDateTime(c.Details.BookingWindowStart.Value),
                    ClassId = c.Brief.Id
                };

                _dbContext.Add(queuedClass);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new Exception();
            }

            c.AttendeeDetails.Queued = true;
            return c;
        }

        public async Task<Class> RemoveFromQueue(string id)
        {
            var queuedClass = await _dbContext.QueuedClasses.FirstOrDefaultAsync(q => q.ClassId == id);

            if (queuedClass == null)
            {
                throw new Exception();
            }
            
            var fullClass = await _leisureCenterService.GetClass(id);
            
            if (fullClass.AttendeeDetails.AvailableActions.Contains("REMOVE_FROM_WAITLIST") &&
                fullClass.AttendeeDetails.WaitlistBooked)
            {
                await _leisureCenterService.RemoveFromWaitlist(id);
            }
            
            _dbContext.Remove(queuedClass);
            await _dbContext.SaveChangesAsync();

            return fullClass;
        }

        public async Task CheckQueue()
        {
            foreach (var queuedClass in _dbContext.QueuedClasses.ToList())
            {
                if (queuedClass.BookableDateTime < DateTime.Now)
                {
                    try
                    {
                        var fullClass = await _leisureCenterService.GetClass(queuedClass.ClassId);

                        if (fullClass.AttendeeDetails.AvailableActions.Contains("ADD_TO_WAITLIST") &&
                            !fullClass.AttendeeDetails.WaitlistBooked)
                        {
                            await _leisureCenterService.AddToWaitlist(queuedClass.ClassId);
                        }

                        if (fullClass.AttendeeDetails.AvailableActions.Contains("ADD_TO_CLASS"))
                        {
                            await _leisureCenterService.AddToClass(queuedClass.ClassId);
                            _dbContext.QueuedClasses.Remove(queuedClass);
                        }
                    }
                    catch
                    {
                        Console.WriteLine("Error occurred while booking class, leaving in queue");
                    }
                }
            }

            await _dbContext.SaveChangesAsync();
        }

        public List<string> GetQueuedClassIds()
        {
            return _dbContext.QueuedClasses.Select(q => q.ClassId).ToList();
        }
    }
}