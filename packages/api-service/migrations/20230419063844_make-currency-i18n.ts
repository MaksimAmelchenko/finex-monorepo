import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('cf$').alterTable('currency', table => {
    table.smallint('precision').notNullable().defaultTo(2);
    table.specificType('name_new', 'jsonb');
    table.dropColumn('short_name');
  });

  await knex.raw(`
    merge into cf$.currency c
    using (
        select value ->> 'code' as code,
               value -> 'name' as name,
               (value ->> 'precision')::smallint as precision,
               coalesce(value ->> 'symbol', value ->> 'code') as symbol
          from jsonb_array_elements('[
            {"code": "AED", "name": {"de": "VAE-Dirham", "en": "United Arab Emirates Dirham", "ru": "Дирхам ОАЭ"}, "symbol": "د.إ", "precision": 2},
            {"code": "AFN", "name": {"de": "Afghanischer Afghani", "en": "Afghan Afghani", "ru": "Афганский афгани"}, "symbol": "؋", "precision": 2},
            {"code": "ALL", "name": {"de": "Albanischer Lek", "en": "Albanian Lek", "ru": "Албанский лек"}, "symbol": "L", "precision": 2},
            {"code": "AMD", "name": {"de": "Armenischer Dram", "en": "Armenian Dram", "ru": "Армянский драм"}, "symbol": "֏", "precision": 2},
            {"code": "ANG", "name": {"de": "Niederländisch-Antillen-Gulden", "en": "Netherlands Antillean Guilder", "ru": "Нидерландско-антильский гульден"}, "symbol": "ƒ", "precision": 2},
            {"code": "AOA", "name": {"de": "Angolanischer Kwanza", "en": "Angolan Kwanza", "ru": "Ангольская кванза"}, "symbol": "Kz", "precision": 2},
            {"code": "ARS", "name": {"de": "Argentinischer Peso", "en": "Argentine Peso", "ru": "Аргентинское песо"}, "symbol": "$", "precision": 2},
            {"code": "AUD", "name": {"de": "Australischer Dollar", "en": "Australian Dollar", "ru": "Австралийский доллар"}, "symbol": "A$", "precision": 2},
            {"code": "AWG", "name": {"de": "Aruba-Florin", "en": "Aruban Florin", "ru": "Арубанский флорин"}, "symbol": "ƒ", "precision": 2},
            {"code": "AZN", "name": {"de": "Aserbaidschan-Manat", "en": "Azerbaijani Manat", "ru": "Азербайджанский манат"}, "symbol": "₼", "precision": 2},
            {"code": "BAM", "name": {"de": "Bosnien und Herzegowina Konvertible Mark", "en": "Bosnia-Herzegovina Convertible Mark", "ru": "Конвертируемая марка Боснии и Герцеговины"}, "symbol": "KM", "precision": 2},
            {"code": "BBD", "name": {"de": "Barbadischer Dollar", "en": "Barbadian Dollar", "ru": "Барбадосский доллар"}, "symbol": "Bds$", "precision": 2},
            {"code": "BDT", "name": {"de": "Bangladesch-Taka", "en": "Bangladeshi Taka", "ru": "Бангладешская така"}, "symbol": "৳", "precision": 2},
            {"code": "BGN", "name": {"de": "Bulgarischer Lew", "en": "Bulgarian Lev", "ru": "Болгарский лев"}, "symbol": "лв", "precision": 2},
            {"code": "BHD", "name": {"de": "Bahrain-Dinar", "en": "Bahraini Dinar", "ru": "Бахрейнский динар"}, "symbol": ".د.ب", "precision": 3},
            {"code": "BIF", "name": {"de": "Burundi-Franc", "en": "Burundian Franc", "ru": "Бурундийский франк"}, "symbol": "FBu", "precision": 2},
            {"code": "BMD", "name": {"de": "Bermuda-Dollar", "en": "Bermudan Dollar", "ru": "Бермудский доллар"}, "symbol": "BD$", "precision": 2},
            {"code": "BND", "name": {"de": "Brunei-Dollar", "en": "Brunei Dollar", "ru": "Брунейский доллар"}, "symbol": "B$", "precision": 2},
            {"code": "BOB", "name": {"de": "Bolivianischer Boliviano", "en": "Bolivian Boliviano", "ru": "Боливийский боливиано"}, "symbol": "Bs.", "precision": 2},
            {"code": "BRL", "name": {"de": "Brasilianischer Real", "en": "Brazilian Real", "ru": "Бразильский реал"}, "symbol": "R$", "precision": 2},
            {"code": "BSD", "name": {"de": "Bahama-Dollar", "en": "Bahamian Dollar", "ru": "Багамский доллар"}, "symbol": "B$", "precision": 2},
            {"code": "BTN", "name": {"de": "Bhutan-Ngultrum", "en": "Bhutanese Ngultrum", "ru": "Бутанский нгултрум"}, "symbol": "Nu.", "precision": 2},
            {"code": "BWP", "name": {"de": "Botswanischer Pula", "en": "Botswanan Pula", "ru": "Ботсванская пула"}, "symbol": "P", "precision": 2},
            {"code": "BYN", "name": {"de": "Weißrussischer Rubel", "en": "Belarusian Ruble", "ru": "Белорусский рубль"}, "symbol": "Br", "precision": 2},
            {"code": "BZD", "name": {"de": "Belize-Dollar", "en": "Belize Dollar", "ru": "Белизский доллар"}, "symbol": "BZ$", "precision": 2},
            {"code": "CAD", "name": {"de": "Kanadischer Dollar", "en": "Canadian Dollar", "ru": "Канадский доллар"}, "symbol": "CA$", "precision": 2},
            {"code": "CDF", "name": {"de": "Kongo-Franc", "en": "Congolese Franc", "ru": "Конголезский франк"}, "symbol": "FC", "precision": 2},
            {"code": "CHF", "name": {"de": "Schweizer Franken", "en": "Swiss Franc", "ru": "Швейцарский франк"}, "symbol": "CHF", "precision": 2},
            {"code": "CLP", "name": {"de": "Chilenischer Peso", "en": "Chilean Peso", "ru": "Чилийское песо"}, "symbol": "CLP$", "precision": 2},
            {"code": "CNY", "name": {"de": "Chinesischer Yuan", "en": "Chinese Yuan", "ru": "Китайский юань"}, "symbol": "¥", "precision": 2},
            {"code": "COP", "name": {"de": "Kolumbianischer Peso", "en": "Colombian Peso", "ru": "Колумбийское песо"}, "symbol": "COL$", "precision": 2},
            {"code": "CRC", "name": {"de": "Costa-Rica-Colón", "en": "Costa Rican Colón", "ru": "Костариканский колон"}, "symbol": "₡", "precision": 2},
            {"code": "CUC", "name": {"de": "Kubanischer Konvertibler Peso", "en": "Cuban Convertible Peso", "ru": "Кубинское конвертируемое песо"}, "symbol": "CUC$", "precision": 2},
            {"code": "CUP", "name": {"de": "Kubanischer Peso", "en": "Cuban Peso", "ru": "Кубинское песо"}, "symbol": "CUP$", "precision": 2},
            {"code": "CVE", "name": {"de": "Kapverdischer Escudo", "en": "Cape Verdean Escudo", "ru": "Эскудо Кабо-Верде"}, "symbol": "Esc", "precision": 2},
            {"code": "CZK", "name": {"de": "Tschechische Krone", "en": "Czech Republic Koruna", "ru": "Чешская крона"}, "symbol": "Kč", "precision": 2},
            {"code": "DJF", "name": {"de": "Dschibuti-Franc", "en": "Djiboutian Franc", "ru": "Джибутийский франк"}, "symbol": "Fdj", "precision": 2},
            {"code": "DKK", "name": {"de": "Dänische Krone", "en": "Danish Krone", "ru": "Датская крона"}, "symbol": "kr", "precision": 2},
            {"code": "DOP", "name": {"de": "Dominikanischer Peso", "en": "Dominican Peso", "ru": "Доминиканское песо"}, "symbol": "RD$", "precision": 2},
            {"code": "DZD", "name": {"de": "Algerischer Dinar", "en": "Algerian Dinar", "ru": "Алжирский динар"}, "symbol": "د.ج", "precision": 2},
            {"code": "EGP", "name": {"de": "Ägyptisches Pfund", "en": "Egyptian Pound", "ru": "Египетский фунт"}, "symbol": "E£", "precision": 2},
            {"code": "ERN", "name": {"de": "Eritreischer Nakfa", "en": "Eritrean Nakfa", "ru": "Эритрейская накфа"}, "symbol": "Nfk", "precision": 2},
            {"code": "ETB", "name": {"de": "Äthiopischer Birr", "en": "Ethiopian Birr", "ru": "Эфиопский быр"}, "symbol": "Br", "precision": 2},
            {"code": "EUR", "name": {"de": "Euro", "en": "Euro", "ru": "Евро"}, "symbol": "€", "precision": 2},
            {"code": "FJD", "name": {"de": "Fidschi-Dollar", "en": "Fijian Dollar", "ru": "Фиджийский доллар"}, "symbol": "FJ$", "precision": 2},
            {"code": "FKP", "name": {"de": "Falkland-Pfund", "en": "Falkland Islands Pound", "ru": "Фунт Фолклендских островов"}, "symbol": "FK£", "precision": 2},
            {"code": "GBP", "name": {"de": "Britisches Pfund", "en": "British Pound Sterling", "ru": "Британский фунт стерлингов"}, "symbol": "£", "precision": 2},
            {"code": "GEL", "name": {"de": "Georgischer Lari", "en": "Georgian Lari", "ru": "Грузинский лари"}, "symbol": "₾", "precision": 2},
            {"code": "GHS", "name": {"de": "Ghanaischer Cedi", "en": "Ghanaian Cedi", "ru": "Ганский седи"}, "symbol": "GH₵", "precision": 2},
            {"code": "GIP", "name": {"de": "Gibraltar-Pfund", "en": "Gibraltar Pound", "ru": "Гибралтарский фунт"}, "symbol": "GI£", "precision": 2},
            {"code": "GMD", "name": {"de": "Gambia-Dalasi", "en": "Gambian Dalasi", "ru": "Гамбийский даласи"}, "symbol": "D", "precision": 2},
            {"code": "GNF", "name": {"de": "Guinea-Franc", "en": "Guinean Franc", "ru": "Гвинейский франк"}, "symbol": "FG", "precision": 2},
            {"code": "GTQ", "name": {"de": "Guatemaltekischer Quetzal", "en": "Guatemalan Quetzal", "ru": "Гватемальский кетсаль"}, "symbol": "Q", "precision": 2},
            {"code": "GYD", "name": {"de": "Guyana-Dollar", "en": "Guyanaese Dollar", "ru": "Гайанский доллар"}, "symbol": "G$", "precision": 2},
            {"code": "HKD", "name": {"de": "Hongkong-Dollar", "en": "Hong Kong Dollar", "ru": "Гонконгский доллар"}, "symbol": "HK$", "precision": 2},
            {"code": "HNL", "name": {"de": "Honduras-Lempira", "en": "Honduran Lempira", "ru": "Гондурасская лемпира"}, "symbol": "L", "precision": 2},
            {"code": "HRK", "name": {"de": "Kroatische Kuna", "en": "Croatian Kuna", "ru": "Хорватская куна"}, "symbol": "kn", "precision": 2},
            {"code": "HTG", "name": {"de": "Haitianische Gourde", "en": "Haitian Gourde", "ru": "Гаитянская гурда"}, "symbol": "G", "precision": 2},
            {"code": "HUF", "name": {"de": "Ungarischer Forint", "en": "Hungarian Forint", "ru": "Венгерский форинт"}, "symbol": "Ft", "precision": 2},
            {"code": "IDR", "name": {"de": "Indonesische Rupiah", "en": "Indonesian Rupiah", "ru": "Индонезийская рупия"}, "symbol": "Rp", "precision": 2},
            {"code": "ILS", "name": {"de": "Israelischer Neuer Schekel", "en": "Israeli New Shekel", "ru": "Израильский новый шекель"}, "symbol": "₪", "precision": 2},
            {"code": "INR", "name": {"de": "Indische Rupie", "en": "Indian Rupee", "ru": "Индийская рупия"}, "symbol": "₹", "precision": 2},
            {"code": "IQD", "name": {"de": "Irakischer Dinar", "en": "Iraqi Dinar", "ru": "Иракский динар"}, "symbol": "ع.د", "precision": 3},
            {"code": "IRR", "name": {"de": "Iranischer Rial", "en": "Iranian Rial", "ru": "Иранский риал"}, "symbol": "﷼", "precision": 2},
            {"code": "ISK", "name": {"de": "Isländische Krone", "en": "Icelandic Króna", "ru": "Исландская крона"}, "symbol": "ISK", "precision": 2},
            {"code": "JMD", "name": {"de": "Jamaika-Dollar", "en": "Jamaican Dollar", "ru": "Ямайский доллар"}, "symbol": "J$", "precision": 2},
            {"code": "JOD", "name": {"de": "Jordanischer Dinar", "en": "Jordanian Dinar", "ru": "Иорданский динар"}, "symbol": "JD", "precision": 3},
            {"code": "JPY", "name": {"de": "Japanischer Yen", "en": "Japanese Yen", "ru": "Японская иена"}, "symbol": "¥", "precision": 2},
            {"code": "KES", "name": {"de": "Kenia-Schilling", "en": "Kenyan Shilling", "ru": "Кенийский шиллинг"}, "symbol": "KSh", "precision": 2},
            {"code": "KGS", "name": {"de": "Kirgisischer Som", "en": "Kyrgyzstani Som", "ru": "Киргизский сом"}, "symbol": "сом", "precision": 2},
            {"code": "KHR", "name": {"de": "Kambodschanischer Riel", "en": "Cambodian Riel", "ru": "Камбоджийский риель"}, "symbol": "៛", "precision": 2},
            {"code": "KMF", "name": {"de": "Komoren-Franc", "en": "Comorian Franc", "ru": "Коморский франк"}, "symbol": "CF", "precision": 2},
            {"code": "KPW", "name": {"de": "Nordkoreanischer Won", "en": "North Korean Won", "ru": "Северокорейская вона"}, "symbol": "₩", "precision": 2},
            {"code": "KRW", "name": {"de": "Südkoreanischer Won", "en": "South Korean Won", "ru": "Южнокорейская вона"}, "symbol": "₩", "precision": 2},
            {"code": "KWD", "name": {"de": "Kuwait-Dinar", "en": "Kuwaiti Dinar", "ru": "Кувейтский динар"}, "symbol": "KD", "precision": 3},
            {"code": "KYD", "name": {"de": "Kaiman-Dollar", "en": "Cayman Islands Dollar", "ru": "Доллар Каймановых островов"}, "symbol": "CI$", "precision": 2},
            {"code": "KZT", "name": {"de": "Kasachischer Tenge", "en": "Kazakhstani Tenge", "ru": "Казахстанский тенге"}, "symbol": "₸", "precision": 2},
            {"code": "LAK", "name": {"de": "Laotischer Kip", "en": "Laotian Kip", "ru": "Лаосский кип"}, "symbol": "₭", "precision": 2},
            {"code": "LBP", "name": {"de": "Libanesisches Pfund", "en": "Lebanese Pound", "ru": "Ливанский фунт"}, "symbol": "ل.ل", "precision": 2},
            {"code": "LKR", "name": {"de": "Sri-Lanka-Rupie", "en": "Sri Lankan Rupee", "ru": "Шри-ланкийская рупия"}, "symbol": "රු", "precision": 2},
            {"code": "LRD", "name": {"de": "Liberianischer Dollar", "en": "Liberian Dollar", "ru": "Либерийский доллар"}, "symbol": "L$", "precision": 2},
            {"code": "LSL", "name": {"de": "Lesotho-Loti", "en": "Lesotho Loti", "ru": "Лесотский лоти"}, "symbol": "L", "precision": 2},
            {"code": "LTL", "name": {"de": "Litauischer Litas", "en": "Lithuanian Litas", "ru": "Литовский лит"}, "symbol": "Lt", "precision": 2},
            {"code": "LVL", "name": {"de": "Lettischer Lats", "en": "Latvian Lats", "ru": "Латвийский лат"}, "symbol": "Ls", "precision": 2},
            {"code": "LYD", "name": {"de": "Libyscher Dinar", "en": "Libyan Dinar", "ru": "Ливийский динар"}, "symbol": "ل.د", "precision": 3},
            {"code": "MAD", "name": {"de": "Marokkanischer Dirham", "en": "Moroccan Dirham", "ru": "Марокканский дирхам"}, "symbol": "MAD", "precision": 2},
            {"code": "MDL", "name": {"de": "Moldau-Leu", "en": "Moldovan Leu", "ru": "Молдавский лей"}, "symbol": "L", "precision": 2},
            {"code": "MGA", "name": {"de": "Madagaskar-Ariary", "en": "Malagasy Ariary", "ru": "Малагасийский ариари"}, "symbol": "Ar", "precision": 2},
            {"code": "MKD", "name": {"de": "Mazedonischer Denar", "en": "Macedonian Denar", "ru": "Македонский денар"}, "symbol": "ден", "precision": 2},
            {"code": "MMK", "name": {"de": "Myanmarischer Kyat", "en": "Myanmar Kyat", "ru": "Мьянманский кьят"}, "symbol": "K", "precision": 2},
            {"code": "MNT", "name": {"de": "Mongolischer Tugrik", "en": "Mongolian Tugrik", "ru": "Монгольский тугрик"}, "symbol": "₮", "precision": 2},
            {"code": "MOP", "name": {"de": "Macao-Pataca", "en": "Macanese Pataca", "ru": "Патака Макао"}, "symbol": "MOP$", "precision": 2},
            {"code": "MRO", "name": {"de": "Mauretanischer Ouguiya", "en": "Mauritanian Ouguiya", "ru": "Мавританская угия"}, "symbol": "UM", "precision": 2},
            {"code": "MUR", "name": {"de": "Mauritius-Rupie", "en": "Mauritian Rupee", "ru": "Маврикийская рупия"}, "symbol": "₨", "precision": 2},
            {"code": "MVR", "name": {"de": "Malediven-Rufiyaa", "en": "Maldivian Rufiyaa", "ru": "Мальдивская руфия"}, "symbol": "ރ", "precision": 2},
            {"code": "MWK", "name": {"de": "Malawi-Kwacha", "en": "Malawian Kwacha", "ru": "Малавийская квача"}, "symbol": "MK", "precision": 2},
            {"code": "MXN", "name": {"de": "Mexikanischer Peso", "en": "Mexican Peso", "ru": "Мексиканское песо"}, "symbol": "$", "precision": 2},
            {"code": "MYR", "name": {"de": "Malaysischer Ringgit", "en": "Malaysian Ringgit", "ru": "Малайзийский ринггит"}, "symbol": "RM", "precision": 2},
            {"code": "MZN", "name": {"de": "Mosambik-Metical", "en": "Mozambican Metical", "ru": "Мозамбикский метикал"}, "symbol": "MT", "precision": 2},
            {"code": "NAD", "name": {"de": "Namibia-Dollar", "en": "Namibian Dollar", "ru": "Намибийский доллар"}, "symbol": "N$", "precision": 2},
            {"code": "NGN", "name": {"de": "Nigerianischer Naira", "en": "Nigerian Naira", "ru": "Нигерийская найра"}, "symbol": "₦", "precision": 2},
            {"code": "NIO", "name": {"de": "Nicaragua-Cordoba", "en": "Nicaraguan Cordoba", "ru": "Никарагуанская кордоба"}, "symbol": "C$", "precision": 2},
            {"code": "NOK", "name": {"de": "Norwegische Krone", "en": "Norwegian Krone", "ru": "Норвежская крона"}, "symbol": "kr", "precision": 2},
            {"code": "NPR", "name": {"de": "Nepalesische Rupie", "en": "Nepalese Rupee", "ru": "Непальская рупия"}, "symbol": "₨", "precision": 2},
            {"code": "NZD", "name": {"de": "Neuseeland-Dollar", "en": "New Zealand Dollar", "ru": "Новозеландский доллар"}, "symbol": "NZ$", "precision": 2},
            {"code": "OMR", "name": {"de": "Omanischer Rial", "en": "Omani Rial", "ru": "Оманский риал"}, "symbol": "ر.ع.", "precision": 3},
            {"code": "PAB", "name": {"de": "Panamaischer Balboa", "en": "Panamanian Balboa", "ru": "Панамский бальбоа"}, "symbol": "B/.", "precision": 2},
            {"code": "PEN", "name": {"de": "Peruanischer Sol", "en": "Peruvian Sol", "ru": "Перуанский соль"}, "symbol": "S/", "precision": 2},
            {"code": "PGK", "name": {"de": "Papua-Neuguinea-Kina", "en": "Papua New Guinean Kina", "ru": "Кина Папуа-Новой Гвинеи"}, "symbol": "K", "precision": 2},
            {"code": "PHP", "name": {"de": "Philippinischer Peso", "en": "Philippine Peso", "ru": "Филиппинское песо"}, "symbol": "₱", "precision": 2},
            {"code": "PKR", "name": {"de": "Pakistanische Rupie", "en": "Pakistani Rupee", "ru": "Пакистанская рупия"}, "symbol": "₨", "precision": 2},
            {"code": "PLN", "name": {"de": "Polnischer Zloty", "en": "Polish Zloty", "ru": "Польский злотый"}, "symbol": "zł", "precision": 2},
            {"code": "PYG", "name": {"de": "Paraguayischer Guaraní", "en": "Paraguayan Guarani", "ru": "Парагвайский гуарани"}, "symbol": "₲", "precision": 2},
            {"code": "QAR", "name": {"de": "Katar-Riyal", "en": "Qatari Riyal", "ru": "Катарский риал"}, "symbol": "ر.ق", "precision": 2},
            {"code": "RON", "name": {"de": "Rumänischer Leu", "en": "Romanian Leu", "ru": "Румынский лей"}, "symbol": "L", "precision": 2},
            {"code": "RSD", "name": {"de": "Serbischer Dinar", "en": "Serbian Dinar", "ru": "Сербский динар"}, "symbol": "дин.", "precision": 2},
            {"code": "RUB", "name": {"de": "Russischer Rubel", "en": "Russian Ruble", "ru": "Российский рубль"}, "symbol": "₽", "precision": 2},
            {"code": "RWF", "name": {"de": "Ruanda-Franc", "en": "Rwandan Franc", "ru": "Руандийский франк"}, "symbol": "FRw", "precision": 2},
            {"code": "SAR", "name": {"de": "Saudi-Riyal", "en": "Saudi Riyal", "ru": "Саудовский риял"}, "symbol": "ر.س", "precision": 2},
            {"code": "SBD", "name": {"de": "Salomonen-Dollar", "en": "Solomon Islands Dollar", "ru": "Доллар Соломоновых Островов"}, "symbol": "SI$", "precision": 2},
            {"code": "SCR", "name": {"de": "Seychellen-Rupie", "en": "Seychellois Rupee", "ru": "Сейшельская рупия"}, "symbol": "SR", "precision": 2},
            {"code": "SDG", "name": {"de": "Sudanesisches Pfund", "en": "Sudanese Pound", "ru": "Суданский фунт"}, "symbol": "SDG", "precision": 2},
            {"code": "SEK", "name": {"de": "Schwedische Krone", "en": "Swedish Krona", "ru": "Шведская крона"}, "symbol": "kr", "precision": 2},
            {"code": "SGD", "name": {"de": "Singapur-Dollar", "en": "Singapore Dollar", "ru": "Сингапурский доллар"}, "symbol": "S$", "precision": 2},
            {"code": "SHP", "name": {"de": "St. Helena-Pfund", "en": "Saint Helena Pound", "ru": "Фунт Святой Елены"}, "symbol": "£", "precision": 2},
            {"code": "SLL", "name": {"de": "Sierra-leonischer Leone", "en": "Sierra Leonean Leone", "ru": "Леоне Сьерра-Леоне"}, "symbol": "Le", "precision": 2},
            {"code": "SOS", "name": {"de": "Somalia-Schilling", "en": "Somali Shilling", "ru": "Сомалийский шиллинг"}, "symbol": "S", "precision": 2},
            {"code": "SRD", "name": {"de": "Suriname-Dollar", "en": "Surinamese Dollar", "ru": "Суринамский доллар"}, "symbol": "$", "precision": 2},
            {"code": "STN", "name": {"de": "São Tomé und Príncipe-Dobra", "en": "São Tomé and Príncipe Dobra", "ru": "Добра Сан-Томе и Принсипи"}, "symbol": "Db", "precision": 2},
            {"code": "SVC", "name": {"de": "Salvadorianischer Colón", "en": "Salvadoran Colón", "ru": "Сальвадорский колон"}, "symbol": "₡", "precision": 2},
            {"code": "SYP", "name": {"de": "Syrisches Pfund", "en": "Syrian Pound", "ru": "Сирийский фунт"}, "symbol": "£S", "precision": 2},
            {"code": "SZL", "name": {"de": "Swasiländischer Lilangeni", "en": "Swazi Lilangeni", "ru": "Свазилендский лилангени"}, "symbol": "E", "precision": 2},
            {"code": "THB", "name": {"de": "Thailändischer Baht", "en": "Thai Baht", "ru": "Тайский бат"}, "symbol": "฿", "precision": 2},
            {"code": "TJS", "name": {"de": "Tadschikistan-Somoni", "en": "Tajikistani Somoni", "ru": "Таджикский сомони"}, "symbol": "SM", "precision": 2},
            {"code": "TMT", "name": {"de": "Turkmenistan-Manat", "en": "Turkmenistani Manat", "ru": "Туркменский манат"}, "symbol": "T", "precision": 2},
            {"code": "TND", "name": {"de": "Tunesischer Dinar", "en": "Tunisian Dinar", "ru": "Тунисский динар"}, "symbol": "د.ت", "precision": 3},
            {"code": "TOP", "name": {"de": "Tongaischer Paʻanga", "en": "Tongan Paʻanga", "ru": "Тонганская паанга"}, "symbol": "T$", "precision": 2},
            {"code": "TRY", "name": {"de": "Türkische Lira", "en": "Turkish Lira", "ru": "Турецкая лира"}, "symbol": "₺", "precision": 2},
            {"code": "TTD", "name": {"de": "Trinidad und Tobago-Dollar", "en": "Trinidad and Tobago Dollar", "ru": "Доллар Тринидада и Тобаго"}, "symbol": "TT$", "precision": 2},
            {"code": "TWD", "name": {"de": "Neuer Taiwan-Dollar", "en": "New Taiwan Dollar", "ru": "Новый тайваньский доллар"}, "symbol": "NT$", "precision": 2},
            {"code": "TZS", "name": {"de": "Tansania-Schilling", "en": "Tanzanian Shilling", "ru": "Танзанийский шиллинг"}, "symbol": "TSh", "precision": 2},
            {"code": "UAH", "name": {"de": "Ukrainische Hrywnja", "en": "Ukrainian Hryvnia", "ru": "Украинская гривна"}, "symbol": "₴", "precision": 2},
            {"code": "UGX", "name": {"de": "Uganda-Schilling", "en": "Ugandan Shilling", "ru": "Угандийский шиллинг"}, "symbol": "USh", "precision": 2},
            {"code": "USD", "name": {"de": "US-Dollar", "en": "United States Dollar", "ru": "Доллар США"}, "symbol": "$", "precision": 2},
            {"code": "UYU", "name": {"de": "Uruguayischer Peso", "en": "Uruguayan Peso", "ru": "Уругвайское песо"}, "symbol": "$U", "precision": 2},
            {"code": "UZS", "name": {"de": "Usbekistan-Sum", "en": "Uzbekistani Som", "ru": "Узбекский сум"}, "symbol": "som", "precision": 2},
            {"code": "VES", "name": {"de": "Venezolanischer Bolívar", "en": "Venezuelan Bolívar", "ru": "Венесуэльский боливар"}, "symbol": "Bs.", "precision": 2},
            {"code": "VND", "name": {"de": "Vietnamesischer Dong", "en": "Vietnamese Dong", "ru": "Вьетнамский донг"}, "symbol": "₫", "precision": 0},
            {"code": "VUV", "name": {"de": "Vanuatu-Vatu", "en": "Vanuatu Vatu", "ru": "Вануатский вату"}, "symbol": "VT", "precision": 0},
            {"code": "WST", "name": {"de": "Samoanischer Tala", "en": "Samoan Tala", "ru": "Самоанская тала"}, "symbol": "WS$", "precision": 2},
            {"code": "XAF", "name": {"de": "Zentralafrikanischer CFA-Franc", "en": "Central African CFA Franc", "ru": "Центральноафриканский франк КФА"}, "symbol": "FCFA", "precision": 0},
            {"code": "XCD", "name": {"de": "Ostkaribischer Dollar", "en": "East Caribbean Dollar", "ru": "Восточно-карибский доллар"}, "symbol": "EC$", "precision": 2},
            {"code": "XOF", "name": {"de": "Westafrikanischer CFA-Franc", "en": "West African CFA Franc", "ru": "Западноафриканский франк КФА"}, "symbol": "CFA", "precision": 0},
            {"code": "XPF", "name": {"de": "CFP-Franc", "en": "CFP Franc", "ru": "Французский тихоокеанский франк"}, "symbol": "F", "precision": 0},
            {"code": "YER", "name": {"de": "Jemenitischer Rial", "en": "Yemeni Rial", "ru": "Йеменский риал"}, "symbol": "﷼", "precision": 2},
            {"code": "ZAR", "name": {"de": "Südafrikanischer Rand", "en": "South African Rand", "ru": "Южноафриканский рэнд"}, "symbol": "R", "precision": 2},
            {"code": "ZMW", "name": {"de": "Sambischer Kwacha", "en": "Zambian Kwacha", "ru": "Замбийская квача"}, "symbol": "ZK", "precision": 2},
            {"code": "ZWL", "name": {"de": "Simbabwe-Dollar", "en": "Zimbabwean Dollar", "ru": "Зимбабвийский доллар"}, "symbol": "Z$", "precision": 2},
            {"code": "BTC", "name": {"de": "Bitcoin", "en": "Bitcoin", "ru": "Биткоин"}, "symbol": "฿", "precision": 8},
            {"code": "BTS", "name": {"de": "BitShares", "en": "BitShares", "ru": "Битшерс"}, "symbol": "BTS", "precision": 5},
            {"code": "CLF", "name": {"de": "Chilenische Recheneinheit (UF)", "en": "Chilean Unit of Account (UF)", "ru": "Чилийская расчетная единица (UF)"}, "symbol": "CLF", "precision": 4},
            {"code": "CNH", "name": {"de": "Chinesischer Yuan (offshore)", "en": "Chinese Yuan (offshore)", "ru": "Китайский юань (офшорный)"}, "symbol": "CNH", "precision": 2},
            {"code": "DASH", "name": {"de": "Dash", "en": "Dash", "ru": "Дэш"}, "symbol": "DASH", "precision": 8},
            {"code": "DOGE", "name": {"de": "Dogecoin", "en": "Dogecoin", "ru": "Догекоин"}, "symbol": "DOGE", "precision": 8},
            {"code": "EAC", "name": {"de": "EarthCoin", "en": "EarthCoin", "ru": "EarthCoin"}, "symbol": "EAC", "precision": 8},
            {"code": "EMC", "name": {"de": "Emercoin", "en": "Emercoin", "ru": "Эмеркоин"}, "symbol": "EMC", "precision": 8},
            {"code": "ETH", "name": {"de": "Ethereum", "en": "Ethereum", "ru": "Эфириум"}, "symbol": "Ξ", "precision": 18},
            {"code": "ETC", "name": {"de": "Ethereum Classic", "en": "Ethereum Classic", "ru": "Ethereum Classic"}, "symbol": "ETC", "precision": 18},
            {"code": "FCT", "name": {"de": "Factom", "en": "Factom", "ru": "Фактом"}, "symbol": "FCT", "precision": 8},
            {"code": "FTC", "name": {"de": "Feathercoin", "en": "Feathercoin", "ru": "Федеркоин"}, "symbol": "FTC", "precision": 8},
            {"code": "GGP", "name": {"de": "Guernsey-Pfund", "en": "Guernsey Pound", "ru": "Фунт Гернси"}, "symbol": "GGP", "precision": 2},
            {"code": "IMP", "name": {"de": "Manx Pfund", "en": "Manx pound", "ru": "Мэнский фунт"}, "symbol": "IMP", "precision": 2},
            {"code": "LTC", "name": {"de": "Litecoin", "en": "Litecoin", "ru": "Лайткоин"}, "symbol": "LTC", "precision": 8},
            {"code": "NMC", "name": {"de": "Namecoin", "en": "Namecoin", "ru": "Неймкойн"}, "symbol": "NMC", "precision": 8},
            {"code": "NVC", "name": {"de": "Novacoin", "en": "Novacoin", "ru": "Новакойн"}, "symbol": "NVC", "precision": 8},
            {"code": "NXT", "name": {"de": "Nxt", "en": "Nxt", "ru": "НКСТ"}, "symbol": "NXT", "precision": 8},
            {"code": "PPC", "name": {"de": "Peercoin", "en": "Peercoin", "ru": "Peercoin"}, "symbol": "ḿ", "precision": 8},
            {"code": "SSP", "name": {"de": "Südsudanesisches Pfund", "en": "South Sudanese pound", "ru": "Южносуданский фунт"}, "symbol": "SSP", "precision": 2},
            {"code": "STR", "name": {"de": "Stellar", "en": "Stellar", "ru": "Stellar"}, "symbol": "STR", "precision": 7},
            {"code": "VEF", "name": {"de": "Venezolanischer Bolívar (alt)", "en": "Venezuelan bolívar (old)", "ru": "Венесуэльский боливар (старый)"}, "symbol": "VEF", "precision": 2},
            {"code": "VEF_BLKMKT", "name": {"de": "Venezolanischer Bolívar (Schwarzmarkt)", "en": "Venezuelan bolívar (black market)", "ru": "Венесуэльский боливар (черный рынок)"}, "symbol": "VEF", "precision": 2},
            {"code": "VEF_DICOM", "name": {"de": "Venezolanischer Bolívar (DICOM)", "en": "Venezuelan bolívar (DICOM)", "ru": "Венесуэльский боливар (DICOM)"}, "symbol": "VEF", "precision": 2},
            {"code": "VEF_DIPRO", "name": {"de": "Venezolanischer Bolívar (DIPRO)", "en": "Venezuelan bolívar (DIPRO)", "ru": "Венесуэльский боливар (DIPRO)"}, "symbol": "VEF", "precision": 2},
            {"code": "VTC", "name": {"de": "Vertcoin", "en": "Vertcoin", "ru": "Vertcoin"}, "symbol": "VTC", "precision": 8},
            {"code": "XAG", "name": {"de": "Silber (Troy Unze)", "en": "Silver (troy ounce)", "ru": "Серебро (тройская унция)"}, "symbol": "XAG", "precision": 2},
            {"code": "XAU", "name": {"de": "Gold (Troy Unze)", "en": "Gold (troy ounce)", "ru": "Золото (тройская унция)"}, "symbol": "XAU", "precision": 2},
            {"code": "XDR", "name": {"de": "Sonderziehungsrechte", "en": "Special Drawing Rights", "ru": "Специальные права заимствования"}, "symbol": "XDR", "precision": 4},
            {"code": "XMR", "name": {"de": "Monero", "en": "Monero", "ru": "Monero"}, "symbol": "XMR", "precision": 12},
            {"code": "XPD", "name": {"de": "Palladium (Troy Unze)", "en": "Palladium (troy ounce)", "ru": "Палладий (тройская унция)"}, "symbol": "XPD", "precision": 2},
            {"code": "XPM", "name": {"de": "Primecoin", "en": "Primecoin", "ru": "Primecoin"}, "symbol": "XPM", "precision": 8},
            {"code": "XPT", "name": {"de": "Platin (Troy Unze)", "en": "Platinum (troy ounce)", "ru": "Платина (тройская унция)"}, "symbol": "XPT", "precision": 2},
            {"code": "XRP", "name": {"de": "Ripple", "en": "Ripple", "ru": "Ripple"}, "precision": 6}
    ]'::jsonb) as value) s
      on s.code = c.code
    when matched then
      update
         set name_new = s.name,
             precision = s.precision,
             symbol = s.symbol
    when not matched then
      insert (code, name, name_new, precision, symbol, id_currency)
      values (s.code, s.name->>'ru', s.name, s.precision, s.symbol, round(random() * 1000000000 + 2000)::int)
  `);

  await knex.raw(`
    update cf$.money
       set id_currency = (select id_currency
                            from cf$.currency
                           where code = 'BYN')
     where id_currency = 974
  `);

  await knex.raw(`
    update cf$.money
       set id_currency = (select id_currency
                            from cf$.currency
                           where code = 'UAH')
     where id_currency = 804
  `);

  await knex.raw(`
    update cf$.money
       set id_currency = (select id_currency
                            from cf$.currency
                           where code = 'BGN')
     where id_currency = 100
  `);

  await knex.raw(`
    update cf$.money
       set id_currency = null
     where id_currency in (218, 999)
  `);

  await knex.raw(`delete
                    from cf$.currency
                   where name_new is null`);

  await knex.schema.withSchema('cf$').alterTable('currency', table => {
    table.dropColumn('name');
    table.renameColumn('name_new', 'name');
  });
}

export async function down(knex: Knex): Promise<void> {}
