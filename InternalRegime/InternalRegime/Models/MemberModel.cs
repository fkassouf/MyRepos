using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternalRegime.Models
{
    public class MemberModel
    {
        public Int32 ID { get; set; }

        public Int32? Session { get; set; }

        public Int64 MemberID { get; set; }

        public string FullName { get; set; }

        public Int32 VoteWeight { get; set; }

        public DateTime? DateOfWeight { get; set; }

        public DateTime? LoginDatetime { get; set; }

        public string Description { get; set; }

        public bool? Locked { get; set; }

        public bool? IsAdmin { get; set; }

    }
}
