import React, { useState } from "react";
import Chart from "react-apexcharts";

const RadialChart = () => {
  const data = {
    series: [44, 55, 67, 83],
    options: {
      chart: {
        type: "radialBar",
      },

      legend: {
        show: true,
        // showForSingleSeries: false,
        // showForNullSeries: true,
        // showForZeroSeries: true,
        position: "bottom",
        horizontalAlign: "center",
        floating: false,
        // fontSize: "14px",
        // fontFamily: "Helvetica, Arial",
        // fontWeight: 400,
        // formatter: undefined,
        // inverseOrder: false,
        // width: undefined,
        // height: undefined,
        // tooltipHoverFormatter: undefined,
        // customLegendItems: [],
        // offsetX: 10,
        // offsetY: 0,
        // labels: {
        //   colors: undefined,
        //   useSeriesColors: false,
        // },
        // markers: {
        //   width: 12,
        //   height: 12,
        //   strokeWidth: 0,
        //   strokeColor: "#fff",
        //   fillColors: undefined,
        //   radius: 12,
        //   customHTML: undefined,
        //   onClick: undefined,
        //   offsetX: 0,
        //   offsetY: 0,
        // },
        // itemMargin: {
        //   horizontal: 5,
        //   vertical: 0,
        // },
        // onItemClick: {
        //   toggleDataSeries: true,
        // },
        // onItemHover: {
        //   highlightDataSeries: true,
        // },
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Users",
              formatter: function (w) {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return 249;
              },
            },
          },
        },
      },
      labels: ["Suppliers", "Distributors", "Retailers", "Customers"],
    },
  };

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={data.options}
            series={data.series}
            type="radialBar"
            width="100%"
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default RadialChart;
