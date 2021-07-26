import React from "react";

import UserService from "../../services/UserService";

import { Table } from "../../components";

const columns = [{ flex: 1, field: "username", headerName: "Nome" }];

function UserList() {
  return (
    <Table
      service={UserService}
      route="usuario"
      columns={columns}
      deleteOnly
      isAuth
    />
  );
}

export default UserList;
