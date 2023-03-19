import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEdit, faTrash, faExclamation } from '@fortawesome/free-solid-svg-icons';
import Titulo from '../Titulo/Titulo';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Loader from '../Loader/Loader';

function TabelaDesenvolvedor(props) {
    const [desenvolvedores, setDesenvolvedores] = useState([]);
    const [buscando, setBuscando] = useState(true);
    const [buscandoPagina, setBuscandoPagina] = useState(false);
    const [paginate, setPaginate] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState('http://localhost/api/desenvolvedor/listar');
    const [quantidadePaginas, setQuantidadePaginas] = useState(0);
    const [idDev, setidDev] = useState(0);
    const [recarregar, setRecarregar] = useState(false);
    const [mensagemAlert, setMensagemAlert] = useState(false);
    const [nomeDev, setNomeDev] = useState('');

    const chamarPagina = (novaPagina) => {
        setPaginaAtual(novaPagina);
    }

    const getIdDev = (idDev) => {
        setidDev(idDev);
    }

    const deletarDev = async (idDev) => {
        setRecarregar(true);
        await axios.delete('http://localhost/api/desenvolvedor/excluir', {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            data: JSON.stringify({ id: idDev })
        })
        .then(response => {
            if (desenvolvedores.length === 1) {
                let paginaAnterior = paginaAtual.split('=')[1] - 1;
                setPaginaAtual("http://localhost/api/desenvolvedor/listar?page=" + paginaAnterior);
                if (paginate === true) {
                    setPaginate(false)
                }
            }
        })
        .catch(error => {
            setMensagemAlert(true);
            setTimeout(() => {
                setMensagemAlert(false);
            }, 5000);
        });
    }

    const getNomeDev = (event) => {
        setNomeDev(event.target.value)
    }

    const adicionarNome = (event) => {
        event.preventDefault();
        setPaginaAtual('http://localhost/api/desenvolvedor/listar?page=1');
        if (nomeDev != '') {
            setPaginaAtual("http://localhost/api/desenvolvedor/listar?page=1" + '&nome=' + nomeDev);
        }
    }
 
    useEffect(() => {
        if (buscando !== true) {
            setBuscandoPagina(true);
        }

        console.log(paginaAtual);

        axios.get(paginaAtual, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            setDesenvolvedores(response.data.data);
            console.log(response.data.data);

            if (response.data.total > 6) {
                setPaginate(true);
            }

            if (response.data.links !== undefined) {
                response.data.links.shift();
                response.data.links.pop();
                setQuantidadePaginas(response.data.links)
            }

            setBuscando(false);
            setBuscandoPagina(false);
            setRecarregar(false);
        });
    }, [paginaAtual, recarregar]);

    return (
        <div className="container py-3">
            <Titulo titulo="Desenvolvedores" />

            <div className='text-center mt-4 mb-4'>
                <a href="/cadastrar-desenvolvedor" className='btn btn-success'>Cadastrar Desenvolvedor</a>
            </div>

            <form onSubmit={adicionarNome}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" id="nomeDev" onChange={getNomeDev} placeholder="Digite o nome do desenvolvedor." />
                    <button className="btn btn-primary" type="submit">Buscar</button>
                </div>
            </form>

            {buscando && <Loader />}

            {!buscando && desenvolvedores && <table className="table table-bordered rounded table-striped text-center align-middle">
                <thead>
                    <tr>
                        <th>Nome do Desenvolvedor</th>
                        <th>Nível do Desenvolvedor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                
                <tbody>
                    {desenvolvedores.map(desenvolvedor => {
                        let nivelTratado = '';
                        switch (desenvolvedor.nivel) {
                            case 'J':
                                nivelTratado = 'Júnior'
                                break;
                            case 'P':
                                nivelTratado = 'Pleno'
                                break;
                            case 'S':
                                nivelTratado = 'Sênior'
                                break;
                        }

                        return (<tr key={desenvolvedor.id}>
                            <td>{desenvolvedor.nome}</td>
                            <td>{nivelTratado}</td>
                            <td>
                                <a href={`/listar-telefones-desenvolvedor?idDev=${desenvolvedor.id}`} className="btn btn-success me-2 text-ligth">
                                    <FontAwesomeIcon icon={faPhone} />
                                </a>
                                <a href={`/editar-desenvolvedor?idDev=${desenvolvedor.id}`} className="btn btn-primary me-2 text-ligth">
                                    <FontAwesomeIcon icon={faEdit} />
                                </a>
                                <button onClick={() => getIdDev(desenvolvedor.id)} data-bs-toggle="modal" data-bs-target="#defaultModal" className="btn btn-danger text-ligth">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>}

            {!buscando && !desenvolvedores &&  <div className="container my-5">
                <div className="row text-center justify-content-center">
                    <div className="col-md-6">
                        <img src="./aguardando-animado.gif" alt="Imagem relacionada a desenvolvimento web" className="img-fluid" />
                    </div>
                    <h2 className="mt-5 fw-bold">Está muito quieto por aqui, cadastre um novo desenvolvedor!</h2>
                </div>
            </div> }

            {paginate && <nav>
                <ul className="pagination pagination-lg d-flex justify-content-center mt-4">
                    {quantidadePaginas.map(pagina => { 
                        let paginaField = pagina.url;
                        if (nomeDev != '') {
                            paginaField = pagina.url + '&nome=' + nomeDev;
                        }
                        return ( <li key={pagina.label} onClick={() => chamarPagina(paginaField)} className={`page-item ${pagina.active ? 'active' : ''}`} style={{cursor: 'pointer'}}>
                            <span className="page-link">{pagina.label}</span>
                        </li>
                    )})}
                </ul>
            </nav>}
            {buscandoPagina && <Loader />}

            <div className="modal" id="defaultModal" tabIndex="-1" aria-labelledby="defaultModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="defaultModalLabel">Tem certeza que deseja excluir?</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Ao excluir esse desenvolvedor, ele não poderá ser recuperado, clique em "Excluir" para confirmar sua ação.
                        </div>
                        <div className="modal-footer">
                            {idDev && <button data-bs-dismiss="modal" onClick={() => deletarDev(idDev)} type="button" className="btn btn-danger">Excluir</button>}
                        </div>
                    </div>
                </div>
            </div>

            {mensagemAlert && <div className={`alert hide alert-danger position-fixed top-0 end-0 m-3`} role="alert">
                O desenvolvedor não pode ser deletado pois possui telefones, delete os telefones para efetuar ação.
            </div>}

        </div>
    );
}

export default TabelaDesenvolvedor;