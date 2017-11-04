using Microsoft.AspNetCore.Mvc;
using ServiceAPI.Dal;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace ServiceAPI
{
    [Route("api/teachingmanagement")]
    public class TeachingApiController : Controller
    {
        static readonly object setupLock = new object();
        static readonly SemaphoreSlim parallelism = new SemaphoreSlim(2);

        [HttpGet("teachings")]
        public async Task<IActionResult> GetTeaching()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new UniversityDbContext())
                {
                    return Ok(context.Teachings.ToList());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        [HttpGet("teaching")]
        public async Task<IActionResult> GetTeaching([FromQuery]int id)
        {
            using (var context = new UniversityDbContext())
            {
                return Ok(await context.Teachings.FirstOrDefaultAsync(x => x.Id == id));
            }
        }

        [HttpPut("teachings")]
        public async Task<IActionResult> CreateTeaching([FromBody]Teaching teachings)
        {
            using (var context = new UniversityDbContext())
            {
                context.Teachings.Add(teachings);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        [HttpPost("teachings")]
        public async Task<IActionResult> UpdateTeaching([FromBody]Teaching teachings)
        {
            using (var context = new UniversityDbContext())
            {
                context.Teachings.Update(teachings);
                await context.SaveChangesAsync();
                return Ok();
            }
        }


        [HttpDelete("teachings")]
        public async Task<IActionResult> DeleteTeaching([FromQuery]int id)
        {
            using (var context = new UniversityDbContext())
            {
                var teachings = await context.Teachings.FirstOrDefaultAsync(x => x.Id == id);
                if (teachings != null)
                {
                    context.Teachings.Remove(teachings);
                    await context.SaveChangesAsync();
                }
                return Ok();                
            }
        }
    }
}
