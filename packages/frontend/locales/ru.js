module.exports = {
  AccountBalances: {
    'in original currency': 'в исходной валюте',
    today: 'сегодня',
    Balance: 'Остаток',
    Today: 'Сегодня',
    'hide zero balance': 'скрыть нулевые остатки',
    'show zero balance': 'показать нулевые остатки',
    Total: 'Всего',
  },
  AccountDailyBalances: {
    'in original currency': 'в исходной валюте',
    Total: 'Всего',
    'Daily Balance': 'Дневной остаток',
    Today: 'Сегодня',
  },
  Accounts: {
    Me: 'Я',
    'There are transactions on this account': 'Есть операции по данному счету',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    Name: 'Название',
    Active: 'Активный',
    Owner: 'Владелец',
    Permit: 'Права доступа',
    Type: 'Тип счета',
    Note: 'Примечание',
    Read: 'Просмотр',
    Edit: 'Изменение',
  },
  AccountWindow: {
    'Edit account': 'Редактировать',
    'Add new account': 'Новый счет',
    Name: 'Наименование',
    'Account type': 'Тип счета',
    Active: 'Активный',
    'Inactive accounts are hidden when creating or editing a transaction':
      'Неактивные счета скрыты при создании или редактировании операции',
    Note: 'Примечание',
    Permissions: 'Права доступа',
    View: 'Просмотр',
    'List of users who have the right to view transactions on this account':
      'Список пользователей, у которых есть право на просмотр операций по данному счету',
    Edit: 'Редактирование',
    'List of users who have the right to add, edit and delete transactions on this account':
      'Список пользователей, у которых есть право на добавление, редактирование и удаления операций по данному счету',
    Cancel: 'Отмена',
    Save: 'Сохранить',
  },
  BalanceRepository: {
    'Owe me': 'Должны мне',
    'I owe': 'Я должен',
  },
  CashFlow: {
    Overdue: 'Просрочено',
    Planned: 'Запланировано',
    'Not confirmed': 'Не подтверждено',
  },
  Categories: {
    "You can't delete a category with subcategories": 'Вы не можете удалить категорию с подкатегориями',
    "You can't delete a category with transaction_ Move them to another category_":
      'Вы не можете удалить категорию с транзакциями. Переместите их в другую категорию.',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    'Move transactions': 'Перенести операции',
    Name: 'Наименование',
    Active: 'Активная',
    Note: 'Примечание',
  },
  CategoryWindow: {
    'There is a cycle in the hierarchy': 'Есть зацикливание в иерархии',
    'Check data and try again': 'Проверти форму и попробуйте еще раз',
    'Edit category': 'Редактировать',
    'Add new category': 'Добавить новую категорию',
    Name: 'Наименование',
    'Parent category': 'Родительская категория',
    Prototype: 'Прототип',
    Active: 'Активная',
    'Show category when adding or editing an operation':
      'Показывать категорию при добавлении или редактировании операции',
    Note: 'Примечание',
    Cancel: 'Отмена',
    Save: 'Сохранить',
  },
  Contractors: {
    "You can't delete contractor with transaction": 'Вы не можете удалить контрагента с операциями',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    Name: 'Наименование',
    Note: 'Примечание',
  },
  ContractorWindow: {
    'Contractor already exists': 'Контрагент уже существует',
    'Edit contractor': 'Редактирование контрагента',
    'Add new contractor': 'Добавить контрагента',
    Name: 'Наименование',
    Note: 'Примечание',
    Cancel: 'Отмена',
    Save: 'Сохранить',
  },
  Dashboard: {
    Overview: 'Обзор',
  },
  DebtItem: {
    Income: 'Приход',
    Expense: 'Расход',
    'Please fill amount': 'Пожалуйста, укажите сумму',
    'Please enter a number': 'Пожалуйста, введите число',
    'Please select category': 'Пожалуйста, выберите категорию',
    'At first,': 'At first,',
    create: 'create',
    'at least one account_': 'at least one account.',
    'Add new debt record': 'Добавить запись',
    'Edit debt record': 'Редактировать запись',
    Amount: 'Сумма',
    Category: 'Категория',
    Account: 'Счет',
    Date: 'Дата',
    Period: 'Период',
    'Hide additional fields': 'Скрыть дополнительные поля',
    'Show additional fields': 'Показать дополнительные поля',
    'Note, Tags': 'Примечание, Теги',
    Note: 'Примечание',
    Tags: 'Теги',
    Cancel: 'Отмена',
    Save: 'Сохранить',
    'Save and Create New': 'Сохранить и создать еще',
  },
  Debts: {
    'Only debts with a non-zero balance': 'Только долги с ненулевым остатком',
    Debts: 'Долги',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    'Enter search request': 'Поиск',
    Counterparties: 'Контрагенты',
    Tags: 'Теги',
    More: 'Ещё',
    Date: 'Дата',
    Counterparty: 'Контрагент',
    Debt: 'Долг',
    Repayment: 'Возврат',
    'Debt balance': 'Остаток',
    Interest: 'Проценты',
    Fine: 'Пеня',
    Fee: 'Комиссия',
    'Cost (overpayment)': 'Стоимость (переплата)',
    Note: 'Примечание',
  },
  DebtWindow: {
    'Please select contractor': 'Пожалуйста, выберете контрагента',
    Debt: 'Debt',
    Contractor: 'Контрагент',
    Tags: 'Теги',
    Note: 'Примечание',
    Close: 'Закрыть',
    Save: 'Сохранить',
    New: 'Добавить',
    Delete: 'Удалить',
    Date: 'Дата',
    Account: 'Счет',
    Category: 'Категория',
    Amount: 'Сумма',
  },
  DistributionGraph: {
    Others: 'Другое',
  },
  DistributionReport: {
    Income: 'Доход',
    Expenses: 'Расход',
    'Net expenses (Expenses - Income)': 'Чистый расход (Расход - Доход)',
    Only: 'Только',
    Except: 'Кроме',
    'Use report period': 'Использовать отчетный период',
    'Reports — Distribution': 'Отчеты — Распределение',
    Parameters: 'Параметры',
    Accounts: 'Счета',
    Counterparties: 'Контрагенты',
    Categories: 'Категории',
    Tags: 'Теги',
    More: 'Ещё',
  },
  DistributionTable: {
    Category: 'Категория',
    Total: 'Итого',
    Others: 'Другое',
  },
  DynamicsReport: {
    Income: 'Доход',
    Expenses: 'Расход',
    'Net expenses (Expenses - Income)': 'Чистый расход (Расход - Доход)',
    'Balance (Income - Expenses)': 'Баланс (Доход - Расход)',
    Only: 'Только',
    Except: 'Кроме',
    'Use report period': 'Использовать отчетный период',
    'Consider planned operations': 'Учитывать запланированные операции',
    'Reports — Dynamics': 'Отчеты — Динамика',
    Parameters: 'Параметры',
    Accounts: 'Счета',
    Counterparties: 'Контрагенты',
    Categories: 'Категории',
    Tags: 'Теги',
    More: 'Ещё',
  },
  DynamicsTable: {
    Category: 'Категория',
    Total: 'Итого',
    Others: 'Другое',
  },
  Error: {
    'The requested resource is restricted and requires authentication_':
      'The requested resource is restricted and requires authentication.',
    'Could not connect to servers, please try again': 'Could not connect to servers, please try again',
    'Something wrong happened with server, please try again_':
      'Something wrong happened with server, please try again.',
    'Something went wrong, please try again': 'Something went wrong, please try again',
  },
  Exchanges: {
    Exchanges: 'Обмен валюты',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    'Enter search request': 'Поиск',
    'Sell accounts': 'Счета продажи',
    'Buy accounts': 'Счета покупки',
    Tags: 'Теги',
    Date: 'Дата',
    'Sell account': 'Счет продажи',
    'Buy account': 'Счет покупки',
    Sell: 'Продажа',
    Buy: 'Покупка',
    Rate: 'Курс',
    Fee: 'Комиссия',
    Note: 'Примечание',
  },
  ExchangeWindow: {
    'Please fill amount': 'Пожалуйста, укажите сумму',
    'Please enter a number': 'Пожалуйста, введите число',
    'Please select money': 'Пожалуйста, выберете валюту покупки',
    'Please select a money other than the money you are exchanging money from':
      'Please select a money other than the money you are exchanging money from',
    'Please fill fee': 'Пожалуйста, укажите комиссию',
    'Please select account': 'Пожалуйста, выберете счет',
    'At first,': 'At first,',
    create: 'create',
    'at least one account_': 'at least one account.',
    'Add new exchange record': 'Добавление обмена валюты',
    'Edit exchange record': 'Редактирование обемена валюты',
    Sell: 'Продажа',
    Buy: 'Покупка',
    'Sell account': 'Со счета',
    'Buy account': 'На счет',
    Date: 'Дата',
    Period: 'Период',
    Fee: 'Комиссия',
    'Fee account': 'Счет для списания комиссии',
    'Hide additional fields': 'Скрыть дополнительные поля',
    'Show additional fields': 'Показать дополнительные поля',
    'Note, Tags': 'Примечание, Теги',
    Note: 'Примечание',
    Tags: 'Теги',
    Cancel: 'Отмена',
    Save: 'Сохранить',
    'Save and Create New': 'Сохранить и создать еще',
  },
  Layout: {
    Home: 'На главную',
    Support: 'Поддержка',
  },
  MainLayout: {
    'Income & Expenses': 'Приходы и расходы',
    Debts: 'Долги',
    Transfers: 'Переводы',
    Exchanges: 'Обмен валюты',
    Planning: 'Планирование',
    Reports: 'Отчеты',
    Dynamics: 'Динамика',
    Distribution: 'Распределение',
    Settings: 'Настройки',
    Tools: 'Инструменты',
  },
  Moneys: {
    'There are transactions with this money': 'Есть операции с этой валютой',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    Name: 'Наименование',
    Symbol: 'Символ',
    Active: 'Активная',
    Currency: 'Валюта',
  },
  MoneyWindow: {
    'Money already exists': 'Валюта уже существует',
    "You can't delete money with transaction": 'Нельзя уделать валюту с операциями',
    'Please enter a number': 'Пожалуйста, введите число',
    'Edit money': 'Редактирование',
    'Add new money': 'Добавление',
    'Ordinary currency': 'Стандартная валюта',
    Name: 'Наименование',
    Symbol: 'Символ',
    'Displayed currency sign': 'Отображаемый знак валюты',
    Precision: 'Точность',
    'A number of symbols after comma': 'Количество знаков после запятой',
    Active: 'Активная',
    'Inactive money is hidden when creating or editing a transaction':
      'Неактивные валюты скрыты при создании или редактировании операции',
    Sorting: 'Порядок',
    Cancel: 'Отмена',
    Save: 'Сохранить',
  },
  MoveTransactionsWindow: {
    'Moved {{count}} transactions': 'Перенесено {{count}} операций',
    'You cannot move transaction to the same category without using the option "Move operations from subcategories"':
      'Нельзя переносить данные в ту же самую категорию без использования опции "Переносить операции из подкатегорий"',
    'Please select a category to move transaction to': 'Пожалуйста, выберите категорию, в которую переносить данные',
    'Move transactions from one category to another': 'Перенос операций из одной категории в другую',
    From: 'Из',
    To: 'В',
    'Move operations from subcategories': 'Переносить операции из подкатегорий',
    Cancel: 'Отмена',
    Move: 'Перенести',
  },
  Pagination: {
    of: 'из',
  },
  PlanTransaction: {
    'Planning - Incomes & Expenses': 'Планирование - Доходы и расходы',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    Date: 'Дата',
    Account: 'Счет',
    Counterparty: 'Контрагент',
    Category: 'Категория',
    Amount: 'Сумма',
    Schedule: 'Расписание',
    Note: 'Примечание',
  },
  PlanTransactionWindow: {
    Income: 'Приход',
    Expense: 'Расход',
    No: 'Нет',
    Daily: 'Ежедневно',
    Monthly: 'Ежемесячно',
    Quarterly: 'Ежеквартально',
    Annually: 'Ежегодно',
    Mon: 'Пн',
    Tue: 'Вт',
    Wed: 'Ср',
    Thu: 'Чт',
    Fri: 'Пт',
    Sat: 'Сб',
    Sun: 'Вс',
    Never: 'Никогда',
    After: 'После',
    'End date': 'Дата окончания',
    'Please fill amount': 'Пожалуйста, введите сумму',
    'Please enter a number': 'Пожалуйста, введите число',
    'Please select category': 'Пожалуйста, выберете категорию',
    'Please select date': 'Пожалуйста, выберете дату',
    'Please enter the days of the week': 'Пожалуйста, выберете дни недели',
    'Please enter the days of the month': 'Пожалуйста, выберете числа месяца',
    'Please select termination type': 'Пожалуйста, выберете условия завершения',
    'Please enter the number of repetitions': 'Пожалуйста, введите количество повторений',
    'Please enter a number more then 1': 'Пожалуйста, укажите число повторений более 1',
    'Please enter the date': 'Пожалуйста, укажите дату',
    'Please enter an end date greater than the start date': 'Пожалуйста, укажи дату окончания больше, чем дату начала',
    'Edit plan transaction': 'Редактирование плановой операции',
    'Add new plan transaction': 'Добавление плановой операции',
    Amount: 'Сумма',
    Category: 'Категория',
    Account: 'Счет',
    'Start date': 'Дата начала',
    Period: 'Период',
    'Repetition type': 'Повторять',
    'Repetition days': 'Дни повтора',
    'Termination type': 'Завершать',
    'Repetition count': 'Количество повторений',
    'Hide additional fields': 'Скрыть дополнительные поля',
    'Show additional fields': 'Показать дополнительные поля',
    'Quantity, Counterparty, Note, Tags': 'Количество, контрагент, примечание, теги, цвет метки',
    Counterparty: 'Контрагент',
    'Transaction note': 'Примечание операции',
    'Transaction tags': 'Теги операции',
    Note: 'Примечание',
    Cancel: 'Отмена',
    Save: 'Сохранить',
    'Save and Create New': 'Сохранить и создать еще',
  },
  ProjectCopyWindow: {
    'Copy project': 'Копировать',
    'Project to be copied': 'Копируемый проект',
    'Project name': 'Наименование проекта',
    Cancel: 'Отмена',
  },
  ProjectMergeWindow: {
    'Please select at least one project': 'Пожалуйста, выберете хотя бы один проект',
    'You must accept this': 'Необходимо принять это условие',
    'Merge projects': 'Объединить проекты',
    'Target project': 'Целевой проект',
    'Merged projects': 'Проекты для объединения',
    'I understand that the merged projects will be deleted after the data has been transferred to the target project':
      'Я понимаю, что объединяемые проекты будут удалены после переноса данных в целевой проект',
    Cancel: 'Отмена',
    Merge: 'Объединить',
  },
  Projects: {
    Me: 'Я',
    'Something went wrong, please try again': 'Что-то пошло не так. Пожалуйста, попытайтесь еще раз',
    'New project': 'Новый проект',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    Copy: 'Копировать',
    Merge: 'Объединить',
    Name: 'Наименование',
    Owner: 'Владелец',
    Permit: 'Права доступа',
    Note: 'Примечание',
  },
  ProjectWindow: {
    'That name is taken_ Try another_': 'Это имя занято. Попробуй другое.',
    'Edit project': 'Редактирование проекта',
    'New project': 'Новый проект',
    'Project name': 'Наименование проекта',
    'Project description (optional)': 'Описание проекта (опционально)',
    Permissions: 'Права доступа',
    Editors: 'Редактирование',
    'List of users who have the right to add, edit and delete transactions on this project':
      'Список пользователей, которые имеют право добавлять, редактировать и удалять транзакции в этом проекте',
    Cancel: 'Отмена',
    Save: 'Сохранить',
    'Create project': 'Создать',
  },
  QuantityField: {
    Quantity: 'Количество',
  },
  RangeSelect: {
    From: 'С',
    To: 'По',
  },
  ReportsRepository: {
    'Something went wrong, please try again later': 'Что-то пошло не так. Пожалуйста, попытайтесь еще раз позже',
  },
  ResetPassword: {
    'Please enter email address': 'Укажите email',
    'Please enter a valid email address': 'Проверьте, правильно ли введён email',
    'Forgot your Password?': 'Забыли пароль?',
    'User not found': 'Пользователь не найден',
    'To reset you password enter your email': 'Что бы сменить пароль, введите адрес электронной почты',
    Email: 'Email',
    Next: 'Продолжить',
  },
  ResetPasswordAcknowledgment: {
    'Reset password': 'Смена пароля',
    'An email has been sent to the specified email address_ Please open it and click on the link inside it to reset your password':
      'На указанный электронный адрес было отправлено письмо. Пожалуйста, откройте его и нажмите на ссылку внутри его для смены пароля',
  },
  ResetPasswordConfirmation: {
    'Please enter password': 'Укажите пароль',
    'Use 8 characters or more for your password': 'Введите не менее 8 символов',
    'Reset Password': 'Смена пароля',
    'The password has already been reset': 'Пароль уже был изменен',
    'Password reset request not found': 'Запрос на сброс пароля не найден',
    'New password': 'Новый пароль',
    'Use 8 or more characters with a mix of letters, numbers & symbols': 'Используйте 8 и более символом',
    Reset: 'Сменить пароль',
  },
  ResetPasswordConfirmationAcknowledgment: {
    'The password has been reset': 'Пароль был изменен',
    'Sign In': 'Войти',
  },
  Settings: {
    Accounts: 'Счета',
    Categories: 'Категории',
    Contractors: 'Контрагенты',
    Units: 'Единицы измерения',
    Tags: 'Теги',
    Money: 'Валюты',
    Projects: 'Проекты',
    Settings: 'Настройки',
  },
  SignIn: {
    'Invalid username or password': 'Неверный логин или пароль',
    'Please enter email address': 'Укажите email',
    'Please enter a valid email address': 'Проверьте, правильно ли введён email',
    'Please enter password': 'Укажите пароль',
    'Sign in': 'Авторизация',
    Email: 'Email',
    Password: 'Пароль',
    SignIn: 'Войти',
    'Forgot your Password?': 'Забыли пароль?',
    'New to FINEX?': 'Нет аккаунта?',
    'Create an account': 'Зарегистрироваться',
  },
  SignUp: {
    'Please enter your name': 'Укажите ваше имя',
    'Please enter email address': 'Укажите email',
    'Please enter a valid email address': 'Проверьте, правильно ли введён email',
    'Please enter password': 'Укажите пароль',
    'Use 8 characters or more for your password': 'Введите не менее 8 символов',
    'Create an FINEX account': 'Регистрация',
    'This email already registered': 'Пользователь с таким email уже зарегистрирован',
    Name: 'Имя',
    Email: 'Email',
    Password: 'Пароль',
    'Use 8 or more characters with a mix of letters, numbers & symbols': 'Используйте 8 и более символом',
    'Sign Up': 'Зарегистрироваться',
    'Already have an account?': 'Уже зарегистрировались?',
    'Sign In': 'Войти',
  },
  SignUpAcknowledgment: {
    'Please confirm your email address': 'Пожалуйста, подтвердите свой электронный адрес',
    'Thanks for signing up_ To complete your signup process, please open the confirmation email we just sent you on {{email}}, and click on the link_':
      'Спасибо за регистрацию. На адрес {{email}} было отправлено электронное письмо. Пожалуйста, откройте его и нажмите на ссылку внутри его для подтверждения электронного адреса.',
  },
  SignUpConfirmation: {
    'The email has already been confirmed': 'Ваш электронный адрес уже подтвержден',
    'Sign Up request not found': 'Запрос на регистрацию не найден',
    'This email already registered': 'Этот электронный адрес уже зарегистрирован',
    'Email confirmation': 'Подтверждение электронного адреса',
    Processing___: 'Обработка...',
    'You email has been confirmed_': 'Спасибо, Ваш электронный адрес подтверждён',
    'Start to use': 'Начать пользоваться',
  },
  Tags: {
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    Name: 'Наименование',
  },
  TagWindow: {
    'Tag already exists': 'Тег уже существует',
    'Add new tag': 'Добавление',
    'Edit tag': 'Редактирование',
    Name: 'Наименование',
    Cancel: 'Отмена',
    Save: 'Сохранить',
  },
  Transactions: {
    'Incomes and Expenses - Transactions': 'Приходы и расходы - Операции',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    'Enter search request': 'Поиск',
    Accounts: 'Счета',
    Categories: 'Категории',
    Counterparties: 'Контрагенты',
    Tags: 'Теги',
    Date: 'Дата',
    Account: 'Счет',
    Counterparty: 'Контрагент',
    Category: 'Категория',
    Income: 'Доход',
    Expense: 'Расход',
    Note: 'Примечание',
  },
  TransactionWindow: {
    Income: 'Доход',
    Expense: 'Расход',
    'Please fill amount': 'Пожалуйста, укажите сумму',
    'Please enter a number': 'Пожалуйста, введите число',
    'Please select category': 'Пожалуйста, выберите категорию',
    'At first,': 'At first,',
    create: 'create',
    'at least one account_': 'at least one account.',
    'Edit transaction': 'Edit transaction',
    'Add new transaction': 'Добавление операции',
    Amount: 'Сумма',
    Category: 'Категория',
    Account: 'Счет',
    Date: 'Дата',
    Period: 'Период',
    'Hide additional fields': 'Скрыть дополнительные поля',
    'Show additional fields': 'Показать дополнительные поля',
    'Quantity, Not confirmed, Note, Tags': 'Количество, Неподтвержденная операция, Примечание, Теги',
    'Not confirmed operation': 'Неподтвержденная операция',
    Note: 'Примечание',
    Tags: 'Теги',
    Cancel: 'Отмена',
    Save: 'Сохранить',
    'Save and Create New': 'Сохранить и создать еще',
  },
  Transfers: {
    Transfers: 'Переводы',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    'Enter search request': 'Enter search request',
    'From accounts': 'Со счетов',
    'To accounts': 'На счета',
    Tags: 'Теги',
    Date: 'Дата',
    'From account': 'Со счета',
    'To account': 'На счет',
    Amount: 'Сумма',
    Fee: 'Комиссия',
    Note: 'Примечание',
  },
  TransferWindow: {
    'Please fill amount': 'Пожалуйста, укажите сумму',
    'Please enter a number': 'Пожалуйста, укажите число',
    'Please fill fee': 'Пожалуйста, укажите комиссию',
    'Please select account': 'Please выберете счет',
    'Please select an account other than the account you are transferring money from':
      'Пожалуйста, выберите счет, отличный от счета, с которого переводите деньги',
    'At first,': 'At first,',
    create: 'create',
    'at least one account_': 'at least one account.',
    'Add new transfer record': 'Добавление',
    'Edit transfer record': 'Редактирование',
    Amount: 'Сумма',
    'From account': 'Со счета',
    'To account': 'На счет',
    Date: 'Дата',
    Period: 'Период',
    Fee: 'Комиссия',
    'Fee account': 'Счет комиссии',
    'Hide additional fields': 'Скрыть дополнительные поля',
    'Show additional fields': 'Показать дополнительные поля',
    'Note, Tags': 'Примечание, Теги',
    Note: 'Примечание',
    Tags: 'Теги',
    Cancel: 'Отмена',
    Save: 'Сохранить',
    'Save and Create New': 'Сохранить и создать еще',
  },
  Units: {
    "You can't delete unit with transaction": 'Нельзя удалить ед.измерения с операциями',
    New: 'Добавить',
    Delete: 'Удалить',
    Refresh: 'Обновить',
    Name: 'Наименование',
  },
  UnitWindow: {
    'Unit already exists': 'Ед.измерения уже существует',
    'Add new unit': 'Добавление',
    'Edit unit': 'Редактирование',
    Name: 'Наименование',
    Cancel: 'Отмена',
    Save: 'Сохранить',
  },
};
