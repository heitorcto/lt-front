import FormularioDesenvolvedor from "../components/FormularioDesenvolvedor/FormularioDesenvolvedor";
import Titulo from "../components/Titulo/Titulo";

function EditarDesenvolvedor() {
    return (
        <>
            <Titulo titulo="Editar Desenvolvedor" />
            <FormularioDesenvolvedor acao="Editar" />
        </>
    );
}

export default EditarDesenvolvedor;