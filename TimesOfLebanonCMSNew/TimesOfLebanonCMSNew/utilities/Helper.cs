using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimesOfLebanonCMSNew.Models;

namespace TimesOfLebanonCMSNew.utilities
{
    public class Helper
    {
        public DatatableData<News> GetNewsRecords(Nullable<int> start, Nullable<int> length, string sortDirVal, string sortCol)
        {
            using (var ctx = new TimesOfLebanonContext())
            {

                return ctx.GetNewsRecords(start, length, sortDirVal, sortCol);
            }
        }
    }
}
