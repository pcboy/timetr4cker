import * as charts from 'echarts';
import type { EChartsOption } from 'echarts';

let resizeTimer: number | null = null;

export function echarts(node: HTMLDivElement | HTMLCanvasElement, option: EChartsOption) {
  const chart = charts.init(node);
  chart.setOption(option, {
    notMerge: true
  });

  // Add event listener for window resize
  window.addEventListener('resize', () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = setTimeout(() => {
      chart.resize();
    }, 100); // Debounce resize event
  });

  return {
    update(newOption: EChartsOption) {
      chart.setOption(newOption, { notMerge: true });
    },
    destroy() {
      chart.dispose();
      window.removeEventListener('resize', () => { });
    }
  };
}
