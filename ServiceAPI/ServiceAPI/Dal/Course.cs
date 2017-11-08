using Microsoft.EntityFrameworkCore.Metadata;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceAPI.Dal
{
    public class Course
    {
        [JsonProperty]
        public int Id { get; set; }

        [JsonProperty]
        public string Name { get; set; }

        /// <summary>
        /// List of teaching
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<Teaching> Teachings { get; set; }

        /// <summary>
        /// List of student
        /// </summary>
        [JsonIgnore]
        public virtual ICollection<Student> Students { get; set; }
    }

}
