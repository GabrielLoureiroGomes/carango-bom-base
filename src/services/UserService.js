const UserService = {
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
