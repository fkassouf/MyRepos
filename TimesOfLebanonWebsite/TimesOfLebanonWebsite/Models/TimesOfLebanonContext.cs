using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using TimesOfLebanonCMSNew;

namespace TimesOfLebanonWebsite.Models
{
    public partial class TimesOfLebanonContext : DbContext
    {

        private SqlCommand cmd;
        private SqlConnection conn;

        public string CnnStr { get; set; }

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

        public virtual DbSet<Categories> Categories { get; set; }
        public virtual DbSet<InterfaceExceptionLogs> InterfaceExceptionLogs { get; set; }
        public virtual DbSet<News> News { get; set; }
        public virtual DbSet<Status> Status { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=FPM-IT-FKASSOUF;Database=TimesOfLebanon;Trusted_Connection=True;");
            }
        }




        public List<Categories> GetCategories()
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
                var TBLList = Utilities.GetProcedureToList<Categories>(reader);
                reader.Close();
                conn.Close();
                return TBLList;

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }



        public List<News> GetTodayNews()
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "GetTodayNewsRecords";
            cmd.Parameters.Clear();


            string res = string.Empty;
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
                return TBLList;

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
            cmd.Parameters.AddWithValue("@Id", Id);

            string res = string.Empty;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           
        }
    }
}
