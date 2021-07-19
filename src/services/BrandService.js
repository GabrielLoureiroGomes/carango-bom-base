const brandUrl = "/api/marcas";

const BrandService = {
  register(brand) {
    return fetch(brandUrl, {
      method: "POST",
      body: JSON.stringify(brand),
    }).then((response) => response.json());
  },

  update(brand) {
    return fetch(`${brandUrl}/${brand.id}`, {
      method: "PATCH",
      body: JSON.stringify(brand),
    }).then((response) => response.json());
  },

  get(id) {
    return fetch(`${brandUrl}/${id}`).then((response) => response.json());
  },

  getAll() {
    return fetch(brandUrl).then((response) => response.json());
  },

  delete(brand) {
    return fetch(`${brandUrl}/${brand.id}`, {
      method: "DELETE",
    }).then((response) => response.json());
  },
};

export default BrandService;
