import React, { FC } from 'react';
import { DialogContent, DialogOverlay } from '@reach/dialog';

import { use100vh } from '../../lib/react-div-100vh';

import './Dialog.module.scss';

export interface IDialogProps {
  onDismiss?: () => unknown;
  children: React.ReactNode;
}

export const Dialog: FC<IDialogProps> = ({ onDismiss, children }) => {
  const handleDismiss = () => {
    onDismiss && onDismiss();
  };

  const height = use100vh() || undefined;

  return (
    <DialogOverlay isOpen={true} onDismiss={handleDismiss}>
      <DialogContent
        aria-label="Dialog content"
        style={{
          height,
        }}
      >
        {children}
      </DialogContent>
    </DialogOverlay>
  );
};
