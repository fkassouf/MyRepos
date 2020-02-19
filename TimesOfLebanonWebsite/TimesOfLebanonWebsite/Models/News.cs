using System;
using System.Collections.Generic;

namespace TimesOfLebanonWebsite.Models
{
    public partial class News
    {
        public Int64 Id { get; set; }

        public string Title { get; set; }

        public string Subject { get; set; }

        public DateTime CreationDate { get; set; }

        public Int32 CreationUserId { get; set; }

        public DateTime? UpdateDate { get; set; }

        public Int32? UpdateUserId { get; set; }

        public Int32? StatusId { get; set; }

        public string StatusName { get; set; }

        public string Photo { get; set; }

        public string PhotoName { get; set; }

        public Int32 CategoryId { get; set; }

        public string CategoryNameAR { get; set; }

        public bool IsBreaking { get; set; }

        public string VideoPath { get; set; }
    }
}
