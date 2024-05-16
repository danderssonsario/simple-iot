import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

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
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  standalone: true
})
export class LineChartComponent implements OnChanges {
  /**
   * Input data for the line chart.
   */
  @Input() chartData: ChartData = {
    labels: [],
    datasets: []
  };

  /**
   * The Chart.js instance for the line chart.
   */
  chart!: Chart;

  /**
   * Initializes the line chart when the component is created.
   */
  ngOnInit(): void {
    console.log(this.chartData)
    const ctx = document.getElementById('line-chart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.chartData?.labels,
        datasets: this.chartData?.datasets,
      },
    });
  }

  /**
   * Updates the line chart when input data changes.
   * @param changes - Object containing the changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chartData) {
      if (this.chart) {
        this.chart.data.labels = this.chartData.labels;
        this.chart.data.datasets = this.chartData.datasets;
        this.chart.update();
      }
    }
  }
}
