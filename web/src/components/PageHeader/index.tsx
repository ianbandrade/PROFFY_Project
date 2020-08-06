import React from 'react';

import { Link } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import backIcon from '../../assets/images/icons/back.svg';

import './styles.css';

interface PageHeaderProps {
  title: String;
  subtitle?: String;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  subtitle,
  title,
  children,
}) => {
  return (
    <header className="page-header">
      <div className="top-bar-container">
        <Link to="/">
          <img src={backIcon} alt="Voltar." />
        </Link>
        <img src={logoImg} alt="Proffy logotipo." />
      </div>

      <div className="header-content">
        <strong>{title}</strong>
        {subtitle && <p>{subtitle}</p>}

        {children}
      </div>
    </header>
  );
};

export default PageHeader;
