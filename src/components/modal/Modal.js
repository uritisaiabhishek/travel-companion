import React from 'react';
import './modal.scss';

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <h3>{title}</h3>

        <div className="modal-body">
          {children}
        </div>

        <button className="close-button" onClick={onClose}>
          x
        </button>

      </div>

    </div>
  );
};

export default Modal;
