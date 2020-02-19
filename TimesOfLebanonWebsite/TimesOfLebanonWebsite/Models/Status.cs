using System;
using System.Collections.Generic;

namespace TimesOfLebanonWebsite.Models
{
    public partial class Status
    {
        public Status()
        {
            News = new HashSet<News>();
        }

        public int Id { get; set; }
        public int? Code { get; set; }
        public string Name { get; set; }

        public ICollection<News> News { get; set; }
    }
}
