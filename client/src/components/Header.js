import React from 'react';

import '../layout/components/header.sass';

function Header() {
  return(
    <div className="header">
      <h2 className="header__primary">G0VX is a Decentralized Governance Protocol</h2>
      <h4 className="header__secondary">Create and vote on organization proposals</h4>
    </div>
  );
}

export default Header;