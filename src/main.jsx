// Imports
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Componentes principais
import Topo from './components/Topo/Topo'
import Rodape from './components/Rodape/Rodape'

// Pages
import Principal from "./pages/Principal";
import CadastrarDesenvolvedor from "./pages/CadastrarDesenvolvedor";
import EditarDesenvolvedor from "./pages/EditarDesenvolvedor";
import TabelaTelefone from "./pages/TabelaTelefone";
import CadastrarTelefone from "./pages/CadastrarTelefone";
import EditarTelefone from "./pages/EditarTelefone";


// Rotas
const router = createBrowserRouter([
    {
        path: "/",
        element: <Principal />,
    },
    {
        path: "/cadastrar-desenvolvedor",
        element: <CadastrarDesenvolvedor />
    },
    {
        path: "/editar-desenvolvedor",
        element: <EditarDesenvolvedor />
    },
    {
        path: "/listar-telefones-desenvolvedor",
        element: <TabelaTelefone />
    },
    {
        path: "/cadastrar-telefone-desenvolvedor",
        element: <CadastrarTelefone />
    },
    {
        path: "/editar-telefone-desenvolvedor",
        element: <EditarTelefone />
    }
]);

// Passando pro DOM
ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Topo />
            <RouterProvider router={router} />
        <Rodape />
    </React.StrictMode>
);