import React from "react";
import { Button, Fab } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AddIcon from "@material-ui/icons/Add";

import { useStyles } from "./styles";

const Table = ({
  rowsContent,
  columns,
  setSelectedItem,
  selectedItem,
  addItem,
  deleteItem,
  updateItem,
}) => {
  const classes = useStyles();

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={rowsContent}
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
        <Button
          className={classes.actions}
          variant="contained"
          color="primary"
          disabled={!selectedItem}
          onClick={updateItem}
        >
          Alterar
        </Button>
      </div>

      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={addItem}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default Table;
