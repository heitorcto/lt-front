import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader  from '../Loader/Loader.jsx';

function FormularioDesenvolvedor(props) {
    const [nome, setNome] = useState('');
    const [nivel, setNivel] = useState('');
    const [id, setId] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [retorno, setRetorno] = useState('');
    const [ocultarBotao, setOcultarBotao] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const getNome = (event) => {
        setNome(event.target.value)
    };

    const getNivel = (event) => {
        setNivel(event.target.value)
    }

    const getSubmit = async (event) => {
        event.preventDefault();
        setEnviando(true);

        if (props.acao === 'Cadastrar') {
            await axios.post('http://localhost/api/desenvolvedor/cadastrar', JSON.stringify({ nome, nivel }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                setRetorno(response.data);
                setEnviando(false);
            })
            .catch(error => {
                setRetorno(error.response.data.errors);
                setEnviando(false);
            });
        } else if (props.acao === 'Editar') {
            await axios.put('http://localhost/api/desenvolvedor/editar', JSON.stringify({ id: id, nome, nivel }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                setRetorno(response.data);
                setEnviando(false);
            })
            .catch(error => {
                setRetorno(error.response.data.errors);
                setEnviando(false);
            });
        }
    };

    useEffect(() => {
        if (props.acao === 'Editar') {
            const urlGetdata = window.location.href;
            setId(urlGetdata.split('=')[1]);
            setCarregando(true);
    
            axios.get('http://localhost/api/desenvolvedor/resgatar?id=' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                setNome(response.data.nome);
                setNivel(response.data.nivel);
                setCarregando(false);
            })
            .catch(() => {
                setCarregando(false);
                window.location.replace('/');
            });
        }

        if (retorno.mensagem !== undefined) {
            setOcultarBotao(true);
        }
    }, [id, retorno]);

    return (
        <div className="container mt-5 mb-5">
            {carregando && <Loader />}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h4 className="card-title text-center mb-4">Preencha o formulário</h4>
                            <form onSubmit={getSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nome" className="form-label">Nome:</label>
                                    <input className="form-control" type="text" disabled={carregando} value={nome ? nome : ''} id="nome" onChange={getNome} placeholder="Digite o nome do desenvolvedor" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nivel" className="form-label">Nível:</label>
                                    <select id="nivel" disabled={carregando} value={nivel ? nivel : ''} className="form-select" onChange={getNivel}>
                                        <option value="">Selecione uma opção</option>
                                        <option value="J">Júnior</option>
                                        <option value="P">Pleno</option>
                                        <option value="S">Sênior</option>
                                    </select>
                                </div>
                                {!ocultarBotao && <div className="text-center"><button type="submit" className="btn btn-primary">{ props.acao }</button></div>}

                                {enviando && <div className="alert alert-primary mt-3" role="alert">Enviando...</div>}
                                
                                {retorno.nome !== undefined && !enviando && <div className="alert alert-danger mt-3" role="alert">{retorno.nome}</div>}
                                {retorno.nivel !== undefined && !enviando && <div className="alert alert-danger mt-3" role="alert">{retorno.nivel}</div>}

                                {retorno.mensagem !== undefined && <div className="text-center"><a href="/" className="btn btn-primary">Voltar</a></div>}
                                {retorno.mensagem !== undefined && <div className="alert alert-success mt-3" role="alert">{retorno.mensagem}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormularioDesenvolvedor;
