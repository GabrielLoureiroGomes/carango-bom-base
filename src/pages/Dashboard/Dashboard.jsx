import React, { useCallback, useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { BarGraph } from "../../components";
import VehicleService from "../../services/VehicleService";
import { useStyles } from "./styles";

const convertValue = (value) => `${Math.floor(value / 10e2)}M`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [error, setError] = useState();
  const classes = useStyles();

  const loadDashboard = useCallback(async () => {
    try {
      const { data } = await VehicleService.getDashboard();
      setDashboardData(data);
    } catch (e) {
      setError(e.data);
    }
  }, [setDashboardData]);

  useEffect(loadDashboard, [loadDashboard]);

  return (
    <>
      {error ? (
        <Typography color="error" variant="subtitle1">
          {error}
        </Typography>
      ) : (
        <>
          <Typography variant="h1" className={classes.custom}>
            Modelos por marca
          </Typography>
          <BarGraph
            data={dashboardData}
            xAxis={{
              dataKey: "brand",
            }}
            barDataKey="modelsAvailable"
            color="#1D2671"
            name="Modelos disponíveis"
          />
          <Typography variant="h1" component="h2" className={classes.custom}>
            Preço total por marca
          </Typography>
          <BarGraph
            data={dashboardData}
            xAxis={{
              dataKey: "brand",
            }}
            yAxis={{
              tickFormatter: convertValue,
            }}
            unit="M"
            name="Preço total"
            barDataKey="totalPrice"
            color="#b21f1f"
          />
        </>
      )}
    </>
  );
};

export default Dashboard;
