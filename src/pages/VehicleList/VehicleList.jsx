import React from "react";

import VehicleService from "../../services/VehicleService";

import { formatCurrency } from "../../utils";

import { Table } from "../../components";

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

function VehicleList() {
  return (
    <>
      olá {process.env.REACT_APP_API_URL}
      <Table service={VehicleService} route="veiculo" columns={columns} />;
    </>
  );
}

export default VehicleList;
