using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternalRegime.Models
{
    public class ExceptionModel
    {
        public Int64 Id { get; set; }

        public string InnerException { get; set; }

        public string StackTrace { get; set; }

        public string AbsoluteUrl { get; set; }

        public Int64 MemberId { get; set; }

        public string MemberFullName { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}
