using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternalRegime.Models
{
    public class ResultDatasetModel
    {
        public Int32 ItemId { get; set; }
        public string Title { get; set; }
        public string ModifiedItem { get; set; }
        public string PrimaryItem { get; set; }
        public string AgreeColor { get; set; }
        public string DisagreeColor { get; set; }
        public Int32 AgreeVotes { get; set; }
        public Int32 DisagreeVotes { get; set; }

    }
}
