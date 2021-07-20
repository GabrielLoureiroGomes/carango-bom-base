import React from "react";
import { Table } from "../../components";
import BrandService from "../../services/BrandService";

const columns = [{ field: "name", headerName: "Marca", width: 200 }];

function BrandList() {
  return <Table service={BrandService} route="marca" columns={columns} />;
}

export default BrandList;
