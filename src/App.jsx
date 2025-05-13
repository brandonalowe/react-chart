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
    // Reference to the Highcharts Chart
    const chart = chartRef.current?.chart;
    if (!chart) return;

    // Want to attach a listener event to each of the series in Chart
    // The same can be achieved with the legend.events.itemClick, however thee event
    // does not give you access to the specifc series that was clicked.
    chart.series.forEach((series) => {
      // Include this flag as to avoid duplicate event listeners being added due to re-renders.
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
        // Set flag to true once event listener has been added.
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
