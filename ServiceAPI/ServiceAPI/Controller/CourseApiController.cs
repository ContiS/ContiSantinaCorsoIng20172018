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
    [Route("api/coursemanagement")]
    public class CourseApiController : Controller
    {
        static readonly object setupLock = new object();
        static readonly SemaphoreSlim parallelism = new SemaphoreSlim(2);
               
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new UniversityDbContext())
                {
                    return Ok(context.Courses.ToList());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        [HttpGet("course")]
        public async Task<IActionResult> GetCourse([FromQuery]int id)
        {
            using (var context = new UniversityDbContext())
            {
                return Ok(await context.Courses.FirstOrDefaultAsync(x => x.Id == id));
            }
        }

        [HttpPut("courses")]
        public async Task<IActionResult> CreateCourse([FromBody]Course course)
        {
            using (var context = new UniversityDbContext())
            {
                context.Courses.Add(course);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        [HttpPost("courses")]
        public async Task<IActionResult> UpdateCourse([FromBody]Course course)
        {
            using (var context = new UniversityDbContext())
            {
                context.Courses.Update(course);
                await context.SaveChangesAsync();
                return Ok();
            }
        }   


        [HttpDelete("courses")]
        public async Task<IActionResult> DeleteCourse([FromQuery]int id)
        {
            using (var context = new UniversityDbContext())
            {
                var course = await context.Courses.FirstOrDefaultAsync(x => x.Id == id);
                if (course != null)
                {
                    context.Courses.Remove(course);
                    await context.SaveChangesAsync();
                }
                return Ok();


            }
        }
    }
}
