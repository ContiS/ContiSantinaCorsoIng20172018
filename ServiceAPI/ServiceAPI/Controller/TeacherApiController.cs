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
    [Route("api/teachermanagement")]
    public class TeacherApiController : Controller
    {
        static readonly object setupLock = new object();
        static readonly SemaphoreSlim parallelism = new SemaphoreSlim(2);

        [HttpGet("teachers")]
        public async Task<IActionResult> GetTeachers()
        {
            try
            {
                await parallelism.WaitAsync();

                using (var context = new UniversityDbContext())
                {
                    return Ok(context.Teachers.ToList());
                }
            }
            finally
            {
                parallelism.Release();
            }
        }

        [HttpGet("teacher")]
        public async Task<IActionResult> GetTeacher([FromQuery]int id)
        {
            using (var context = new UniversityDbContext())
            {
                return Ok(await context.Teachers.FirstOrDefaultAsync(x => x.Id == id));
            }
        }

        [HttpPut("teachers")]
        public async Task<IActionResult> CreateTeacher([FromBody]Teacher teacher)
        {
            using (var context = new UniversityDbContext())
            {
                context.Teachers.Add(teacher);

                await context.SaveChangesAsync();

                return Ok();
            }
        }

        [HttpPost("teachers")]
        public async Task<IActionResult> UpdateTeacher([FromBody]Teacher teacher)
        {
            using (var context = new UniversityDbContext())
            {
                context.Teachers.Update(teacher);
                await context.SaveChangesAsync();
                return Ok();
            }
        }


        [HttpDelete("teachers")]
        public async Task<IActionResult> DeleteTeacher([FromQuery]int id)
        {
            using (var context = new UniversityDbContext())
            {
                var teacher = await context.Teachers.FirstOrDefaultAsync(x => x.Id == id);
                if (teacher != null)
                {
                    context.Teachers.Remove(teacher);
                    await context.SaveChangesAsync();
                }
                return Ok();                
            }
        }
    }
}
