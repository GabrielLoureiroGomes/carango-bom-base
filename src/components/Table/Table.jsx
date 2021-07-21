import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, Fab, Box, Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

const Table = ({ service, route, columns, deleteOnly }) => {
  const history = useHistory();

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [{ status, error }, setStatus] = useState({
    status: "idle",
    error: null,
  });

  const loadItems = useCallback(async () => {
    try {
      setStatus({ status: "loading" });
      const result = await service.getAll();
      setItems(result);
      setStatus({ status: "fulfilled" });
    } catch (e) {
      setStatus({
        status: "rejected",
        error: "Houve um erro ao carregar os itens",
      });
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
      setStatus({ status: "loading" });
      await service.delete(selectedItem.id);
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
      setStatus({ status: "fulfilled" });
    } catch (e) {
      setStatus({
        status: "rejected",
        error: "Houve um erro ao deletar o item",
      });
    }
  }

  return (
    <div style={{ height: 300, width: "100%" }}>
      {status === "rejected" ? (
        <Typography color="error" variant="subtitle1" component="h2" paragraph>
          {error}
        </Typography>
      ) : null}

      <DataGrid
        rows={items}
        columns={columns}
        onRowSelected={(gridSelection) => setSelectedItem(gridSelection.data)}
        loading={status === "loading"}
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
        {!deleteOnly ? (
          <>
            <Button
              variant="contained"
              color="secondary"
              disabled={!selectedItem}
              onClick={updateItem}
            >
              Alterar
            </Button>
            <Fab
              color="secondary"
              aria-label="add"
              onClick={addItem}
              size="small"
            >
              <AddIcon />
            </Fab>
          </>
        ) : null}
      </Box>
    </div>
  );
};

export default Table;
