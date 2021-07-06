import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

import BrandService from "../../services/BrandService";

import { Table } from "../../components";

const columns = [{ field: "nome", headerName: "Marca", width: 200 }];

function BrandList() {
  const history = useHistory();

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();

  useEffect(loadBrands, []);

  async function loadBrands() {
    try {
      const dados = await BrandService.getAll();
      return setBrands(dados);
    } catch (e) {
      console.log(e);
    }
  }

  function updateBrand() {
    history.push("/alteracao-marca/" + selectedBrand.id);
  }

  async function deleteBrand() {
    try {
      await BrandService.delete(selectedBrand);
      setBrands(brands.filter((brand) => brand.id !== selectedBrand.id));
      setSelectedBrand(null);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Table
      rowsContent={brands}
      columns={columns}
      setSelectedItem={setSelectedBrand}
      selectedItem={selectedBrand}
      addItem={() => history.push("cadastro-marca")}
      updateItem={updateBrand}
      deleteItem={deleteBrand}
    />
  );
}

export default BrandList;
