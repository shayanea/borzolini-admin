
import { Modal, ModalProps } from 'antd';
import { useCallback, useEffect } from 'react';

export interface BaseModalProps extends ModalProps {
  onOk?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
}

const BaseModal: React.FC<BaseModalProps> = ({ children, onOk, ...props }) => {
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (props.open && onOk) {
      if (e.key === 'Enter') {
        // Prevent triggering if focusing a button (native behavior) or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') {
          return;
        }
        // If it's an input, the form might handle it. 
        // But if it's just a general modal, we might want to trigger ok.
        // Let's rely on standard form behavior for inputs inside forms (usually works).
        // If this is a confirmation modal, Enter should work.
        e.preventDefault();
        // @ts-ignore - Mocking the event object for onOk
        onOk(e as any);
      }
    }
  }, [props.open, onOk]);

  useEffect(() => {
    // We attach listener to document because Modal attaches to body
    // But we only want this when this specific modal is top-most/active.
    // Antd Modal handles stack? 
    // Simplest approach: Add listener when open is true.
    if (props.open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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
