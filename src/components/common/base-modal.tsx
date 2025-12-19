/* eslint-env browser */

import { Modal, ModalProps } from 'antd';
import { useCallback, useEffect } from 'react';

import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export interface BaseModalProps extends ModalProps {
  onOk?: (e: React.MouseEvent<unknown> | React.KeyboardEvent<unknown>) => void;
}

const BaseModal: React.FC<BaseModalProps> = ({ children, onOk, ...props }) => {
  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (props.open && onOk) {
        if (e.key === 'Enter') {
          // Prevent triggering if focusing a button (native behavior) or textarea
          const target = e.target as { tagName?: string };
          if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
            return;
          }
          // If it's an input, the form might handle it.
          // But if it's just a general modal, we might want to trigger ok.
          // Let's rely on standard form behavior for inputs inside forms (usually works).
          // If this is a confirmation modal, Enter should work.
          e.preventDefault();
          onOk(e);
        }
      }
    },
    [props.open, onOk]
  );

  useEffect(() => {
    // We attach listener to document because Modal attaches to body
    // But we only want this when this specific modal is top-most/active.
    // Antd Modal handles stack?
    // Simplest approach: Add listener when open is true.
    if (props.open) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.addEventListener('keydown', handleKeyDown as any);
    }
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [props.open, handleKeyDown]);

  return (
    <Modal
      keyboard={true} // Enable ESC to close
      maskClosable={true} // Enable clicking mask to close
      onOk={onOk}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
