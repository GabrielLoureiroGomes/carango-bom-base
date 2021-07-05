const MarcaService = {
	cadastrar(marca) {
		return fetch("https://carango-bom-api.herokuapp.com/marcas", {
			method: "POST",
			body: JSON.stringify(marca),
		}).then(r => r.json());
	},

	alterar(marca) {
		return fetch(
			"https://carango-bom-api.herokuapp.com/marcas/" + marca.id,
			{
				method: "PUT",
				body: JSON.stringify(marca),
			}
		).then(r => r.json());
	},

	consultar(id) {
		return fetch("https://carango-bom-api.herokuapp.com/marcas/" + id).then(
			r => r.json()
		);
	},

	listar() {
		return fetch("https://carango-bom-api.herokuapp.com/marcas").then(r =>
			r.json()
		);
	},

	excluir(marca) {
		return fetch(
			"https://carango-bom-api.herokuapp.com/marcas/" + marca.id,
			{
				method: "DELETE",
			}
		).then(r => r.json());
	},
};

export default MarcaService;
