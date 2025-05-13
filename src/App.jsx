import {
  Chart,
  Series,
  Highcharts
} from '@highcharts/react'
import { useEffect, useRef } from 'react'

function App() {
  let random_numbers = []
  for (let i = 0; i < 3; i++) {
    random_numbers.push([ ...Array(10).keys() ].map(Function.call, Math.random))
  }

  const chartRef = useRef(null);


  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;
    chart.series.forEach((series) => {
      if (!series.userOptions._legendClickAttached) {
        Highcharts.addEvent(series, 'legendItemClick', function (event) {
          event.preventDefault();

          const clickedSeries = this,
          allSeriesVisible = chart.series.every(s => s.visible || s === clickedSeries),
          isOnlyVisible = chart.series.every(s => !s.visible || s === clickedSeries);

          if (allSeriesVisible && !clickedSeries.visible) {
            chart.series.forEach(s => {
              s.setVisible(s === clickedSeries, false);
            })
          } 
          else if (isOnlyVisible) {
            chart.series.forEach(s => s.setVisible(true, false));
          } 
          else {
            clickedSeries.setVisible(clickedSeries.visible, false);
          }

          chart.redraw();
          return false;
        });

        series.userOptions._legendClickAttached = true;
      }
    });
  }, []);


  return (
    <Chart ref={chartRef}>
      {random_numbers.map(d => (
        <Series type="scatter" data={d} />
      ))}
    </Chart>
  )
}

export default App
