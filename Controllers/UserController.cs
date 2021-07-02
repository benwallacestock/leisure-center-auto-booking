using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using leisure_center_bookings.Dtos;
using leisure_center_bookings.Models;
using leisure_center_bookings.Services;
using Microsoft.AspNetCore.Mvc;

namespace leisure_center_bookings.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController
    {
        private readonly ILeisureCenterService _leisureCenterService;
        private readonly IClassQueueService _classQueueService;

        public UserController(ILeisureCenterService leisureCenterService, IClassQueueService classQueueService)
        {
            _leisureCenterService = leisureCenterService;
            _classQueueService = classQueueService;
        }

        [HttpGet]
        public async Task<User> GetUser()
        {
            return await _leisureCenterService.GetLeisureCenterUser();
        }

        [HttpGet("schedule")]
        public async Task<List<Class>> GetSchedule()
        {
            var schedule = await _leisureCenterService.GetSchedule();

            foreach (var queued in _classQueueService.GetQueuedClassIds())
            {
                if (schedule.All(s => s.Brief.Id != queued))
                {
                    var queuedClass = await _leisureCenterService.GetClass(queued);
                    queuedClass.AttendeeDetails.Queued = true;
                    schedule.Add(queuedClass);
                }
                else
                {
                    schedule.First(s => s.Brief.Id == queued).AttendeeDetails.Queued = true;
                }
            }

            return schedule;
        }
    }

}