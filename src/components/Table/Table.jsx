import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, Fab } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

import useStyles from "./styles";

const Table = ({ service, route, columns, deleteOnly }) => {
  const classes = useStyles();
  const history = useHistory();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  const loadItems = useCallback(async () => {
    try {
      const result = await service.getAll();
      return setItems(result);
    } catch (e) {
      console.log(e);
    }
  }, [service, setItems]);

  useEffect(loadItems, [loadItems]);

  function addItem() {
    history.push(`/${route}/cadastro`);
  }

  function updateItem() {
    if (selectedItem) {
      history.push(`/${route}/` + selectedItem.id);
    }
  }

  async function deleteItem() {
    try {
      await service.delete(selectedItem);
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={items}
        columns={columns}
        onRowSelected={(gridSelection) => setSelectedItem(gridSelection.data)}
      />

      <div className={classes.actionsToolbar}>
        <Button
          className={classes.actions}
          variant="contained"
          color="secondary"
          disabled={!selectedItem}
          onClick={deleteItem}
        >
          Excluir
        </Button>

        {!deleteOnly ? (
          <>
            <Button
              className={classes.actions}
              variant="contained"
              color="primary"
              disabled={!selectedItem}
              onClick={updateItem}
            >
              Alterar
            </Button>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.fab}
              onClick={addItem}
            >
              <AddIcon />
            </Fab>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Table;
