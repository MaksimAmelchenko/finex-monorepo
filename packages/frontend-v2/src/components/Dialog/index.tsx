import { DialogContent, DialogOverlay } from '@reach/dialog';

import { use100vh } from '../../lib/react-div-100vh';
import { FunctionComponent } from 'preact/compat';

export interface IDialogProps {
  onDismiss?: () => unknown;
}

export const Dialog: FunctionComponent<IDialogProps> = ({ onDismiss, children }) => {
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
