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
        brandId: 34,
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

  getDashboard() {
    return Promise.resolve({
      data: [
        {
          brand: "Fiat",
          totalPrice: 1000000,
          modelsAvailable: 20,
        },
        {
          brand: "Chevrolet",
          totalPrice: 2000000,
          modelsAvailable: 30,
        },
        {
          brand: "Ford",
          totalPrice: 500000,
          modelsAvailable: 10,
        },
        {
          brand: "Hyundai",
          totalPrice: 4000000,
          modelsAvailable: 40,
        },
        {
          brand: "Volkswagen",
          totalPrice: 50000,
          modelsAvailable: 1,
        },
        {
          brand: "Kia",
          totalPrice: 80000,
          modelsAvailable: 2,
        },
        {
          brand: "Pegeout",
          totalPrice: 10000000,
          modelsAvailable: 15,
        },
        {
          brand: "Citroen",
          totalPrice: 100000,
          modelsAvailable: 1,
        },
        {
          brand: "Honda",
          totalPrice: 1500000,
          modelsAvailable: 33,
        },
        {
          brand: "Jeep",
          totalPrice: 2500000,
          modelsAvailable: 5,
        },
      ],
    });
  },
};

export default VehicleService;
