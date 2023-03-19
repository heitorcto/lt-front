import FormularioTelefone from "../components/FormularioTelefone/FormularioTelefone";
import Titulo from "../components/Titulo/Titulo";

function CadastrarTelefone() {
    return (
        <>
            <Titulo titulo="Cadastrar Telefone" />
            <FormularioTelefone acao="Cadastrar" />
        </>
    );
}

export default CadastrarTelefone;