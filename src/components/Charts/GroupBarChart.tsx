import { faker } from '@faker-js/faker';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,

  Tooltip,
  Legend
);

const sampleoptions: ChartOptions<'bar'> = {
  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
  },
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
      beginAtZero: true,
    },
    y: {
      display: true,
    },

    percentage: {
      position: 'right',
      type: 'linear',
      grid: {
        display: false,
      },
      display: false,
    },
  },
};

const labels = ['22', '23', '24', '25', '26', '27', '28'];

const sampledata: ChartData<'bar', number[], string> = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 200, max: 10000 })),
      backgroundColor: 'rgba(245, 123, 32, 1)',
      borderWidth: 1,
      borderRadius: 100,
      borderSkipped: false,
      barThickness: 20,
      barPercentage: 0.5,
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 10000 })),
      backgroundColor: '#f520c0',
      borderWidth: 1,
      borderRadius: 100,
      barThickness: 20,
      borderSkipped: false,
      yAxisID: 'percentage',
    },
  ],
};
type IGroupChartProps = {
  data?: ChartData<'bar', number[], string>;
  options?: ChartOptions<'bar'>;
};
export function GroupChart(props: IGroupChartProps) {
  const { data = sampledata, options = sampleoptions } = props;
  return <Bar options={options} data={data} />;
}
