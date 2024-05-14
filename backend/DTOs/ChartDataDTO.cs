using System;
using System.Collections.Generic;

namespace backend.DTOs
{
    public class ChartDataDTO
    {
        public Feed Feed { get; set; }
        public Parameters Parameters { get; set; }
        public List<string> Columns { get; set; }
        public List<List<Record>> Data { get; set; }
    }

    public class Feed
    {
        public int Id { get; set; }
        public string Key { get; set; }
        public string Name { get; set; }
    }

    public class Parameters
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Resolution { get; set; }
        public int Hours { get; set; }
        public string Field { get; set; }
    }

    public class Record
    {
        public string date { get; set; }
        public string value { get; set; }
    }
}
