import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Titulo from '../components/Titulo/Titulo';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader/Loader';

function TabelaTelefone() {
    const [idDev, setIdDev] = useState(0);
    const [dadosDev, setDadosDev] = useState([]);
    const [telefones, setTelefones] = useState([]);
    const [verifyPath, setVerifyPath] = useState(true);
    const [carregandoNome, setCarregandoNome] = useState(true);
    const [carregandoLista, setCarregandoLista] = useState(true);
    const [carregandoAlteracaoLista, setcarregandoAlteracaoLista] = useState(false);
    const [idFone, setIdFone] = useState(true);
    const [quantidadeTelefones, setQuantidadeTelefones] = useState(0);
    const [paginate, setPaginate] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState('');
    const [numeroPaginaAtual, setNumeroPaginaAtual] = useState('');

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
        } else {
            window.location.replace('/');
        }

        setIdDev(window.location.href.split('=')[1]);
    }, []);

    const getIdFone = (idFone) => {
        setIdFone(idFone);
    }
    
    const chamarPagina = (novaPagina) => {
        setcarregandoAlteracaoLista(true);
        setPaginaAtual(novaPagina)
    }

    useEffect(() => {
        setPaginaAtual('http://localhost/api/telefone/listar?id_desenvolvedor=' + idDev);

        if (idDev !== 0) {
            axios.get('http://localhost/api/desenvolvedor/resgatar?id=' + idDev, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                setDadosDev(response.data);
                setCarregandoNome(false)
            })
            .catch(error => {
                window.location.replace('/');
            });
        }
    }, [idDev]);

    useEffect(() => {
        axios.get(paginaAtual, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            setTelefones(response.data.data);

            setQuantidadeTelefones(response.data.total)

            response.data.links.shift();
            response.data.links.pop();
            setPaginate(response.data.links);

            setNumeroPaginaAtual(response.data.current_page);

            setCarregandoLista(false);
            setcarregandoAlteracaoLista(false);
        })
        .catch(error => {
            setCarregandoLista(false);
            setcarregandoAlteracaoLista(false);
        })
    }, [paginaAtual, carregandoAlteracaoLista]);

    const deletarFone = async (idFone) => {
        setcarregandoAlteracaoLista(true);
        await axios.delete('http://localhost/api/telefone/excluir', {
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 
            data: JSON.stringify({ id: idFone })
        })
        .then(response => {
            setcarregandoAlteracaoLista(false);

            if (telefones.length === 1) {
                let paginaAnterior =  numeroPaginaAtual - 1
                chamarPagina('http://localhost/api/telefone/listar?id_desenvolvedor=' + idDev + '&page=' + paginaAnterior);
            }
        })
        .catch(error => {
            console.log(error.response);
        });
    }

    return (
        <div className="container py-3">
            <Titulo titulo="Telefone(s) do Desenvolvedor" />
            {carregandoNome && <Loader />}
            <h3 className="text-center ">{dadosDev.nome}</h3>
            <div className='text-center mt-5 mb-5'>
                <a href={`/cadastrar-telefone-desenvolvedor?idDev=` + idDev} className='btn btn-success'>Cadastrar Telefone</a>
            </div>
            {carregandoLista && <Loader />}
            {quantidadeTelefones > 0 && !carregandoLista && !carregandoNome && <table className="table table-bordered rounded table-striped text-center align-middle">
                <thead>
                    <tr>
                        <th>Telefone do Desenvolvedor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                
                <tbody>
                    {telefones.map(telefone => (
                        <tr key={telefone.id}>
                            <td>{telefone.telefone}</td>
                            <td>
                                <a href={`/editar-telefone-desenvolvedor?idDev=${idDev}&idFone=${telefone.id}`} className="btn btn-primary me-2 text-ligth">
                                    <FontAwesomeIcon icon={faEdit} />
                                </a>
                                <button onClick={() => getIdFone(telefone.id)} data-bs-toggle="modal" data-bs-target="#defaultModal" className="btn btn-danger text-ligth">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>}

            {!quantidadeTelefones && !carregandoLista && !carregandoNome && <div className="container my-5">
                <div className="row text-center justify-content-center">
                    <div className="col-md-6">
                        <img src="./aguardando-telefone-animado.gif" alt="Imagem relacionada a desenvolvimento web" className="img-fluid" />
                    </div>
                    <h2 className="mt-5 fw-bold">Cadastre o(s) contato(s) do desenvolvedor!</h2>
                </div>
            </div>}

            {quantidadeTelefones > 4 && <nav>
                <ul className="pagination pagination-lg d-flex justify-content-center mt-4">
                {paginate.map(pagina => (
                    <li key={pagina.label} onClick={() => chamarPagina(pagina.url + '&id_desenvolvedor=' + idDev)} className={`page-item ${pagina.active ? 'active' : ''}`} style={{cursor: 'pointer'}}>
                        <span className="page-link">{pagina.label}</span>
                    </li>))}
                </ul>
            </nav>}
            {carregandoAlteracaoLista && <Loader />}

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
                            <button  onClick={() => deletarFone(idFone)} data-bs-dismiss="modal" type="button" className="btn btn-danger">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TabelaTelefone;