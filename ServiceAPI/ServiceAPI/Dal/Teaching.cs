using System;
using System.Collections.Generic;
using System.Text;

namespace ServiceAPI.Dal
{
   public class Teaching
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CreditNumber { get; set; }

        public string Semester { get; set; }

        public string Years { get; set; }

        public virtual Teacher Teacher { get; set; }

        public virtual Course Course { get; set; }
    }
}
