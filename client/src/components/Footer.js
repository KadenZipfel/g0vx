import React from 'react';

import '../layout/components/footer.sass';

function Footer() {
  return(
    <footer className="footer">
      <p className="footer__text">
        Made with &hearts; by <a 
          className="footer__link" 
          href="https://github.com/KadenZipfel"
          target="_blank"
          rel="noopener noreferrer"
        >
           Kaden Zipfel
        </a>
      </p>
    </footer>
  );
}

export default Footer;