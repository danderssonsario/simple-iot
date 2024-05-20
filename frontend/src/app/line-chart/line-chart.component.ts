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
  standalone: true,
})
export class LineChartComponent implements OnChanges {
  /**
   * Input data for the line chart.
   */
  @Input() humData: ChartData = {
    labels: [],
    datasets: [],
  };

  @Input() tempData: ChartData = {
    labels: [],
    datasets: [],
  };

  @Input() id:
    | string
    /**
     * The Chart.js instance for the line chart.
     */
    | undefined;

  /**
   * The Chart.js instance for the line chart.
   */
  chart!: Chart;

  /**
   * Initializes the line chart when the component is created.
   */
  ngOnInit(): void {
    const ctx = document.querySelector('canvas') as HTMLCanvasElement;
    console.log(this.tempData)
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  /**
   * Updates the line chart when input data changes.
   * @param changes - Object containing the changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tempData'] && this.tempData || changes['humData'] && this.humData && this.chart) {
      // Combine the labels and datasets from tempData and humData
      const combinedLabels =
        this.tempData.labels.length > this.humData.labels.length
          ? this.tempData.labels
          : this.humData.labels;

      // Merge the datasets
      const combinedDatasets = [
        ...this.tempData.datasets,
        ...this.humData.datasets,
      ];

      this.chart.data.labels = combinedLabels;
      this.chart.data.datasets = combinedDatasets;
      this.chart.update();
    }
  }
}
