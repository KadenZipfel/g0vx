import React from 'react';
import '../layout/components/nav.sass';

function Nav(props) {
  let address;

  if(props.account) {
    address = props.account
  }

  return (
    <nav className="nav">
      <h1 className="nav__brand">
        G0VX
      </h1>
      <h2 className="nav__token">
        {props.tokenName}
      </h2>
      <button className={address ? `nav__address` : 'nav__button'}>
        {address ? address : 'Connect to a Wallet'}
      </button>
    </nav>
  )
}

export default Nav;