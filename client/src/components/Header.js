import React from 'react';

import '../layout/components/header.sass';

function Header(props) {
  return(
    <div className="header">
      <h2 className="header__primary">{props.token} Governance</h2>
      <h4 className="header__secondary">Create and vote on organization proposals</h4>
    </div>
  );
}

export default Header;