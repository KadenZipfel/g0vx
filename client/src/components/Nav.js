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
        {address ? address : 'Connect to a Wallet'}
      </button>
  }

  return (
    <nav className="nav">
      <h1 className="nav__brand">
        G0VX
      </h1>
      <h2 className="nav__token">
        {props.tokenName}
      </h2>
      {button}
    </nav>
  )
}

export default Nav;