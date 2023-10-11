import { useTheme } from '@mui/material/styles';
import {
  ArcElement,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Plugin,
  Legend,
  Filler,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const sampledata = {
  datasets: [
    {
      label: '# of Votes',
      data: [78, 32],
      backgroundColor: ['rgba(10, 140, 164, 1)', 'rgba(180, 58, 14, 0.72)'],
      borderWidth: 0,
      cutout: '85%',
      borderRadius: 50,
      spacing: 10,
      fillText: '20%',
    },
  ],
};

const deliveredOpt = {
  cutoutPercentage: 88,
  animation: {
    animationRotate: true,
    duration: 2000,
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
  title: {
    display: false,
  },
};
const doughnutPlugins = {
  id: 'textCenter',
  beforeDraw(chart: ChartJS, args: any, options: ChartOptions<'doughnut'>) {
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
    } = chart;
    ctx.save();
    console.log(ctx);
    ctx.font = '70px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.fillText(`$3.50`, width / 2, top + height / 2 - 50);
    ctx.fillText(`Day`, width / 2, top + height / 2 + 50);
  },
};
type IDoughnutChartProps = {
  data?: ChartData<'doughnut', number[], string>;
  options?: ChartOptions<'doughnut'>;
  plugins?: Plugin<'doughnut'>;
};
export function DoughNutChart(props: IDoughnutChartProps) {
  const {
    data = sampledata,
    options = deliveredOpt,
    plugins = doughnutPlugins,
  } = props;
  return <Doughnut data={data} options={options} plugins={[plugins]} />;
}
