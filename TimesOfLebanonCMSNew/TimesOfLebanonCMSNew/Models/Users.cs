using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TimesOfLebanonCMSNew.Models
{
    public partial class Users
    {
        public int UserId { get; set; }
        public string FullName { get; set; }

  
        public string Username { get; set; }

        public bool  Active { get; set; }
        [DataType(DataType.Password)]
        public string Password { get; set; }


       

    }
}
