const BrandService = {
  register(brand) {
    return fetch('https://carango-bom-api.herokuapp.com/marcas', {
      method: 'POST',
      body: JSON.stringify(brand)
    }).then(r => r.json());
  },

  update(brand) {
    return fetch('https://carango-bom-api.herokuapp.com/marcas/' + brand.id, {
      method: 'PUT',
      body: JSON.stringify(brand)
    }).then(r => r.json());
  },

  get(id) {
    return fetch('https://carango-bom-api.herokuapp.com/marcas/' + id).then(r => r.json());
  },

  getAll() {
    return fetch('https://carango-bom-api.herokuapp.com/marcas').then(r => r.json());
  },

  delete(brand) {
    return fetch('https://carango-bom-api.herokuapp.com/marcas/' + brand.id, {
      method: 'DELETE',
    })
      .then(r => r.json());
  }
};

export default BrandService;
