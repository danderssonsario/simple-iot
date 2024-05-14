using backend.DTOs;

namespace backend.Interfaces
{
    public interface IHumidityController
    {
        public List<RecordDTO> Get();
        public RecordDTO Get(int id);
        public List<ChartDataDTO> GetChartData();
        public RecordDTO GetLatest();
    }
}
