module.exports = {
  transactionalEmails: {
    greeting: 'Здравствуйте, {{name}}',
    signatureLine1: 'С уважением,',
    signatureLine2: 'Команда FINEX',
    signUpConfirmation: {
      subject: 'FINEX – Подтверждение регистрации',
      message: 'Для завершения регистрации подтвердите, что e-mail адрес действительно ваш.',
      instruction: 'Для этого перейдите по ссылке:',
      ignore:
        'Если вы не регистрировались на сайте домашней бухгалтерии finex.io, то просто проигнорируйте это сообщение.',
    },
    resetPassword: {
      subject: 'FINEX – Сброс пароля',
      greeting: 'Здравствуйте,',
      instruction: 'Для сброса пароля перейдите по ссылке:',
      ignore:
        'Если Вы не запрашивали сброс пароля на сайте домашней бухгалтерии finex.io, то просто проигнорируйте это сообщение.',
    },
    export: {
      subject: 'FINEX – Экспорт данных',
      message: 'Во вложении вы найдете экспорт ваших данных.',
    },
  },
};
