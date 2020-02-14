import React from 'react';
import '../layout/components/nav.sass';

function Nav() {
  return (
    <nav className="nav">
      <h1 className="nav__brand">
        G0VX
      </h1>
      <button className="nav__button">
        Connect to a Wallet
      </button>
    </nav>
  )
}

export default Nav;