using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimesOfLebanonCMSNew.Models
{
    public partial class ExceptionModel
    {
        public Int64 ExceptionId { get; set; }

        public string ActionName { get; set; }

        public string Exception { get; set; }

        public string Message { get; set; }

        public Int32 UserId { get; set; }
    }
}
