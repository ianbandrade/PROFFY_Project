import React from 'react';

import whatsAppIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

const TeacherItem = () => {
  return (
    <article className="teacher-item">
      <header>
        <img
          src="https://avatars1.githubusercontent.com/u/47990172?s=460&u=7ca90ac41ea8e16ff9718bfd39b13cbc13e72ab4&v=4"
          alt="Ian Bittencourt"
        />
        <div>
          <strong>Ian Bittencourt</strong>
          <span>Física</span>
        </div>
      </header>
      <p>
        Professor de Física. Ministra e prepara o material didático das aulas de
        Física conforme orientação e conteúdo previamente distribuído, aplica
        provas, desenvolve trabalhos em aula e esclarece dúvidas.
      </p>

      <footer>
        <p>
          Preço por hora
          <strong>R$ 60,00</strong>
        </p>
        <button type="button">
          <img
            src={whatsAppIcon}
            alt="Ícone do WhatsApp para entrar em contato"
          />
          Entrar em contato
        </button>
      </footer>
    </article>
  );
};

export default TeacherItem;
