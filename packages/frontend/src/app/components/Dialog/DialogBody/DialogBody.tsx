import React, { FC } from 'react';

interface DialogBodyProps {
  children: React.ReactNode;
}

export const DialogBody: FC<DialogBodyProps> = ({ children }) => <main className="scrollable">{children}</main>;
