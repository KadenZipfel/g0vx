import React from 'react';

import '../layout/components/header.sass';

function Header() {
  return(
    <section class="header">
      <h2 class="header__primary">G0VX is a Decentralized Governance Protocol</h2>
      <h4 class="header__secondary">Create and vote on organization proposals</h4>
    </section>
  );
}

export default Header;