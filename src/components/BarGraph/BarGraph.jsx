import React from "react";
import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Graph = ({ data, xAxis, barDataKey, color, yAxis, ...props }) => {
  return (
    <BarChart
      width={800}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid vertical={false} stroke="#DDD" />
      <XAxis {...xAxis} />
      <YAxis {...yAxis} />
      <Tooltip />
      <Legend />
      <Bar dataKey={barDataKey} fill={color} {...props} />
    </BarChart>
  );
};

export default Graph;
