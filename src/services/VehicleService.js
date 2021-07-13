const VehicleService = {
  getAll() {
    return Promise.resolve([
      {
        id: 1,
        brand: {
          id: 34,
          name: "FORD",
        },
        model: "Ka",
        year: 2010,
        price: 15000,
      },
      {
        id: 2,
        brand: {
          id: 74,
          name: "CHEVROLET",
        },
        model: "Corsa",
        year: 2015,
        price: 22000,
      },
    ]);
  },

  get(id) {
    return {
      data: {
        id: 1,
        brand: {
          id: 34,
          nome: "FORD",
        },
        model: "Ka",
        year: 2010,
        price: 15000,
      },
    };
  },

  register(vehicle) {
    return new Promise((resolve, reject) => {
      if (
        "model" in vehicle &&
        "year" in vehicle &&
        "price" in vehicle &&
        "brandId" in vehicle
      ) {
        resolve();
      } else {
        reject({
          status: 404,
          data: "Marca não existe",
        });
      }
    });
  },

  update(vehicle) {
    return new Promise((resolve, reject) => {
      if (
        "model" in vehicle &&
        "year" in vehicle &&
        "price" in vehicle &&
        "brandId" in vehicle &&
        "id" in vehicle
      ) {
        resolve();
      } else {
        reject({
          status: 404,
          data: "Veículo não existe",
        });
      }
    });
  },

  delete() {
    return Promise.resolve();
  },
};

export default VehicleService;
