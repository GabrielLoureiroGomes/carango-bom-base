import { wrapper } from "../utils";
const brandUrl = "/api/brand";

const BrandService = {
  async register(brand) {
    const req = fetch(brandUrl, {
      method: "POST",
      body: JSON.stringify(brand),
    });
    return wrapper(req);
  },

  async update(brand) {
    const req = fetch(`${brandUrl}/${brand.id}`, {
      method: "PATCH",
      body: JSON.stringify(brand),
    });
    return wrapper(req);
  },

  async get(id) {
    const req = fetch(`${brandUrl}/${id}`);
    return wrapper(req);
  },

  async getAll() {
    const req = fetch(brandUrl);
    return wrapper(req);
  },

  async delete(brand) {
    const req = fetch(`${brandUrl}/${brand.id}`, {
      method: "DELETE",
    });
    return wrapper(req);
  },
};

export default BrandService;
