using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace TimesOfLebanonCMSNew.utilities
{
    public class Utilities
    {
        private static object GetDefaultValue(Type t)
        {
            try
            {
                if (typeof(string) == t)
                {
                    return string.Empty;
                }
                if (t.IsValueType)
                {
                    if ((Nullable.GetUnderlyingType(t) == null))
                    {
                        return Activator.CreateInstance(t);
                    }
                    else
                    {
                        return Activator.CreateInstance(Nullable.GetUnderlyingType(t));
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return null;
        }



        public static Expression<Func<T, bool>> CreateTextSearch<T>(string searchText, List<string> prpList)
        {
            Expression expr = null;
            var tParameterExpr = Expression.Parameter(typeof(T));
            try
            {
                Type t = typeof(T);
                //var props = t.GetProperties().Cast<PropertyInfo>().Where(p => p.PropertyType == typeof(string));
                var props = t.GetProperties().Cast<PropertyInfo>();
                var searchTextExpr = Expression.Constant(searchText.ToLower());
                var toStringMethod = typeof(object).GetMethod("ToString");
                var containsMethod = typeof(string).GetMethod("Contains");
                var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
                DateTime datestr;
                foreach (var prop in props)
                {
                    if ((prop.PropertyType == typeof(DateTime?) || prop.PropertyType == typeof(DateTime)) && DateTime.TryParseExact(searchText, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.NoCurrentDateDefault, out datestr))
                    {
                        searchTextExpr = Expression.Constant(datestr.Date.ToString("M/d/yyyy"));
                    }
                    if (prpList.Contains(prop.Name))
                    {
                        var emptyString = Expression.Constant(GetDefaultValue(prop.PropertyType));

                        Expression strcriteria = null;
                        //Coalesce check empty
                        if (!prop.PropertyType.IsValueType || (Nullable.GetUnderlyingType(prop.PropertyType) != null))
                        {
                            var coalesceExpr = Expression.Coalesce(Expression.Property(tParameterExpr, prop), Expression.Constant(GetDefaultValue(prop.PropertyType)));
                            strcriteria = Expression.Call(coalesceExpr, toStringMethod);
                        }
                        else
                        {
                            strcriteria = Expression.Call(Expression.Property(tParameterExpr, prop), toStringMethod);
                        }
                        var strToLower = Expression.Call(strcriteria, toLowerMethod);
                        var criteria = Expression.Call(strToLower, containsMethod, searchTextExpr);
                        if (expr == null)
                        {
                            expr = criteria;
                        }
                        else
                        {
                            expr = Expression.Or(expr, criteria);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Expression.Lambda<Func<T, bool>>(expr, tParameterExpr);
        }

        public static Expression<Func<T, bool>> CreateSingleTextSearch<T>(string searchText, string cloName)
        {
            Expression expr = null;
            var tParameterExpr = Expression.Parameter(typeof(T));
            try
            {
                Type t = typeof(T);
                var props = t.GetProperties().Cast<PropertyInfo>().FirstOrDefault(p => p.Name == cloName);
                var searchTextExpr = Expression.Constant(searchText.ToLower());
                var toStringMethod = typeof(object).GetMethod("ToString");
                var containsMethod = typeof(string).GetMethod("Contains");
                var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
                var emptyString = Expression.Constant(GetDefaultValue(props.PropertyType));
                Expression strcriteria = null;
                if (props.PropertyType == typeof(DateTime?) || props.PropertyType == typeof(DateTime))
                {
                    searchTextExpr = Expression.Constant(DateTime.ParseExact(searchText, "dd/MM/yyyy", CultureInfo.InvariantCulture).Date.ToString("M/d/yyyy"));
                }
                //Coalesce check empty
                if (!props.PropertyType.IsValueType || (Nullable.GetUnderlyingType(props.PropertyType) != null))
                {
                    var coalesceExpr = Expression.Coalesce(Expression.Property(tParameterExpr, props), emptyString);
                    strcriteria = Expression.Call(coalesceExpr, toStringMethod);
                }
                else
                {
                    strcriteria = Expression.Call(Expression.Property(tParameterExpr, props), toStringMethod);
                }
                var strToLower = Expression.Call(strcriteria, toLowerMethod);
                var criteria = Expression.Call(strToLower, containsMethod, searchTextExpr);
                expr = criteria;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Expression.Lambda<Func<T, bool>>(expr, tParameterExpr);
        }

        public static IQueryable<T> OrderBy<T>(IQueryable<T> source, string ordering)
        {
            try
            {
                var type = typeof(T);
                var property = type.GetProperty(ordering);
                var parameter = Expression.Parameter(type, "p");
                var propertyAccess = Expression.MakeMemberAccess(parameter, property);
                var orderByExp = Expression.Lambda(propertyAccess, parameter);
                MethodCallExpression resultExp = Expression.Call(typeof(Queryable), "OrderBy", new Type[] { type, property.PropertyType }, source.Expression, Expression.Quote(orderByExp));
                return source.Provider.CreateQuery<T>(resultExp);
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return source;
        }

        public static IQueryable<T> OrderByDescending<T>(IQueryable<T> source, string ordering)
        {
            try
            {
                var type = typeof(T);
                var property = type.GetProperty(ordering);
                var parameter = Expression.Parameter(type, "p");
                var propertyAccess = Expression.MakeMemberAccess(parameter, property);
                var orderByExp = Expression.Lambda(propertyAccess, parameter);
                MethodCallExpression resultExp = Expression.Call(typeof(Queryable), "OrderByDescending", new Type[] { type, property.PropertyType }, source.Expression, Expression.Quote(orderByExp));
                return source.Provider.CreateQuery<T>(resultExp);
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return source;
        }

        public static DataSet ToDataSet<T>(IList<T> list)
        {
            Type elementType = typeof(T);
            DataSet ds = new DataSet();
            System.Data.DataTable t = new System.Data.DataTable();
            ds.Tables.Add(t);

            //add a column to table for each public property on T
            foreach (var propInfo in elementType.GetProperties())
            {
                //Type ColType = Nullable.GetUnderlyingType(propInfo.PropertyType) ?? propInfo.PropertyType;
                Type ColType = typeof(string);
                t.Columns.Add(propInfo.Name, ColType);
            }

            //go through each property on T and add each value to the table
            foreach (T item in list)
            {
                DataRow row = t.NewRow();

                foreach (var propInfo in elementType.GetProperties())
                {
                    Type ColType = Nullable.GetUnderlyingType(propInfo.PropertyType) ?? propInfo.PropertyType;
                    if (ColType == typeof(string))
                    {
                        Decimal result;
                        if (Decimal.TryParse(Convert.ToString(propInfo.GetValue(item, null)), out result) && Convert.ToString(propInfo.GetValue(item, null)).Length > 14)
                        {
                            row[propInfo.Name] = "'" + Convert.ToString(propInfo.GetValue(item, null));
                        }
                        else
                        {
                            row[propInfo.Name] = Convert.ToString(propInfo.GetValue(item, null));
                        }
                    }
                    else
                    {
                        if (propInfo.GetValue(item, null) != null)
                        {
                            Decimal result;
                            if (Decimal.TryParse(Convert.ToString(propInfo.GetValue(item, null)), out result) && Convert.ToString(propInfo.GetValue(item, null)).Length > 14)
                            {
                                row[propInfo.Name] = "'" + Convert.ToString(propInfo.GetValue(item, null));
                            }
                            else
                            {
                                row[propInfo.Name] = Convert.ToString(propInfo.GetValue(item, null));
                            }
                        }
                        else
                        {
                            row[propInfo.Name] = DBNull.Value;
                        }
                    }
                }

                t.Rows.Add(row);
            }

            return ds;
        }

        //public static void ExportToExcel(DataSet ds, string fileName)
        //{
        //    var gv = new GridView();
        //    gv.DataSource = ds.Tables[0]; ;
        //    gv.DataBind();
        //    var Response = HttpContext.Current.Response;
        //    Response.ClearContent();
        //    Response.Buffer = true;
        //    Response.AddHeader("content-disposition", "attachment; filename=" + fileName + ".xls");
        //    Response.ContentType = "application/ms-excel";
        //    Response.Charset = "";
        //    System.IO.StringWriter objStringWriter = new System.IO.StringWriter();
        //    System.Web.UI.HtmlTextWriter objHtmlTextWriter = new System.Web.UI.HtmlTextWriter(objStringWriter);
        //    gv.RenderControl(objHtmlTextWriter);
        //    Response.Output.Write(objStringWriter.ToString());
        //    Response.Flush();
        //    Response.End();
        //}

        //public static void ExportToExcelWithSearch<T>(T req, List<T> data, string fileName)
        //{
        //    var prpList = new List<String>();
        //    Type myType = req.GetType();
        //    IList<PropertyInfo> props = new List<PropertyInfo>(myType.GetProperties());
        //    var SalesReportData = data;
        //    foreach (var p in props)
        //    {
        //        var val = ((p.PropertyType == typeof(int?) || p.PropertyType == typeof(int)) && Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null)) == "0") || ((p.PropertyType == typeof(DateTime) || p.PropertyType == typeof(DateTime?) && Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null)) == "1/1/0001 12:00:00 AM")) ? "" : Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null));
        //        var colName = p.Name;
        //        prpList.Add(colName);
        //        if (!string.IsNullOrWhiteSpace(val))
        //        {
        //            SalesReportData = SalesReportData.AsQueryable().Where(Utilities.CreateSingleTextSearch<T>(val, colName).Compile()).ToList();
        //        }
        //    }

        //    var DataSet = ToDataSet(SalesReportData);
        //    ExportToExcel(DataSet, fileName + "-" + DateTime.Now.ToString("ddMMyyyyHHmmss"));
        //}

        //public static void ExportToExcelWithSearch<T>(T req, List<T> data, string fileName, string[] FeildsToHide)
        //{
        //    var prpList = new List<String>();
        //    Type myType = req.GetType();
        //    IList<PropertyInfo> props = new List<PropertyInfo>(myType.GetProperties());
        //    var SalesReportData = data;
        //    foreach (var p in props)
        //    {
        //        var val = ((p.PropertyType == typeof(int?) || p.PropertyType == typeof(int)) && Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null)) == "0") || ((p.PropertyType == typeof(Decimal?) || p.PropertyType == typeof(Decimal)) && Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null)) == "0") || ((p.PropertyType == typeof(DateTime) || p.PropertyType == typeof(DateTime?) && Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null)) == "1/1/0001 12:00:00 AM")) || ((p.PropertyType == typeof(byte) || p.PropertyType == typeof(byte?) && Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null)) == "0")) ? "" : Convert.ToString(req.GetType().GetProperty(p.Name).GetValue(req, null));
        //        var colName = p.Name;
        //        prpList.Add(colName);
        //        if (!string.IsNullOrWhiteSpace(val))
        //        {
        //            SalesReportData = SalesReportData.AsQueryable().Where(Utilities.CreateSingleTextSearch<T>(val, colName).Compile()).ToList();
        //        }
        //    }
        //    var DataSet = ToDataSet(SalesReportData);
        //    foreach (var cname in FeildsToHide)
        //    {
        //        DataSet.Tables[0].Columns.Remove(cname);
        //    }
        //    ExportToExcel(DataSet, fileName + "-" + DateTime.Now.ToString("ddMMyyyyHHmmss"));
        //}






        //public static string Encrypt(string plainText)
        //{
        //    try
        //    {
        //        if (plainText == null) throw new ArgumentNullException("plainText");

        //        //encrypt data
        //        var data = Encoding.Unicode.GetBytes(plainText);
        //        byte[] encrypted = ProtectedData.Protect(data, null, DataProtectionScope.LocalMachine);

        //        //return as base64 string
        //        return Convert.ToBase64String(encrypted);
        //    }
        //    catch (Exception ex)
        //    {

        //        return string.Empty;
        //    }
        //}

        //public static string Decrypt(string cipher)
        //{
        //    try
        //    {
        //        if (cipher == null) throw new ArgumentNullException("cipher");

        //        //parse base64 string
        //        byte[] data = Convert.FromBase64String(cipher);

        //        //decrypt data
        //        byte[] decrypted = ProtectedData.Unprotect(data, null, DataProtectionScope.LocalMachine);
        //        return Encoding.Unicode.GetString(decrypted);
        //    }
        //    catch (Exception ex)
        //    {
        //        ExceptionManagement.ManageException(ex, "Decrypt", null);
        //        return string.Empty;
        //    }

        //}
    }
}
