import React, { useState, useEffect } from 'react';

function Topo() {
    const [isActive, setIsActive] = useState('');

    useEffect(() => {
        const windowSplit = window.location.href.split('/');
        const pathLength = windowSplit.length;

        if (! windowSplit[pathLength - 1]) {
            setIsActive('active');
        }
    }, []);

    return (
        <header className="bg-dark text-light py-3">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <div className="container-fluid">
                        <span className="navbar-brand">LT - Cloud</span>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav justify-content-center">
                                <li className="nav-item">
                                <a className={`nav-link ${ isActive }`} href="/">Desenvolvedores</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Topo;
