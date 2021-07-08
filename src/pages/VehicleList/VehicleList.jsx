import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";

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
  const history = useHistory();

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState();

  const loadVehicles = useCallback(async () => {
    try {
      const dados = await VehicleService.getAll();
      return setVehicles(dados);
    } catch (e) {
      console.log(e);
    }
  }, [setVehicles]);

  useEffect(loadVehicles, [loadVehicles]);

  function updateVehicle() {
    history.push("/veiculo/" + selectedVehicle.id);
  }

  async function deleteVehicle() {
    try {
      await VehicleService.delete(selectedVehicle);
      setVehicles(
        vehicles.filter((vehicle) => vehicle.id !== selectedVehicle.id)
      );
      setSelectedVehicle(null);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Table
      rowsContent={vehicles}
      columns={columns}
      setSelectedItem={setSelectedVehicle}
      selectedItem={selectedVehicle}
      addItem={() => history.push("/veiculo/cadastro")}
      updateItem={updateVehicle}
      deleteItem={deleteVehicle}
    />
  );
}

export default VehicleList;
