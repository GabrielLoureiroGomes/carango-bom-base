import { client } from "../utils";

const vehicleUrl = "/api/vehicle";
const VehicleService = {
  async register(vehicle) {
    return client(vehicleUrl, { method: "POST", body: vehicle });
  },

  async update(vehicle) {
    return client(`${vehicleUrl}/${vehicle.id}`, {
      method: "PATCH",
      body: { name: vehicle.name },
    });
  },

  async get(id) {
    return client(`${vehicleUrl}/${id}`);
  },

  async getAll() {
    return client(vehicleUrl);
  },

  async delete(id) {
    return client(`${vehicleUrl}/${id}`, { method: "DELETE" });
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
