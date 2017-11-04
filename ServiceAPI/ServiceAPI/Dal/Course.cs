using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceAPI.Dal
{
    public class Course
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string AcademicYear { get; set; }

        /// <summary>
        /// List of teaching
        /// </summary>
        public virtual ICollection<Teaching> Teachings { get; set; }

        /// <summary>
        /// List of student
        /// </summary>
        public virtual ICollection<Student> Students { get; set; }
    }

}
