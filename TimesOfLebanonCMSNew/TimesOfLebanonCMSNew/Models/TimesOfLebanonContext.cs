using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;
using TimesOfLebanonCMSNew.utilities;

namespace TimesOfLebanonCMSNew.Models
{
    public partial class TimesOfLebanonContext : DbContext
    {

        private SqlCommand cmd;
        private SqlConnection conn;

       

        public TimesOfLebanonContext()
        {
            
            CnnStr = ConfigurationManager.AppSetting["ConnectionStrings:DefaultConnection"];
            conn = new SqlConnection(CnnStr);
            cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandType = CommandType.StoredProcedure;
        }

        public TimesOfLebanonContext(DbContextOptions<TimesOfLebanonContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Users> Users { get; set; }
        public string CnnStr { get; set; }

       

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {

                optionsBuilder.UseSqlServer(ConfigurationManager.AppSetting["ConnectionStrings:DefaultConnection"]);
            }
           
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.FullName).HasMaxLength(150);

                entity.Property(e => e.Password).HasMaxLength(50);

                entity.Property(e => e.Username).HasMaxLength(50);
            });
        }


        public Users Verify_User(string username, string password)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "Verify_User";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@UserName", username);

            cmd.Parameters.AddWithValue("@Password", password);


            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<Users>(reader);
                reader.Close();
                conn.Close();
                if (TBLList.Count > 0)
                    return TBLList[0];
                else
                    return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public List<Users> GetUsersList()
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "GetUsersList";
            cmd.Parameters.Clear();
            

            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<Users>(reader);
                reader.Close();
                conn.Close();
                return TBLList;
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }



        public Users GetUser(Int32 UserId)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "GetUser";
            cmd.Parameters.Clear();

            cmd.Parameters.AddWithValue("@UserId", UserId);
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<Users>(reader);
                reader.Close();
                conn.Close();
                if (TBLList.Count > 0)
                    return TBLList[0];
                else
                    return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }



        public List<Category> GetCategories()
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "GetCategories";
            cmd.Parameters.Clear();

            
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<Category>(reader);
                reader.Close();
                conn.Close();
                return TBLList;
              
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }




        public DatatableData<News> GetNewsRecords(Nullable<int> start, Nullable<int> length, string sortDir, string sortCol)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "GetNewsRecords";
            cmd.Parameters.Clear();
            cmd.Parameters.Add("@start", SqlDbType.Int).Value = start;
            cmd.Parameters.Add("@length", SqlDbType.Int).Value = length;
            cmd.Parameters.Add("@sortDirVal", SqlDbType.NVarChar).Value = sortDir;
            cmd.Parameters.Add("@sortCol", SqlDbType.NVarChar).Value = sortCol;
            cmd.Parameters.Add("@recordsTotal", SqlDbType.Int).Direction = ParameterDirection.Output;
            cmd.Parameters.Add("@recordsFiltered", SqlDbType.Int).Direction = ParameterDirection.Output;

            string res = string.Empty;
            var dtObj = new DatatableData<News>();
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<News>(reader);
                reader.Close();
                conn.Close();
                dtObj.recordsTotal = Convert.ToInt32(cmd.Parameters["@recordsTotal"].Value);
                dtObj.recordsFiltered = Convert.ToInt32(cmd.Parameters["@recordsFiltered"].Value);
                dtObj.data = TBLList;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return dtObj;

        }



        public void DeletePhoto(Int64 Id)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "DeletePhoto";
            cmd.Parameters.Clear();
            cmd.Parameters.Add("@Id", SqlDbType.BigInt).Value = Id;
            

           
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public void DeleteVideo(Int64 Id)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "DeleteVideo";
            cmd.Parameters.Clear();
            cmd.Parameters.Add("@Id", SqlDbType.BigInt).Value = Id;



            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public News GetNewsById(Int64 Id)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "GetNewsById";
            cmd.Parameters.Clear();
            cmd.Parameters.Add("@Id", SqlDbType.BigInt).Value = Id;



            string res = string.Empty;
            var dtObj = new DatatableData<News>();
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<News>(reader);
                reader.Close();
                conn.Close();
                if (TBLList.Count > 0)
                    return TBLList[0];
                else
                    return null;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            

        }


        public List<Status> GetStatuses()
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "GetStatuses";
            cmd.Parameters.Clear();


            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<Status>(reader);
                reader.Close();
                conn.Close();
                return TBLList;

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public void ChangePassword(Int32 UserId, string Password)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "ChangePassword";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@UserId", UserId);

            cmd.Parameters.AddWithValue("@NewPassword", Password);


            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteScalar();
                conn.Close();
                
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }



        public void InsertException(ExceptionModel exception)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InsertException";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@ActionName", exception.ActionName);

            cmd.Parameters.AddWithValue("@Exception", exception.Exception);
            cmd.Parameters.AddWithValue("@Message", exception.Message);
            cmd.Parameters.AddWithValue("@UserId", exception.UserId);
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteScalar();
                conn.Close();

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public bool CheckUserName(string UserName)
        {
            var exists = false;
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "CheckUserName";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@UserName", UserName);

            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                exists = (bool)cmd.ExecuteScalar();
                conn.Close();
                return exists;

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public Int32 InsertUser(Users user)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InsertUser";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@FullName", user.FullName);

            cmd.Parameters.AddWithValue("@UserName", user.Username);
            
            cmd.Parameters.AddWithValue("@Password", user.Password);
            cmd.Parameters.AddWithValue("@Active", user.Active);
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                decimal id = (decimal)cmd.ExecuteScalar();
                conn.Close();
                return Decimal.ToInt32(id);

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }



        public void InsertNews(News news)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InsertNews";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@Title", news.Title);
            cmd.Parameters.AddWithValue("@Subject", news.Subject);
            cmd.Parameters.AddWithValue("@UserId", news.CreationUserId);
            cmd.Parameters.AddWithValue("@StatusId", news.StatusId);
            
            cmd.Parameters.AddWithValue("@CategoryId", news.CategoryId);
            cmd.Parameters.AddWithValue("@IsBreaking", news.IsBreaking);

            if (news.Photo == null)
            {
                cmd.Parameters.AddWithValue("@Photo", DBNull.Value);
                cmd.Parameters.AddWithValue("@PhotoName", DBNull.Value);
            }
            else
            {
                cmd.Parameters.AddWithValue("@Photo", news.Photo);
                cmd.Parameters.AddWithValue("@PhotoName", news.PhotoName);
            }

            if (news.VideoPath == null)
            {
                cmd.Parameters.AddWithValue("@VideoPath", DBNull.Value);
            }
            else
            {
                cmd.Parameters.AddWithValue("@VideoPath", news.VideoPath);
            }

            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteScalar();
                conn.Close();
                

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public void UpdateNews(News news)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "UpdateNews";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@Id", news.Id);
            cmd.Parameters.AddWithValue("@Title", news.Title);
            cmd.Parameters.AddWithValue("@Subject", news.Subject);
            cmd.Parameters.AddWithValue("@UserId", news.UpdateUserId);
            cmd.Parameters.AddWithValue("@StatusId", news.StatusId);

            cmd.Parameters.AddWithValue("@CategoryId", news.CategoryId);
            cmd.Parameters.AddWithValue("@IsBreaking", news.IsBreaking);

            if (news.Photo == null)
            {
                cmd.Parameters.AddWithValue("@Photo", DBNull.Value);
                cmd.Parameters.AddWithValue("@PhotoName", DBNull.Value);
            }
            else
            {
                cmd.Parameters.AddWithValue("@Photo", news.Photo);
                cmd.Parameters.AddWithValue("@PhotoName", news.PhotoName);
            }

            if (news.VideoPath == null)
            {
                cmd.Parameters.AddWithValue("@VideoPath", DBNull.Value);
            }
            else
            {
                cmd.Parameters.AddWithValue("@VideoPath", news.VideoPath);
            }

            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteScalar();
                conn.Close();


            }
            catch (Exception ex)
            {
                throw ex;
            }


        }



        public void UpdateUser(Users user)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "UpdateUser";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@UserId", user.UserId);
            cmd.Parameters.AddWithValue("@FullName", user.FullName);

           
            cmd.Parameters.AddWithValue("@Active", user.Active);
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteScalar();
                conn.Close();
                

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public void SetPassword(Users user)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "ChangePassword";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@UserId", user.UserId);
            cmd.Parameters.AddWithValue("@NewPassword", user.Password);


            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                cmd.ExecuteScalar();
                conn.Close();


            }
            catch (Exception ex)
            {
                throw ex;
            }


        }
    }
}
