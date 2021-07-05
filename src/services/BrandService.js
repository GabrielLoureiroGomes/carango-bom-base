const BrandService = {
  register(brand) {
    return fetch("https://carango-bom-api.herokuapp.com/marcas", {
      method: "POST",
      body: JSON.stringify(brand),
    }).then((response) => response.json());
  },

  update(brand) {
    return fetch("https://carango-bom-api.herokuapp.com/marcas/" + brand.id, {
      method: "PUT",
      body: JSON.stringify(brand),
    }).then((response) => response.json());
  },

  get(id) {
    return fetch("https://carango-bom-api.herokuapp.com/marcas/" + id).then(
      (response) => response.json()
    );
  },

  getAll() {
    return fetch("https://carango-bom-api.herokuapp.com/marcas").then(
      (response) => response.json()
    );
  },

  delete(brand) {
    return fetch("https://carango-bom-api.herokuapp.com/marcas/" + brand.id, {
      method: "DELETE",
    }).then((response) => response.json());
  },
};

export default BrandService;
