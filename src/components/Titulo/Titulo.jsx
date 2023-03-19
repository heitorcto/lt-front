import React from 'react';

function Titulo(props) {
    return (
        <div className="container mt-1 mb-1">
            <h1 className="text-center display-4 fw-bold mb-1">{ props.titulo }</h1>
        </div>
    );
}

export default Titulo;