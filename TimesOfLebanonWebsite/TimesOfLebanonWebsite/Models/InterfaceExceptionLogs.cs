using System;
using System.Collections.Generic;

namespace TimesOfLebanonWebsite.Models
{
    public partial class InterfaceExceptionLogs
    {
        public long ExceptionId { get; set; }
        public string ActionName { get; set; }
        public DateTime? CreateDate { get; set; }
        public string Exception { get; set; }
        public string Message { get; set; }
        public long? UserId { get; set; }
    }
}
