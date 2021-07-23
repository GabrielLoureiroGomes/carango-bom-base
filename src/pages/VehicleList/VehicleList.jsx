import React from "react";

import { Table } from "../../components";
import VehicleService from "../../services/VehicleService";
import { formatCurrency } from "../../utils";

const columns = [
  {
    flex: 1,
    field: "brand",
    headerName: "Marca",
    valueGetter: (params) => params.value.name,
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

function VehicleList({ isAuth, dispatch }) {
  return (
    <Table
      service={VehicleService}
      route="veiculo"
      columns={columns}
      isAuth={isAuth}
      dispatch={dispatch}
    />
  );
}

export default VehicleList;
