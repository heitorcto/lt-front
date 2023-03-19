import FormularioDesenvolvedor from "../components/FormularioDesenvolvedor/FormularioDesenvolvedor";
import Titulo from "../components/Titulo/Titulo";

function CadastrarDesenvolvedor() {
    return (
        <>
            <Titulo titulo="Cadastrar Desenvolvedor" />
            <FormularioDesenvolvedor acao="Cadastrar" />
        </>
    );
}

export default CadastrarDesenvolvedor;