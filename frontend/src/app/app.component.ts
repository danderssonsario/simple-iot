import { LineChartComponent } from './line-chart/line-chart.component';
import { HeaderComponent } from './header/header.component';
import { FormComponent } from './form/form.component';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { WebSocketService } from './services/WebSocketService';

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
  field: string;
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
  imports: [LineChartComponent, HeaderComponent, FormComponent],
  providers: [DatePipe],
  standalone: true,
})
export class AppComponent implements OnInit {
  temperatureData!: ChartFeedData;
  humidityData!: ChartFeedData;
  queryObject: QueryObject | null | undefined;
  tempChartData!: ChartData;
  humChartData!: ChartData;
  tempChartId: string = 'temp';
  humChartId: string = 'hum';
  private intervalId: any;

  constructor(
    private datePipe: DatePipe,
    private webSocketService: WebSocketService
  ) {}

  async ngOnInit() {
    this.submitFormData(null);
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

      if (this.queryObject?.resolution) {
        params.set('resolution', this.queryObject?.resolution.toString());
      }

      if (this.queryObject?.field) params.set('field', this.queryObject?.field);

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

  async mapResponseToChartData(response: ChartFeedData): Promise<ChartData> {
    const labels: string[] = response.data.map((dataPoint) => {
      // Extract the date and time parts of the timestamp
      const date = new Date(dataPoint[0]);
      const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd
      const time = date.toISOString().split('T')[1].substring(0, 5); // hh:mm
      return `${formattedDate} ${time}`;
    });

    let unit;
    if (response.feed.name === 'temperature') {
      unit = '°C';
    } else if (response.feed.name === 'humidity') {
      unit = '%';
    }
    const datasets: Dataset[] = [
      {
        label: response.feed.name + ` (${unit})`,
        data: response.data.map((dataPoint) => +dataPoint[1]),
      },
    ];
    return { labels, datasets };
  }

  title = 'frontend';

  async submitFormData(data: any) {
    this.queryObject = await this.mapToQueryObject(data);
    this.temperatureData = await this.getMeasurements(
      'da222xg',
      'picow.temperature'
    ); //dev
    this.humidityData = await this.getMeasurements('da222xg', 'picow.humidity');

    if (this.temperatureData) {
      this.tempChartData = await this.mapResponseToChartData(
        this.temperatureData
      );
    } else {
      this.tempChartData = { labels: [], datasets: [] }; //default value
    }

    if (this.humidityData) {
      this.humChartData = await this.mapResponseToChartData(this.humidityData);
    } else {
      this.humChartData = { labels: [], datasets: [] }; //default value
    }
  }

  async mapToQueryObject(data: any): Promise<QueryObject | undefined> {
    if (!data) return;

    const queryObject: QueryObject = {
      ...data,
      start_time:
        this.datePipe.transform(data.start_time, 'yyyy-MM-ddTHH:mm:ss') ?? '',
      end_time:
        this.datePipe.transform(data.end_time, 'yyyy-MM-ddTHH:mm:ss') ?? '',
    };

    return queryObject;
  }
}
