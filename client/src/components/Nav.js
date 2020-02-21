import React from 'react';

import Message from './Message';

import '../layout/components/nav.sass';

function Nav(props) {
  let address;
  let button;

  if(props.account) {
    address = props.account
  }

  if(props.message) {
    button = <Message {...props} />
  } else {
    button = 
      <button className={address ? `nav__address` : 'nav__button'}>
        {address ? `${address.slice(0, 4)}...${address.slice(address.length - 4, address.length)}` : 'Connect to a Wallet'}
      </button>
  }

  return (
    <nav className="nav">
      <a href='/' className="nav__brand">
        G0VX
      </a>
      <h2 className="nav__token">
        {props.tokenName}
      </h2>
      {button}
    </nav>
  )
}

export default Nav;