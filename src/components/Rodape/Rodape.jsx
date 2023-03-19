import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

function Rodape() {
    return (
        <footer className="bg-dark text-light py-3 fixed-bottom">
            <div className="container text-center">
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                <span>(18) 99727-9999 - contato@ltcloud.com.br</span>
                <p className="my-2">LT - Cloud &copy; 2023 </p>
            </div>
        </footer>
    );
}

export default Rodape;