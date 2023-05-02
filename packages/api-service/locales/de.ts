export default {
  defaults: {
    projectName: 'Meine Finanzen',
    accountName: 'Bargeld',
  },
  export: {
    header: {
      date: 'Datum',
      accountName: 'Konto',
      type: 'Typ',
      categoryName1: 'Kategorie1',
      categoryName2: 'Kategorie2',
      categoryName3: 'Kategorie3',
      quantity: 'Menge',
      unitName: 'Einheit',
      sum: 'Summe',
      currencyName: 'Währung',
      contractorName: 'Gegenpartei',
      note: 'Anmerkung',
      tags: 'Tags',
    },
    operationType: {
      IncomeExpense: 'Einnahme/Ausgabe',
      Debt: 'Schuld',
      Transfer: 'Überweisung',
      Exchange: 'Währungsumtausch',
    },
  },
  transactionalEmails: {
    greeting: 'Hallo, {{name}}',
    signatureLine1: 'Mit freundlichen Grüßen,',
    signatureLine2: 'FINEX Team',
    signUpConfirmation: {
      subject: 'FINEX – Registrierungsbestätigung',
      message: 'Um die Registrierung abzuschließen, bestätigen Sie bitte, dass diese E-Mail-Adresse Ihnen gehört.',
      instruction: 'Um dies zu tun, folgen Sie dem Link:',
      ignore:
        'Wenn Sie sich nicht auf der Website für Haushaltsbuchhaltung finex.io registriert haben, ignorieren Sie diese Nachricht einfach.',
    },
    resetPassword: {
      subject: 'FINEX – Passwort zurücksetzen',
      greeting: 'Hallo,',
      instruction: 'Um das Passwort zurückzusetzen, folgen Sie dem Link:',
      ignore:
        'Wenn Sie kein Passwort zurücksetzen auf der Website für Haushaltsbuchhaltung finex.io angefordert haben, ignorieren Sie diese Nachricht einfach.',
    },
    export: {
      subject: 'FINEX – Datenexport',
      message: 'In der Anlage finden Sie Ihren Datenexport.',
    },
  },
};
