import React from "react";

import { Table } from "../../components";
import VehicleService from "../../services/VehicleService";
import { formatCurrency } from "../../utils";

const columns = [
  {
    flex: 1,
    field: "brandId",
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

function VehicleList({ isAuth }) {
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
