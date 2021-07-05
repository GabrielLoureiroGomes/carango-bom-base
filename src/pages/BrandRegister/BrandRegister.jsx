import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Button, TextField } from '@material-ui/core';

import useErrors from '../../hooks/useErrors';

import BrandService from '../../services/BrandService';

function BrandRegister() {
    const { id } = useParams();
    const history = useHistory();

    const [brand, setBrand] = useState("");

    const validations = {
        brand: value => {
            if (value && value.length >= 3) {
                return { valid: true };
            } else {
                return { valid: false, text: "Marca deve ter ao menos 3 letras." }
            }
        }
    }

    const [errors, validateFields, shouldSubmit] = useErrors(validations);

    function cancel() {
        history.goBack();
    }

    // TODO: Avaliar remover disable na próxima linha
    useEffect(() => {
        if (id) {
            BrandService.get(id)
                .then(m => setBrand(m.nome));
        }
    }, [id]); // eslint-disable-line

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            if (shouldSubmit()) {
                if (id) {
                    BrandService.update({ id, nome: brand })
                        .then(res => {
                            history.goBack();
                        });
                } else {
                    BrandService.register({ nome: brand })
                        .then(res => {
                            setBrand("");
                            history.goBack();
                        });
                }
            }
        }}>
            <TextField
                value={brand}
                onChange={evt => setBrand(evt.target.value)}
                onBlur={validateFields}
                helperText={errors.brand.text}
                error={!errors.brand.valid}
                name="brand"
                id="brand"
                label="Brand"
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
                disabled={!shouldSubmit()}>
                {id ? 'Alterar' : 'Cadastrar'}
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={cancel}>
                Cancelar
            </Button>
        </form>
    );
}

export default BrandRegister;