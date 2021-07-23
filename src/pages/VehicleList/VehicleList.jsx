import React, { useState, useEffect, useCallback } from "react";

import BrandService from "../../services/BrandService";
import VehicleService from "../../services/VehicleService";

import { formatCurrency } from "../../utils";

import { Table } from "../../components";

function VehicleList({ isAuth }) {
  const [brands, setBrands] = useState([]);

  const loadBrands = useCallback(async () => {
    try {
      const data = await BrandService.getAll();
      return setBrands(data);
    } catch (e) {
      console.log(e.data);
    }
  }, [setBrands]);

  useEffect(loadBrands, [loadBrands]);

  const columns = [
    {
      flex: 1,
      field: "brandId",
      headerName: "Marca",
      valueGetter: (params) =>
        brands.find((brand) => brand.id === params.value)?.name,
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
