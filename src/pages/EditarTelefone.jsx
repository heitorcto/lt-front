import FormularioTelefone from "../components/FormularioTelefone/FormularioTelefone";
import Titulo from "../components/Titulo/Titulo";

function CadastrarTelefone() {
    return (
        <>
            <Titulo titulo="Editar Telefone" />
            <FormularioTelefone acao="Editar" />
        </>
    );
}

export default CadastrarTelefone;