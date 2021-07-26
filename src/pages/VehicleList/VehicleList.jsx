import React from "react";

import VehicleService from "../../services/VehicleService";

import { formatCurrency } from "../../utils";

import { Table } from "../../components";

function VehicleList({ isAuth }) {
  const columns = [
    {
      flex: 1,
      field: "brandName",
      headerName: "Marca",
    },
    { flex: 1, field: "model", headerName: "Modelo" },
    { flex: 1, field: "year", headerName: "Ano" },
    {
      flex: 1,
      field: "price",
      headerName: "Preço",
      valueGetter: (params) => formatCurrency(params.value),
    },
  ];

  return (
    <Table
      service={VehicleService}
      route="veiculo"
      columns={columns}
      isAuth={isAuth}
    />
  );
}

export default VehicleList;
