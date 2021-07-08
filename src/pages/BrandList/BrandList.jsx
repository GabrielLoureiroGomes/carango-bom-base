import React from "react";

import BrandService from "../../services/BrandService";

import { Table } from "../../components";

const columns = [{ field: "nome", headerName: "Marca", width: 200 }];

function BrandList() {
  return <Table service={BrandService} route="marca" columns={columns} />;
}

export default BrandList;
