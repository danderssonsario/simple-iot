﻿using backend.DTOs;

namespace backend.Interfaces
{
    public interface ITemperatureController
    {
        public List<MeasurementDTO> Get();
        public MeasurementDTO Get(int id);
        public List<ChartDataDTO> GetChartData();
        public MeasurementDTO GetLatest();

    }
}
