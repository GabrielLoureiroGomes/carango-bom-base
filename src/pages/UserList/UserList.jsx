import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";

import UserService from "../../services/UserService";

import { Table } from "../../components";

const columns = [{ flex: 1, field: "name", headerName: "Nome" }];

function UserList() {
  const history = useHistory();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  const loadUsers = useCallback(async () => {
    try {
      const users = await UserService.getAll();
      return setUsers(users);
    } catch (e) {
      console.log(e);
    }
  }, [setUsers]);

  useEffect(loadUsers, [loadUsers]);

  function updateUser() {
    history.push("/usuario/" + selectedUser.id);
  }

  async function deleteUser() {
    try {
      await UserService.delete(selectedUser);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setSelectedUser(null);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Table
      rowsContent={users}
      columns={columns}
      setSelectedItem={setSelectedUser}
      selectedItem={selectedUser}
      addItem={() => history.push("/usuario/cadastro")}
      updateItem={updateUser}
      deleteItem={deleteUser}
    />
  );
}

export default UserList;
