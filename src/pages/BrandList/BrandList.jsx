import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Table } from "../../components";
import BrandService from "../../services/BrandService";

const columns = [{ field: "nome", headerName: "Marca", width: 200 }];

function BrandList() {
  const history = useHistory();

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();

  useEffect(loadBrands, []);

  function loadBrands() {
    BrandService.getAll().then((dados) => setBrands(dados));
  }

  function updateBrand() {
    history.push("/marca/" + selectedBrand.id);
  }

  function deleteBrand() {
    BrandService.delete(selectedBrand).then(() => {
      setBrands(brands.filter((brand) => brand.id !== selectedBrand.id));
      setSelectedBrand(null);
    });
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
