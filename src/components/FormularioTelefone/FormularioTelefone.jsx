import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import axios from 'axios';
import Loader  from '../Loader/Loader.jsx';

function FormularioTelefone(props) {
    const [telefone, setTelefone] = useState('');
    const [idDev, setIdDev] = useState(0);
    const [idFone, setIdFone] = useState(0);
    const [verifyPath, setVerifyPath] = useState(true);
    const [load, setLoad] = useState(false);
    const [retorno, setRetorno] = useState([]);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        setVerifyPath(window.location.href.includes('idDev'));
        if (verifyPath === false) {
            window.location.replace('/');
        } else if (window.location.href.split('=').length === 1) {
            window.location.replace('/');
        } else if (window.location.href.split('=').length === 2) {
            if (window.location.href.split('=')[1] === '') {
                window.location.replace('/');
            }
        }

        setIdDev(window.location.href.split('=')[1].split('&')[0]);
        setIdFone(window.location.href.split('=')[2]);
    }, []);

    const getTelefone = (event) => {
        let replaceTelefone = event.target.value.replace('_', '');
        setTelefone(replaceTelefone);
    }

    const getSubmit = async (event) => {
        event.preventDefault();
        setEnviando(true);

        if (props.acao === 'Cadastrar') {
            await axios.post("http://localhost/api/telefone/cadastrar", JSON.stringify({ telefone: telefone, id_desenvolvedor: idDev }), {
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
            })
        } else if (props.acao === 'Editar') {
            await axios.put("http://localhost/api/telefone/editar", JSON.stringify({ id: idFone, id_desenvolvedor: idDev, telefone: telefone }), {
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
                if (error.response.data.message.errorInfo != undefined) {
                    setRetorno(error.response.data.message.errorInfo[0]);
                } else {
                    setRetorno(error.response.data.errors);
                }
                setEnviando(false);
            })
        }
    }

    useEffect(() => {
        if (props.acao === 'Editar') {
            setLoad(true);
    
            axios.get('http://localhost/api/telefone/resgatar?id=' + idFone, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                console.log(response.data.telefone);
                setTelefone(response.data.telefone);
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
                window.location.replace('/');
            });
        }
    }, [retorno, idFone]);

    return (
        <div className="container mt-5 mb-5">
            {load && <Loader />}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <a className="d-flex justify-content-center btn btn-primary text-center mb-3" href={`/listar-telefones-desenvolvedor?idDev=${idDev}`}>Voltar para os telefones do desenvolvedor</a>
                    <div className="card shadow">
                        <div className="card-body">
                            <h4 className="card-title text-center mb-4">Preencha o formulário</h4>
                            <form onSubmit={getSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="telefone" className="form-label">Telefone:</label>
                                    <InputMask type="text" disabled={load} value={telefone} mask="(99) 99999-9999" className="form-control" id="telefone" onChange={getTelefone} placeholder="Digite o número de telefone" />
                                </div>
                                {!retorno.mensagem && <div className="text-center"><button type="submit" className="btn btn-primary">{ props.acao }</button></div>}

                                {enviando && <div className="alert alert-primary mt-3" role="alert">Enviando...</div>}
                                {retorno == 23000 && !enviando && <div className="alert alert-danger mt-3" role="alert">Esse telefone já está sendo utilizado.</div> }
                                {retorno.telefone !== undefined && !enviando && <div className="alert alert-danger mt-3" role="alert">{retorno.telefone}</div>}

                                {retorno.mensagem !== undefined && <div className="text-center"><a href={`/listar-telefones-desenvolvedor?idDev=${idDev}`} className="btn btn-primary">Voltar</a></div>}
                                {retorno.mensagem !== undefined && <div className="alert alert-success mt-3" role="alert">{retorno.mensagem}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormularioTelefone;
