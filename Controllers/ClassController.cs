using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using leisure_center_bookings.Dtos;
using leisure_center_bookings.Services;
using Microsoft.AspNetCore.Mvc;

namespace leisure_center_bookings.Controllers
{
    [Route("api/class")]
    [ApiController]
    public class ClassController
    {
        private readonly ILeisureCenterService _leisureCenterService;
        private readonly IClassQueueService _classQueueService;

        public ClassController(ILeisureCenterService leisureCenterService, IClassQueueService classQueueService)
        {
            _leisureCenterService = leisureCenterService;
            _classQueueService = classQueueService;
        }

        [HttpGet]
        public async Task<List<Class>> GetClasses()
        {
           return await _leisureCenterService.GetClasses();
        }
        
        [HttpGet("{id}")]
        public async Task<Class> GetClass(string id)
        {
            var c = await _leisureCenterService.GetClass(id);
            c.AttendeeDetails.Queued = _classQueueService.GetQueuedClassIds().Any(q => q == c.Brief.Id);
            return c;
        }
        
        [HttpGet("{id}/add")]
        public async Task<Class> AddToClass(string id)
        {
            return await _leisureCenterService.AddToClass(id);
        }       
        
        [HttpGet("{id}/remove")]
        public async Task<Class> RemoveFromClass(string id)
        {
            return await _leisureCenterService.RemoveFromClass(id);
        }

        [HttpGet("{id}/queue/add")]
        public async Task<Class> AddToQueue(string id)
        {
            return await _classQueueService.AddToQueue(id);
        }
        
        [HttpGet("{id}/queue/remove")]
        public async Task<Class> RemoveFromQueue(string id)
        {
            return await _classQueueService.RemoveFromQueue(id);
        }
        
    }
}