using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternalRegime.Models
{
    public class VotingModel
    {
        public Int32 ItemId { get; set; }

        public bool? Voted { get; set; }

        public DateTime? VotingTime { get; set; }
    }
}
