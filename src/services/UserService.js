const UserService = {
  auth(userData) {
    return new Promise((resolve, reject) => {
      if ("username" in userData && "password" in userData) {
        resolve("jsonwebtoken");
      } else {
        reject();
      }
    });
  },
  signup(user) {
    return new Promise((resolve, reject) => {
      if ("username" in user && "password" in user) {
        resolve({
          status: 200,
          data: "jsonwebtoken",
        });
      } else {
        reject({
          status: 400,
          data: "Usuário já existe",
        });
      }
    });
  },
  getAll() {
    return Promise.resolve([
      {
        id: 1,
        name: "Wagner Lopes",
      },
      {
        id: 2,
        name: "Viviane Dias",
      },
    ]);
  },
  updatePassword(newPasswordPayload) {
    return new Promise((resolve, reject) => {
      if (
        "id" in newPasswordPayload &&
        "pastPassword" in newPasswordPayload &&
        "newPassword" in newPasswordPayload
      ) {
        resolve({
          status: 200,
          data: "jsonwebtoken",
        });
      } else {
        reject({
          status: 400,
          data: "Usuário já existe",
        });
      }
    });
  },
  delete(user) {
    return new Promise((resolve, reject) => {
      if ("id" in user) {
        resolve({
          status: 200,
        });
      } else {
        reject({
          status: 400,
        });
      }
    });
  },
};

export default UserService;
