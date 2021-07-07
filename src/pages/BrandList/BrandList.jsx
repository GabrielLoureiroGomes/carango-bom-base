import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Fab } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

import BrandService from "../../services/BrandService";

import { useStyles } from "./styles";

const columns = [{ field: "nome", headerName: "Marca", width: 200 }];

function BrandList() {
  const classes = useStyles();
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
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={brands}
        columns={columns}
        onRowSelected={(gridSelection) => setSelectedBrand(gridSelection.data)}
      />

      <div className={classes.actionsToolbar}>
        <Button
          className={classes.actions}
          variant="contained"
          color="secondary"
          disabled={!selectedBrand}
          onClick={deleteBrand}
        >
          Excluir
        </Button>
        <Button
          className={classes.actions}
          variant="contained"
          color="primary"
          disabled={!selectedBrand}
          onClick={updateBrand}
        >
          Alterar
        </Button>
      </div>

      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={() => history.push("/marca/cadastro")}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}

export default BrandList;
