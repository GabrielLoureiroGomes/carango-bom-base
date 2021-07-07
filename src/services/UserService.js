const UserService = {
  signup(user) {
    // return Promise.reject("user");
    return fetch("https://carango-bom-api.herokuapp.com/marcas").then(
      (_response) => "jsonwebtoken"
    );
  },
};

export default UserService;
