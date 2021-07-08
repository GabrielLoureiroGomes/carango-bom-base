const VehicleService = {
  getAll() {
    return Promise.resolve([
      {
        id: 1,
        brand: {
          id: 1,
          name: "Fiat",
        },
        model: "Uno",
        year: 2010,
        price: 15000,
      },
      {
        id: 2,
        brand: {
          id: 2,
          name: "Chevrolet",
        },
        model: "Corsa",
        year: 2015,
        price: 22000,
      },
    ]);
  },

  update() {
    return Promise.resolve();
  },

  delete() {
    return Promise.resolve();
  },
};

export default VehicleService;
