import { LineChartComponent } from './line-chart/line-chart.component';
import { Component, OnInit } from '@angular/core';

interface Feed {
  id: number;
  key: string;
  name: string;
}

interface Parameters {
  start_time: string;
  end_time: string;
  resolution: number;
  hours: number;
  field: string;
}

type DataPoint = [string, string];

interface ChartFeedData {
    feed: Feed;
    parameters: Parameters;
    columns: string[];
    data: DataPoint[];
}

interface QueryObject {
  start_time: string;
  end_time: string;
  resolution: number;
  hours: number;
  field: string;
  raw: boolean;
}

// Define interface for line chart
interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

/**
 * Interface representing the data for each dataset on the line chart.
 */
interface Dataset {
  label: string;
  data: number[];
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [LineChartComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  temperatureData!: ChartFeedData;
  humidityData!: ChartFeedData;
  queryObject!: QueryObject;
  chartData!: ChartData;

  async ngOnInit() {
    this.temperatureData = await this.getMeasurements(
      'da222xg',
      'picow.temperature'
    ); //dev
    this.humidityData = await this.getMeasurements('da222xg', 'picow.humidity');

    if (this.temperatureData) {
      this.chartData = this.mapResponseToChartData(this.temperatureData);
    } else {
      this.chartData = { labels: [], datasets: [] }; // or any default value
    }

  }

  async getMeasurements(
    username: string,
    key: string
  ): Promise<ChartFeedData[] | any> {
    try {
      const url = `https://io.adafruit.com/api/v2/${username}/feeds/${key}/data/chart`;

      // Constructing query parameters
      const params = new URLSearchParams();
      if (this.queryObject?.start_time)
        params.set('start_time', this.queryObject?.start_time);

      if (this.queryObject?.end_time)
        params.set('end_time', this.queryObject?.end_time);

      if (this.queryObject?.resolution)
        params.set('resolution', this.queryObject?.resolution.toString());

      if (this.queryObject?.hours)
        params.set('hours', this.queryObject?.hours.toString());

      if (this.queryObject?.field) params.set('field', this.queryObject?.field);

      if (this.queryObject?.raw)
        params.set('raw', this.queryObject?.raw.toString());

      const response = await fetch(`${url}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ChartFeedData[] = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  mapResponseToChartData(response: ChartFeedData): ChartData {
    const labels: string[] = response.data.map(
      (dataPoint) => dataPoint[0]
    );
    const datasets: Dataset[] = [
      {
        label: response.feed.name,
        data: response.data.map((dataPoint) => +dataPoint[1]),
      },
    ];
    return { labels, datasets };
  }

  title = 'frontend';
}
