using System;
using System.Collections.Generic;

namespace TimesOfLebanonWebsite.Models
{
    public partial class Users
    {
        public Users()
        {
            NewsCreationUser = new HashSet<News>();
            NewsUpdateUser = new HashSet<News>();
        }

        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool? Active { get; set; }

        public ICollection<News> NewsCreationUser { get; set; }
        public ICollection<News> NewsUpdateUser { get; set; }
    }
}
