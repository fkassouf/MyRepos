using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternalRegime.Models
{
    public class ItemModel
    {
        public Int32 ID { get; set; }

        public string Title { get; set; }

        public string PrimaryItem { get; set; }

        public string ModifiedItem { get; set; }

        public bool? Active { get; set; }

        public bool? AllVotedYes { get; set; }

        public bool? AllVotedNo { get; set; }

    }
}
