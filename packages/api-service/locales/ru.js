module.exports = {
  defaults: {
    projectName: 'Мои финансы',
    accountName: 'Наличные',
  },
  export: {
    header: {
      date: 'Дата',
      accountName: 'Счет',
      type: 'Тип',
      categoryName1: 'Категория1',
      categoryName2: 'Категория2',
      categoryName3: 'Категория3',
      quantity: 'Количество',
      unitName: 'Ед. изм.',
      sum: 'Сумма',
      currencyName: 'Валюта',
      contractorName: 'Контрагент',
      note: 'Примечание',
      tags: 'Теги',
    },
    operationType: {
      IncomeExpense: 'Доход/Расход',
      Debt: 'Долг',
      Transfer: 'Перевод',
      Exchange: 'Обмен валюты',
    },
  },
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
