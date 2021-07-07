const UserService = {
  signup(user) {
    return fetch("https://carango-bom-api.herokuapp.com/marcas").then(
      (_response) => ({
        id: 1,
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  },
};

export default UserService;
