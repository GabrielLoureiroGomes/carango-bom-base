const VehicleService = {
  getAll() {
    return fetch("https://carango-bom-api.herokuapp.com/veiculos").then(
      (response) => response.json()
    );
  },
};

export default VehicleService;
