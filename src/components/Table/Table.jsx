import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, Fab, Box } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

const Table = ({ service, route, columns }) => {
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

      <Box
        display="flex"
        alignItems="center"
        marginTop="10px"
        justifyContent="flex-end"
        gridGap="10px"
      >
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedItem}
          onClick={deleteItem}
        >
          Excluir
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={!selectedItem}
          onClick={updateItem}
        >
          Alterar
        </Button>
        <Fab color="secondary" aria-label="add" onClick={addItem} size="small">
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Table;
