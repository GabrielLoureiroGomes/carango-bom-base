import { client } from "../utils";

const brandUrl = "/api/brand";
const BrandService = {
  async register(brand) {
    return client(brandUrl, { method: "POST", body: brand });
  },

  async update(brand) {
    return client(`${brandUrl}/${brand.id}`, {
      method: "PATCH",
      body: { name: brand.name },
    });
  },

  async get(id) {
    return client(`${brandUrl}/${id}`);
  },

  async getAll() {
    return client(brandUrl);
  },

  async delete(id) {
    return client(`${brandUrl}/${id}`, { method: "DELETE" });
  },
};

export default BrandService;
