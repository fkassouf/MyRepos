using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TimesOfLebanonCMSNew.utilities
{
    public class DatatableData<T>
    {
        public int draw;
        public int recordsTotal;
        public int recordsFiltered;
        public List<T> data;
    }
}
