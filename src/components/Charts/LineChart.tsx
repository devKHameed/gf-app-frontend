import { faker } from '@faker-js/faker';
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend
);

export const sampleoptions = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,

  plugins: {
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    showLines: true,
  },
  scales: {
    y: {
      display: false,
    },
    y1: {
      display: false,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const sampledata = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: 'rgba(10, 140, 164, 1)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      borderColor: 'rgba(255, 145, 0, 1)',
      backgroundColor: 'rgba(255, 145, 0, 0.1)',
      fill: true,
    },
  ],
};
type ILineChartProps = {
  data?: ChartData<'line', number[], string>;
  options?: ChartOptions<'line'>;
};
export function LineChart(props: ILineChartProps) {
  const { options = sampleoptions, data = sampledata } = props;
  return <Line options={options} data={data} />;
}
