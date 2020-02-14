using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InternalRegime.Models
{
    public class UnitModel
    {
        public Int64 UnitId { get; set; }
        public Int32 UnitTypeId { get; set; }
        public Int32 ItemId { get; set; }
        public string Name { get; set; }
    }
}
