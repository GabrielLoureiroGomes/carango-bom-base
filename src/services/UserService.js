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
};

export default UserService;
