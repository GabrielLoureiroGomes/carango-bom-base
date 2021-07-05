import { Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import useErros from "../hooks/useErros";
import MarcaService from "../services/MarcaService";

function CadastroMarca() {
	const [marca, setMarca] = useState("");

	const history = useHistory();

	const { id } = useParams();

	const validacoes = {
		marca: dado => {
			if (dado && dado.length >= 3) {
				return { valido: true };
			} else {
				return {
					valido: false,
					texto: "Marca deve ter ao menos 3 letras.",
				};
			}
		},
	};

	const [erros, validarCampos, possoEnviar] = useErros(validacoes);

	function cancelar() {
		history.goBack();
	}

	// TODO: Avaliar remover disable na próxima linha
	useEffect(() => {
		if (id) {
			MarcaService.consultar(id).then(m => setMarca(m.nome));
		}
	}, [id]); // eslint-disable-line

	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				if (possoEnviar()) {
					if (id) {
						MarcaService.alterar({ id, nome: marca }).then(res => {
							history.goBack();
						});
					} else {
						MarcaService.cadastrar({ nome: marca }).then(res => {
							setMarca("");
							history.goBack();
						});
					}
				}
			}}
		>
			<TextField
				value={marca}
				onChange={evt => setMarca(evt.target.value)}
				onBlur={validarCampos}
				helperText={erros.marca.texto}
				error={!erros.marca.valido}
				name="marca"
				id="marca"
				label="Marca"
				type="text"
				variant="outlined"
				fullWidth
				required
				margin="normal"
			/>

			<Button
				variant="contained"
				color="primary"
				type="submit"
				disabled={!possoEnviar()}
			>
				{id ? "Alterar" : "Cadastrar"}
			</Button>

			<Button variant="contained" color="secondary" onClick={cancelar}>
				Cancelar
			</Button>
		</form>
	);
}

export default CadastroMarca;
