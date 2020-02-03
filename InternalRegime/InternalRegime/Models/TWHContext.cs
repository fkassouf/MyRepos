using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;


namespace InternalRegime.Models
{
    public partial class TWHContext : DbContext
    {

        private SqlCommand cmd;
        private SqlConnection conn;

        public string CnnStr { get; set; }

        public TWHContext()
        {
            CnnStr = ConfigurationManager.AppSetting["ConnectionStrings:DefaultConnection"];
            conn = new SqlConnection(CnnStr);
            cmd = new SqlCommand();
            cmd.Connection = conn;
            cmd.CommandType = CommandType.StoredProcedure;
        }

        public TWHContext(DbContextOptions<TWHContext> options)
            : base(options)
        {
        }

   

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                
            }
        }




        public MemberModel VerifyMember(Int64 MemberId)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InternalRegime_VerifyMember";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@MemberId", MemberId);

            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<MemberModel>(reader);
                reader.Close();
                conn.Close();
                if (TBLList.Count > 0)
                {
                    return TBLList[0];
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public List<ItemModel> GetItems()
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InternalRegime_GetItems";
            cmd.Parameters.Clear();
            
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<ItemModel>(reader);
                reader.Close();
                conn.Close();
                
                return TBLList;
               

            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public List<ResultDatasetModel> GetResultsDataSet(int Year)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InternalRegime_GetResultsDataSet";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@Year", Year);
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<ResultDatasetModel>(reader);
                reader.Close();
                conn.Close();

                return TBLList;


            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public List<VotingModel> GetVotings(Int64 MemberId)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InternalRegime_GetVoting";
            cmd.Parameters.Clear();
            cmd.Parameters.AddWithValue("@MemberId", MemberId);
            string res = string.Empty;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                var reader = cmd.ExecuteReader();
                var TBLList = Utilities.GetProcedureToList<VotingModel>(reader);
                reader.Close();
                conn.Close();

                return TBLList;


            }
            catch (Exception ex)
            {
                throw ex;
            }


        }


        public int AddException(ExceptionModel Exception)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InternalRegime_AddException";
            cmd.Parameters.Clear();
            cmd.Parameters.Add("@InnerException", SqlDbType.NVarChar).Value = "";
            cmd.Parameters.Add("@StackTrace", SqlDbType.NVarChar).Value = Exception.StackTrace;
            cmd.Parameters.Add("@AbsoluteUrl", SqlDbType.NVarChar).Value = Exception.AbsoluteUrl;
            cmd.Parameters.Add("@MemberId", SqlDbType.BigInt).Value = Exception.MemberId;
            cmd.Parameters.Add("@MemberFullName", SqlDbType.NVarChar).Value = Exception.MemberFullName;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open)
                {
                    cmd.Connection.Open();
                }
                int id = cmd.ExecuteNonQuery();
                return id;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public void InternalRegimeVote(VotingModel Voting, Int64 MemberId)
        {
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.CommandText = "InternalRegime_Vote";
            cmd.Parameters.Clear();
            cmd.Parameters.Add("@Year", SqlDbType.Int).Value = Voting.VotingTime.Value.Year;
            cmd.Parameters.Add("@MemberId", SqlDbType.BigInt).Value = MemberId;
            cmd.Parameters.Add("@ItemId", SqlDbType.Int).Value = Voting.ItemId;
            cmd.Parameters.Add("@Agree", SqlDbType.Bit).Value = Voting.Voted;
            
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





        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}
