import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import './SimpleFooter.css';

export default function SimpleFooter() {
  const { lang } = useLang();
  const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="sf-footer">
      <div className="sf-inner container">
        <div className="sf-brand">
          <img src={isDark ? '/assets/landing/logo1.png' : '/assets/landing/logo2.png'} alt="Masalmatik" className="sf-logo" />
          <span className="sf-name">Masalmatik</span>
        </div>

        <p className="sf-slogan">
          {lang === 'tr' ? 'Küçük hayalciler için sevgiyle yapıldı.' : 'Made with love for little dreamers.'}
        </p>

        <div className="sf-links">
          <Link to="/iletisim" className="sf-link">
            {lang === 'tr' ? 'İletişim' : 'Contact'}
          </Link>
          <span className="sf-sep">·</span>
          <Link to="/privacy" className="sf-link">
            {lang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
          </Link>
        </div>

        <p className="sf-copy">© 2026 Masalmatik</p>
      </div>
    </footer>
  );
}
