module.exports = {
  transactionalEmails: {
    greeting: 'Hello, {{name}}',
    signatureLine1: 'Best regards,',
    signatureLine2: 'FINEX Team',
    signUpConfirmation: {
      subject: 'FINEX – Sign Up Confirmation',
      message: 'To complete the registration, please confirm that this email address is yours.',
      instruction: 'To do this, follow the link:',
      ignore: 'If you did not register on the finex.io home accounting website, then just ignore this message.',
    },
    resetPassword: {
      subject: 'FINEX – Reset Password',
      greeting: 'Hello,',
      instruction: 'To reset the password, follow the link:',
      ignore:
        'If you did not request a password reset on the finex.io home accounting website, then just ignore this message.',
    },
    export: {
      subject: 'FINEX – Data Export',
      message: 'In the attachment you will find your data export.',
    },
  },
};
