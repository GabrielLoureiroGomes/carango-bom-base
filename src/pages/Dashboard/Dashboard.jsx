import React, { useCallback, useEffect, useState } from "react";
import { Typography, Box } from "@material-ui/core";
import { BarGraph } from "../../components";
import DashboardService from "../../services/DashboardService";
import { useStyles } from "./styles";

const convertValue = (value) => `${Math.floor(value / 10e2)}M`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [error, setError] = useState();
  const classes = useStyles();

  const loadDashboard = useCallback(async () => {
    try {
      const data = await DashboardService.get();
      setDashboardData(data);
    } catch (e) {
      setError(e.message);
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
        <Box display="flex" alignItems="center" flexDirection="column">
          <Box marginBottom={5} marginTop={2.5}>
            <Typography
              variant="h1"
              className={classes.custom}
              paragraph
              align="left"
            >
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
          </Box>
          <Box>
            <Typography
              variant="h1"
              component="h2"
              className={classes.custom}
              paragraph
              align="left"
            >
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
          </Box>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
