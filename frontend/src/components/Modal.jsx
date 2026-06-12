import React, { useCallback, useEffect, useId, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const dialogRef = useRef(null);
  const instanceId = useId();
  const titleId = `modal-title-${instanceId}`;

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  // Focus trap: cycle Tab/Shift+Tab within the modal
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key !== 'Tab' || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" aria-labelledby={title ? titleId : undefined} role="dialog">
      <div ref={dialogRef} className="modal-content" onClick={(event) => event.stopPropagation()}>
        <button
          ref={closeButtonRef}
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Modal"
        >
          &times;
        </button>
        {title && <h3 id={titleId} className="modal-title">{title}</h3>}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
