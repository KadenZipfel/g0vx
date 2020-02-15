import React from 'react';
import '../layout/components/nav.sass';

function Nav(props) {
  return (
    <nav className="nav">
      <h1 className="nav__brand">
        G0VX
      </h1>
      <h2 className="nav__token">
        {props.tokenName}
      </h2>
      <button className="nav__button">
        Connect to a Wallet
      </button>
    </nav>
  )
}

export default Nav;