using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceAPI.Dal
{

    public class Teacher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }

        /// <summary>
        /// List of teaching
        /// </summary>
        public virtual ICollection<Teaching> Teachings { get; set; }
        
    }
}