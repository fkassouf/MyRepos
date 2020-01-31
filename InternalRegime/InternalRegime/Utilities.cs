using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace InternalRegime
{
    public class Utilities
    {
        public static List<T> GetProcedureToList<T>(IDataReader reader) where T : class, new()
        {
            var results = new List<T>();
            var type = typeof(T);
            if (reader.Read())
            {
                // at least one row: resolve the properties
                var props = new PropertyInfo[reader.FieldCount - 1 + 1];
                for (int i = 0, loopTo = props.Length - 1; i <= loopTo; i++)
                {
                    var prop = type.GetProperty(reader.GetName(i), BindingFlags.Instance | BindingFlags.Public);
                    if (prop != null && prop.CanWrite)
                        props[i] = prop;
                }
                do
                {
                    var obj = new T();
                    for (int i = 0, loopTo1 = props.Length - 1; i <= loopTo1; i++)
                    {
                        var prop = props[i];
                        if (prop == null)
                            continue;
                        // not mapped
                        var val = reader.IsDBNull(i) ? null : reader[i];
                        prop.SetValue(obj, val);
                    }

                    results.Add(obj);
                }
                while (reader.Read());
            }
            reader.Close();
            return results;
        }

    }
}
