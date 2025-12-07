import { FiZap, FiGlobe, FiTarget, FiSmartphone, FiTrendingUp, FiMusic } from 'react-icons/fi';

export const casioProducts = [
  // G-Shock Watches
  {
    id: 1,
    name: 'Casio G-Shock GA-2100 "CasiOak"',
    brand: 'Casio',
    category: 'Watches',
    productType: 'G-Shock',
    price: 12999,
    discount: 15,
    originalPrice: 15294,
    image: 'https://dream-watches.com/cdn/shop/products/IFLW_CasiOak_Custom_g-shock_Jellyfish_product_4c9d5d3e-6c34-424c-9d54-f16170f56091.webp?v=1681360725',
    images: [
      'https://dream-watches.com/cdn/shop/products/IFLW_CasiOak_Custom_g-shock_Jellyfish_product_4c9d5d3e-6c34-424c-9d54-f16170f56091.webp?v=1681360725',
      'https://img.chrono24.com/images/uhren/a1wy99dyhs1g-3cww0ap7jhvmypdk9h91zipb-ExtraLarge.jpg',
      'https://www.g-central.com/wp-content/uploads/2019/07/GA-2100.jpg'
    ],
    description: 'Octagon-shaped G-Shock with analog-digital display and carbon core guard structure.',
    rating: 4.8,
    reviews: 1245,
    isNew: true,
    colour: 'Black',
    size: '48.5mm',
    stock: 89,
    features: [
      'Carbon Core Guard structure',
      '200-meter water resistance',
      'World time (48 cities)',
      'Stopwatch (1/100 sec)',
      'Full auto calendar'
    ],
    specifications: {
      "Model": "GA-2100-1A1",
      "Movement": "Analog-Digital",
      "Water Resistance": "200 meters",
      "Case Material": "Resin with Carbon Core",
      "Battery Life": "3 years",
      "Features": "World Time, Stopwatch, Alarm",
      "SKU": 'CASIO-GA2100-BLACK'
    },
    collection: 'G-Shock',
    model: 'GA-2100',
    movement: 'Analog-Digital',
    waterResistance: '200m',
    icon: FiZap
  },
  {
    id: 2,
    name: 'Casio G-Shock GW-M5610U-1ER',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Solar G-Shock',
    price: 14999,
    discount: 10,
    originalPrice: 16666,
    image: 'https://images-eu.ssl-images-amazon.com/images/I/61RKfgsk5FL._AC_UL600_SR600,600_.jpg',
    images: [
      'https://images-eu.ssl-images-amazon.com/images/I/61RKfgsk5FL._AC_UL600_SR600,600_.jpg',
      'https://m.media-amazon.com/images/I/7174VcegnrL._AC_UY1000_.jpg',
    ],
    description: 'Solar-powered G-Shock with Multi-Band 6 atomic timekeeping and tough solar technology.',
    rating: 4.9,
    reviews: 987,
    isNew: false,
    colour: 'Black',
    size: '46.7mm',
    stock: 145,
    features: [
      'Tough Solar power',
      'Multi-Band 6 atomic timekeeping',
      '200-meter water resistance',
      'World time (31 time zones)',
      'LED backlight'
    ],
    specifications: {
      "Model": "GW-M5610U-1ER",
      "Movement": "Digital with Solar",
      "Water Resistance": "200 meters",
      "Power Source": "Tough Solar",
      "Timekeeping": "Multi-Band 6 Atomic",
      "Features": "Solar, Atomic Time, World Time",
      "SKU": 'CASIO-GWM5610-SOLAR'
    },
    collection: 'G-Shock Solar',
    model: 'GW-M5610',
    movement: 'Digital',
    waterResistance: '200m',
    icon: FiZap
  },
  {
    id: 3,
    name: 'Casio G-Shock GBD-H1000',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Fitness G-Shock',
    price: 29999,
    discount: 20,
    originalPrice: 37499,
    image: 'https://m.media-amazon.com/images/I/6118xLzB2KL._AC_UY1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/6118xLzB2KL._AC_UY1000_.jpg',
      'https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/G/GB/GBD/GBD-H1000-4/assets/GBD-H1000-4_Seq1.png.transform/main-visual-sp/image.png',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/watch/w/c/5/-original-imahfspu4udjuczh.jpeg?q=90'
    ],
    description: 'Connected G-Shock with GPS, heart rate monitoring, and smartphone link for fitness tracking.',
    rating: 4.7,
    reviews: 456,
    isNew: true,
    colour: 'Black/Red',
    size: '53.4mm',
    stock: 67,
    features: [
      'GPS tracking',
      'Heart rate monitor',
      'Step counter',
      'Bluetooth connectivity',
      '200-meter water resistance'
    ],
    specifications: {
      "Model": "GBD-H1000-1A",
      "Movement": "Digital with Bluetooth",
      "Water Resistance": "200 meters",
      "Sensors": "GPS, Heart Rate, Accelerometer",
      "Connectivity": "Bluetooth 4.2",
      "Features": "Fitness Tracking, GPS, Heart Monitor",
      "SKU": 'CASIO-GBDH1000-FITNESS'
    },
    collection: 'G-Shock Fitness',
    model: 'GBD-H1000',
    movement: 'Digital with Bluetooth',
    waterResistance: '200m',
    icon: FiTarget
  },
  
  // Edifice Watches
  {
    id: 4,
    name: 'Casio Edifice EQB-2000D',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Chronograph',
    price: 24999,
    discount: 25,
    originalPrice: 33332,
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/watch/g/x/a/-original-imahcmfzzxv8dzqa.jpeg',
    images: [
      'https://rukminim2.flixcart.com/image/300/300/xif0q/watch/g/x/a/-original-imahcmfzzxv8dzqa.jpeg',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/E/EC/ECB/ecb-2000dd-1a/assets/ECB-2000DD-1A.png.transform/color-variation/image.png',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/E/EC/ECB/ecb-2000cb-2a/assets/ECB-2000CB-2A.png.transform/main-visual-sp/image.png'
    ],
    description: 'Bluetooth chronograph with sapphire crystal and solar charging technology.',
    rating: 4.8,
    reviews: 345,
    isNew: true,
    colour: 'Black/Silver',
    size: '44mm',
    stock: 56,
    features: [
      'Tough Movement quartz',
      'Sapphire crystal',
      'Solar charging',
      'Bluetooth smartphone link',
      '100-meter water resistance'
    ],
    specifications: {
      "Model": "EQB-2000D-1A",
      "Movement": "Tough Movement Quartz",
      "Water Resistance": "100 meters",
      "Crystal": "Sapphire",
      "Power": "Solar",
      "Features": "Bluetooth, Chronograph, Solar",
      "SKU": 'CASIO-EQB2000-CHRONO'
    },
    collection: 'Edifice',
    model: 'EQB-2000',
    movement: 'Quartz',
    waterResistance: '100m',
    icon: FiTrendingUp
  },
  
  
  // Pro Trek Watches
  {
    id: 6,
    name: 'Casio Pro Trek PRW-3500',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Outdoor Watch',
    price: 32999,
    discount: 20,
    originalPrice: 41249,
    image: 'https://m.media-amazon.com/images/I/81+INswPqXL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81+INswPqXL.jpg',
      'https://images-cdn.ubuy.co.in/65389f5add37843a4756186f-casio-men-39-s-39-pro-trek-39-tough.jpg',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/P/PR/PRW/prw-35y-3/assets/PRW-35Y-3.png.transform/main-visual-sp/image.png'
    ],
    description: 'Outdoor watch with Triple Sensor (altimeter, barometer, compass) and solar power.',
    rating: 4.8,
    reviews: 189,
    isNew: true,
    colour: 'Green',
    size: '50mm',
    stock: 45,
    features: [
      'Triple Sensor (altimeter, barometer, compass)',
      'Tough Solar power',
      'Multi-Band 6 atomic timekeeping',
      'Digital compass',
      '200-meter water resistance'
    ],
    specifications: {
      "Model": "PRW-3500-1",
      "Movement": "Digital with Solar",
      "Water Resistance": "200 meters",
      "Sensors": "Altimeter, Barometer, Compass",
      "Power": "Tough Solar",
      "Features": "Triple Sensor, Solar, Atomic Time",
      "SKU": 'CASIO-PRW3500-PROTREK'
    },
    collection: 'Pro Trek',
    model: 'PRW-3500',
    movement: 'Digital',
    waterResistance: '200m',
    icon: FiTarget
  },
  
  // Vintage Watches
  {
    id: 7,
    name: 'Casio Vintage A168WG-9EF',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Vintage Digital',
    price: 3999,
    discount: 40,
    originalPrice: 6665,
    image: 'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/A1/A16/a168weha-9a/assets/A168WEHA-9A.png',
    images: [
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/A1/A16/a168weha-9a/assets/A168WEHA-9A.png',
      'https://www.mastersintime.com/pictures/casio-a168wg-9ef-a168wg-9ef-4060311.jpg',
      'https://m.media-amazon.com/images/I/51Ect8YQa+L._AC_UY1000_.jpg'
    ],
    description: 'Classic vintage digital watch with gold-tone case and retro styling.',
    rating: 4.7,
    reviews: 567,
    isNew: false,
    colour: 'Gold',
    size: '38mm',
    stock: 234,
    features: [
      'Retro digital display',
      'Electro-luminescent backlight',
      'Daily alarm',
      '1/100 second stopwatch',
      'Water resistant'
    ],
    specifications: {
      "Model": "A168WG-9EF",
      "Movement": "Digital Quartz",
      "Water Resistance": "30 meters",
      "Battery": "CR2016 (approx. 7 years)",
      "Features": "Alarm, Stopwatch, Backlight",
      "Case": "Gold-tone Stainless Steel",
      "SKU": 'CASIO-A168-VINTAGE'
    },
    collection: 'Vintage',
    model: 'A168',
    movement: 'Digital Quartz',
    waterResistance: '30m',
    icon: FiGlobe
  },
  {
    id: 8,
    name: 'Casio F-91W',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Classic Digital',
    price: 1499,
    discount: 50,
    originalPrice: 2998,
    image: 'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/F/F9/F91/f-91wm-3a/assets/F-91WM-3A_l.jpg.transform/main-visual-sp/image.jpg',
    images: [
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/F/F9/F91/f-91wm-3a/assets/F-91WM-3A_l.jpg.transform/main-visual-sp/image.jpg',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/F/F9/F91/F-91W-1/assets/F-91W-1_Seq1.png',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/F/F9/F91/F-91WM-9A/assets/F-91WM-9A.png'
    ],
    description: 'Iconic digital watch that became a cultural phenomenon, known for its reliability.',
    rating: 4.8,
    reviews: 2345,
    isNew: false,
    colour: 'Black',
    size: '36mm',
    stock: 567,
    features: [
      '1/100 second stopwatch',
      'Daily alarm',
      'Automatic calendar',
      'Water resistant',
      'Electro-luminescent backlight'
    ],
    specifications: {
      "Model": "F-91W-1A",
      "Movement": "Digital Quartz",
      "Water Resistance": "30 meters",
      "Battery": "CR2016 (approx. 7 years)",
      "Features": "Alarm, Stopwatch, Calendar",
      "Weight": "21g",
      "SKU": 'CASIO-F91W-CLASSIC'
    },
    collection: 'Classic',
    model: 'F-91W',
    movement: 'Digital Quartz',
    waterResistance: '30m',
    icon: FiGlobe
  },
  
  // Calculators
  {
    id: 10,
    name: 'Casio fx-991EX Scientific Calculator',
    brand: 'Casio',
    category: 'Calculators',
    productType: 'Scientific Calculator',
    price: 2499,
    discount: 30,
    originalPrice: 3570,
    image: 'https://m.media-amazon.com/images/I/616ryRoQ5EL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/616ryRoQ5EL.jpg',
      'http://casio.com/content/dam/casio/product-info/locales/intl/en/calc/product/scientific/F/FX/FX9/fx-991ESPLUS/assets/fx-991ESPLUS_Seq1.jpg',
      'https://www.casio.com/content/dam/casio/product-info/locales/intl/en/calc/product/scientific/F/FX/FX9/fx-991ex-pk/assets/fx-991EX-PK_F.png'
    ],
    description: 'Advanced scientific calculator with spreadsheet function and high-resolution display.',
    rating: 4.9,
    reviews: 789,
    isNew: true,
    colour: 'Black',
    size: 'Standard',
    stock: 345,
    features: [
      '552 functions',
      'Spreadsheet function',
      'QR code generation',
      'High-resolution LCD',
      'Solar + battery power'
    ],
    specifications: {
      "Model": "fx-991EX",
      "Display": "High-resolution LCD",
      "Functions": "552",
      "Power": "Solar + LR44 battery",
      "Memory": "9 variables",
      "Features": "Spreadsheet, QR Code, Matrix Calc",
      "SKU": 'CASIO-FX991EX-SCIENTIFIC'
    },
    collection: 'Scientific',
    model: 'fx-991EX',
    movement: 'N/A',
    waterResistance: 'N/A'
  },
  {
    id: 11,
    name: 'Casio DJ-120D Plus Desktop Calculator',
    brand: 'Casio',
    category: 'Calculators',
    productType: 'Desktop Calculator',
    price: 1799,
    discount: 35,
    originalPrice: 2768,
    image: 'https://www.myoffice.qa/cdn/shop/products/1_1a884059-a124-4094-befa-0886f1ee9881_1024x.jpg?v=1593876806',
    images: [
      'https://www.myoffice.qa/cdn/shop/products/1_1a884059-a124-4094-befa-0886f1ee9881_1024x.jpg?v=1593876806',
      'http://m.media-amazon.com/images/I/61yqv5+47AL.jpg',
    ],
    description: 'Desktop calculator with large display and comfortable keypad for office use.',
    rating: 4.6,
    reviews: 234,
    isNew: false,
    colour: 'White',
    size: 'Desktop',
    stock: 189,
    features: [
      '12-digit display',
      'Large, comfortable keys',
      'Cost/Sell/Margin calculation',
      'Dual power (solar + battery)',
      'Item counter'
    ],
    specifications: {
      "Model": "DJ-120D Plus",
      "Display": "12-digit LCD",
      "Power": "Solar + battery",
      "Keys": "Large, comfortable",
      "Features": "Cost/Sell/Margin, Item Counter",
      "Dimensions": "138 x 202 x 35 mm",
      "SKU": 'CASIO-DJ120D-DESKTOP'
    },
    collection: 'Office',
    model: 'DJ-120D',
    movement: 'N/A',
    waterResistance: 'N/A'
  },
  
  // Musical Instruments
  {
    id: 12,
    name: 'Casio CT-S200 Digital Piano',
    brand: 'Casio',
    category: 'Musical Instruments',
    productType: 'Digital Piano',
    price: 18999,
    discount: 20,
    originalPrice: 23749,
    image: 'https://www.casio.com/content/dam/casio/product-info/locales/in/en/emi/product/C/CT/CTS/CT-S200BK/assets/CT-S200BK_Seq3.jpg.transform/main-visual-sp/image.jpg',
    images: [
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/emi/product/C/CT/CTS/CT-S200RD/assets/CT-S200RD_Seq3.jpg.transform/main-visual-sp/image.jpg',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/emi/product/C/CT/CTS/CT-S200RD/assets/CT-S200RD_Seq3.jpg.transform/main-visual-sp/image.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpE1u2zFJBqPH6UK44l-Ll_T8YnDUUT7wuLA&s'
    ],
    description: 'Portable digital piano with 61 touch-sensitive keys and 400 tones.',
    rating: 4.7,
    reviews: 345,
    isNew: true,
    colour: 'Black',
    size: '61 keys',
    stock: 78,
    features: [
      '61 touch-sensitive keys',
      '400 tones',
      '77 rhythms',
      'Layer and split modes',
      'USB MIDI connectivity'
    ],
    specifications: {
      "Model": "CT-S200",
      "Keys": "61 touch-sensitive",
      "Tones": "400",
      "Rhythms": "77",
      "Connectivity": "USB MIDI, Headphone Jack",
      "Power": "6 AA batteries or adapter",
      "SKU": 'CASIO-CTS200-DIGITALPIANO'
    },
    collection: 'Musical',
    model: 'CT-S200',
    movement: 'N/A',
    waterResistance: 'N/A',
    icon: FiMusic
  },
  {
    id: 13,
    name: 'Casio SA-76 Mini Keyboard',
    brand: 'Casio',
    category: 'Musical Instruments',
    productType: 'Mini Keyboard',
    price: 4999,
    discount: 40,
    originalPrice: 8332,
    image: 'https://m.media-amazon.com/images/I/61pJkKukdOL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61pJkKukdOL.jpg',
      'https://m.media-amazon.com/images/I/81DfarAxApL.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJGmPJbxW0C3PKHiwvqc2X2zzBZeKiPMrWu2ZOdjRLa7eDeVMVH_X_KOWVC7RQaxcFHRo&usqp=CAU'
    ],
    description: 'Mini keyboard with 44 mini keys, 100 tones, and 50 rhythms for beginners.',
    rating: 4.5,
    reviews: 456,
    isNew: false,
    colour: 'Red',
    size: '44 mini keys',
    stock: 156,
    features: [
      '44 mini keys',
      '100 tones',
      '50 rhythms',
      '10 built-in songs',
      'LCD display'
    ],
    specifications: {
      "Model": "SA-76",
      "Keys": "44 mini keys",
      "Tones": "100",
      "Rhythms": "50",
      "Songs": "10 built-in",
      "Power": "6 AA batteries or adapter",
      "SKU": 'CASIO-SA76-MINIKEYBOARD'
    },
    collection: 'Beginner',
    model: 'SA-76',
    movement: 'N/A',
    waterResistance: 'N/A',
    icon: FiMusic
  },
  
  // Projectors
  {
    id: 14,
    name: 'Casio XJ-F210WN Projector',
    brand: 'Casio',
    category: 'Projectors',
    productType: 'Laser & LED Projector',
    price: 89999,
    discount: 15,
    originalPrice: 105882,
    image: 'https://m.media-amazon.com/images/I/51qsXbGIhpL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/51qsXbGIhpL.jpg',
      'https://m.media-amazon.com/images/I/51nD2DNOiEL.jpg',
      'https://m.media-amazon.com/images/I/51IRCBHRYIL._AC_UF1000,1000_QL80_.jpg'
    ],
    description: 'Laser & LED hybrid projector with 4,000 lumens and 20,000-hour light source.',
    rating: 4.8,
    reviews: 89,
    isNew: true,
    colour: 'White',
    size: 'Portable',
    stock: 23,
    features: [
      'Laser & LED hybrid light source',
      '4,000 lumens brightness',
      'WXGA resolution (1280x800)',
      '20,000-hour light source life',
      'Instant on/off'
    ],
    specifications: {
      "Model": "XJ-F210WN",
      "Brightness": "4,000 lumens",
      "Resolution": "WXGA (1280x800)",
      "Light Source": "Laser & LED Hybrid",
      "Life": "20,000 hours",
      "Connectivity": "HDMI, VGA, USB",
      "SKU": 'CASIO-XJF210-PROJECTOR'
    },
    collection: 'Projection',
    model: 'XJ-F210WN',
    movement: 'N/A',
    waterResistance: 'N/A'
  },
  
  // Label Printers
  {
    id: 15,
    name: 'Casio KL-60 Label Printer',
    brand: 'Casio',
    category: 'Label Printers',
    productType: 'Portable Label Printer',
    price: 5999,
    discount: 25,
    originalPrice: 7999,
    image: 'https://images-cdn.ubuy.co.in/63df18a71a0f097a48226c23-casio-kl-60-label-printer.jpg',
    images: [
      'https://images-cdn.ubuy.co.in/63df18a71a0f097a48226c23-casio-kl-60-label-printer.jpg',
      'https://www.casio-intl.com/asia/en/blob/1425476088066/KL-60_yoko.jpg',
    ],
    description: 'Portable label printer with QWERTY keyboard and multiple font styles.',
    rating: 4.6,
    reviews: 123,
    isNew: true,
    colour: 'White',
    size: 'Portable',
    stock: 89,
    features: [
      'QWERTY keyboard',
      '18mm tape width',
      'Multiple fonts and frames',
      'Auto cut function',
      'Battery or AC adapter powered'
    ],
    specifications: {
      "Model": "KL-60",
      "Tape Width": "18mm",
      "Display": "12-character LCD",
      "Power": "4 AA batteries or adapter",
      "Features": "Auto Cut, Multiple Fonts, Frames",
      "Memory": "9 labels",
      "SKU": 'CASIO-KL60-LABELPRINTER'
    },
    collection: 'Office',
    model: 'KL-60',
    movement: 'N/A',
    waterResistance: 'N/A'
  },
  
  // Cash Registers
  {
    id: 16,
    name: 'Casio SE-C450 Cash Register',
    brand: 'Casio',
    category: 'Cash Registers',
    productType: 'Electronic Cash Register',
    price: 24999,
    discount: 20,
    originalPrice: 31249,
    image: 'https://5.imimg.com/data5/CB/KD/MY-26637509/casio-se-s400-silver-4-gb-cash-register.jpg',
    images: [
      'https://5.imimg.com/data5/CB/KD/MY-26637509/casio-se-s400-silver-4-gb-cash-register.jpg',
      'https://jakxp.com/productimages/3500_pic_1603708534_1.jpg',
    ],
    description: 'Electronic cash register with thermal printer and programmable departments.',
    rating: 4.7,
    reviews: 67,
    isNew: true,
    colour: 'White',
    size: 'Desktop',
    stock: 45,
    features: [
      'Thermal printer',
      '99 programmable departments',
      'PLU memory',
      'X and Z reports',
      'Customer display'
    ],
    specifications: {
      "Model": "SE-C450",
      "Printer": "Thermal",
      "Departments": "99 programmable",
      "PLU Memory": "2,000 items",
      "Display": "Customer and operator displays",
      "Connectivity": "USB, Ethernet",
      "SKU": 'CASIO-SEC450-CASHREGISTER'
    },
    collection: 'Retail',
    model: 'SE-C450',
    movement: 'N/A',
    waterResistance: 'N/A'
  },
  
  // Limited Editions
  {
    id: 17,
    name: 'Casio G-Shock x Dragon Ball Z',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Limited Edition',
    price: 24999,
    discount: 0,
    originalPrice: 24999,
    image: 'https://www.casio-intl.com/asia/en/media/news/images/2020/0617_ga-110jdb/img02.jpg',
    images: [
      'https://www.casio-intl.com/asia/en/media/news/images/2020/0617_ga-110jdb/img02.jpg',
      'https://www.flashfly.net/wp/wp-content/uploads/2020/08/Screen-Shot-2563-08-12-at-16.03.21.png',
      'https://www.casio-intl.com/asia/en/media/news/images/2020/0617_ga-110jdb/img05.jpg'
    ],
    description: 'Limited edition G-Shock collaboration with Dragon Ball Z anime series.',
    rating: 4.9,
    reviews: 345,
    isNew: true,
    colour: 'Orange/Black',
    size: '48mm',
    stock: 15,
    features: [
      'Dragon Ball Z themed design',
      'Shock resistant',
      '200-meter water resistance',
      'Special packaging',
      'Collector\'s item'
    ],
    specifications: {
      "Model": "GA-110JDB-1A",
      "Movement": "Analog-Digital",
      "Water Resistance": "200 meters",
      "Edition": "Dragon Ball Z Limited",
      "Features": "Shock Resistant, Special Design",
      "Collection": "Anime Collaboration",
      "SKU": 'CASIO-GSHOCK-DBZ-LIMITED'
    },
    collection: 'Limited Edition',
    model: 'GA-110',
    movement: 'Analog-Digital',
    waterResistance: '200m',
    icon: FiZap
  },
  {
    id: 18,
    name: 'Casio 40th Anniversary G-Shock',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Anniversary Edition',
    price: 39999,
    discount: 10,
    originalPrice: 44443,
    image: 'https://gshock.casio.com/content/casio/locales/europe/en-gb/brands/gshock/40th/_jcr_content/root/responsivegrid/container_1306881527_1498753482/container_2006523543/container/container_copy_copy_/content_panel_list/content_panel_202212220942102847/image.casiocoreimg.jpeg/1709863654952/gshock-40th-banner-800-a-tokyo.jpeg',
    images: [
      'https://gshock.casio.com/content/casio/locales/europe/en-gb/brands/gshock/40th/_jcr_content/root/responsivegrid/container_1306881527_1498753482/container_2006523543/container/container_copy_copy_/content_panel_list/content_panel_202212220942102847/image.casiocoreimg.jpeg/1709863654952/gshock-40th-banner-800-a-tokyo.jpeg',
      'https://gshock.casio.com/content/casio/locales/in/en/brands/gshock/40th/products/recrystallized-series/_jcr_content/root/responsivegrid/container_1983787584/container/container_1418286725/container/image.casiocoreimg.jpeg/1683540223011/dw-5040pg-1.jpeg',
      'https://gshock.casio.com/content/casio/locales/in/en/brands/gshock/40th/_jcr_content/root/responsivegrid/container_1306881527_1498753482/container_2006523543/container/container_copy_copy_/content_panel_list/content_panel_202303131717354728/image.casiocoreimg.jpeg/1688102795850/kv-sp.jpeg'
    ],
    description: '40th anniversary edition G-Shock with premium materials and special packaging.',
    rating: 4.8,
    reviews: 89,
    isNew: true,
    colour: 'Gold',
    size: '49.3mm',
    stock: 25,
    features: [
      '40th anniversary edition',
      'IP coated bezel',
      'Sapphire crystal',
      'Special anniversary case back',
      'Premium packaging'
    ],
    specifications: {
      "Model": "GMW-B5000TFG-9",
      "Movement": "Bluetooth Solar",
      "Water Resistance": "200 meters",
      "Crystal": "Sapphire",
      "Case": "Full Metal, IP Gold Coated",
      "Edition": "40th Anniversary",
      "SKU": 'CASIO-40TH-ANNIVERSARY'
    },
    collection: 'Anniversary',
    model: 'GMW-B5000',
    movement: 'Bluetooth Solar',
    waterResistance: '200m',
    icon: FiZap
  },
  
  // Oceanus Watches
  {
    id: 19,
    name: 'Casio Oceanus OCW-T4000',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Premium Watch',
    price: 59999,
    discount: 15,
    originalPrice: 70587,
    image: 'https://m.media-amazon.com/images/I/61ODMKGBUZL._UY1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61ODMKGBUZL._UY1000_.jpg',
      'http://i.ebayimg.com/images/g/-mAAAOSw--hkRs~y/s-l1200.jpg',
      'https://www.sakurawatches.com/image/cache/catalog/watches/casio/new/OCW-T4000-1AJF/OCW-T4000-1AJF-1200x630.jpg'
    ],
    description: 'Premium solar-powered watch with Bluetooth connectivity and sapphire crystal.',
    rating: 4.9,
    reviews: 123,
    isNew: true,
    colour: 'Blue',
    size: '44mm',
    stock: 34,
    features: [
      'Tough Movement solar',
      'Bluetooth smartphone link',
      'Sapphire crystal with AR coating',
      '100-meter water resistance',
      'World time (300 cities)'
    ],
    specifications: {
      "Model": "OCW-T4000-2A",
      "Movement": "Tough Movement Solar",
      "Water Resistance": "100 meters",
      "Crystal": "Sapphire with AR coating",
      "Features": "Bluetooth, Solar, World Time",
      "Case": "Titanium",
      "SKU": 'CASIO-OCEANUS-T4000'
    },
    collection: 'Oceanus',
    model: 'OCW-T4000',
    movement: 'Solar',
    waterResistance: '100m',
    icon: FiTrendingUp
  },
  
  // Databank Watches
  {
    id: 20,
    name: 'Casio Databank DBC-32',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Data Bank Watch',
    price: 4999,
    discount: 35,
    originalPrice: 7685,
    image: 'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/D/DB/DBC/DBC-32D-1A/assets/DBC-32D-1A.png',
    images: [
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/D/DB/DBC/DBC-32D-1A/assets/DBC-32D-1A.png',
      'https://assets.ajio.com/medias/sys_master/root/20220124/TbDH/61eec16bf997dd662337d18e/-1117Wx1400H-469079070-black-MODEL.jpg',
      'https://rukminim2.flixcart.com/image/480/580/kruyw7k0/watch/l/g/7/dbc-32-1a-casio-original-imag5jspnkpygkbz.jpeg?q=90'
    ],
    description: 'Classic databank watch with phone number memory and calculator function.',
    rating: 4.6,
    reviews: 456,
    isNew: false,
    colour: 'Silver',
    size: '39mm',
    stock: 189,
    features: [
      'Phone number memory (50 entries)',
      '8-digit calculator',
      'Daily alarm',
      '1/100 second stopwatch',
      'Auto calendar'
    ],
    specifications: {
      "Model": "DBC-32-1A",
      "Movement": "Digital Quartz",
      "Water Resistance": "30 meters",
      "Memory": "50 phone numbers",
      "Features": "Calculator, Phone Book, Alarm",
      "Battery": "CR2025 (approx. 5 years)",
      "SKU": 'CASIO-DBC32-DATABANK'
    },
    collection: 'Databank',
    model: 'DBC-32',
    movement: 'Digital Quartz',
    waterResistance: '30m',
    icon: FiGlobe
  },
  
  // Pathfinder Watches
  {
    id: 21,
    name: 'Casio Pathfinder PAG240',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Outdoor Watch',
    price: 24999,
    discount: 30,
    originalPrice: 35714,
    image: 'https://images-cdn.ubuy.co.in/634d1bdbbda40e51cf74125b-casio-men-39-s-pathfinder-pag240.jpg',
    images: [
      'https://images-cdn.ubuy.co.in/634d1bdbbda40e51cf74125b-casio-men-39-s-pathfinder-pag240.jpg',
      'https://images-cdn.ubuy.co.in/6368df4b99fae771bc0066c3-casio-men-039-s-watch-pro-trek.jpg',
      'https://m.media-amazon.com/images/I/71u70NhuFkL._AC_UY500_.jpg'
    ],
    description: 'Solar-powered outdoor watch with Triple Sensor and tide graph for marine activities.',
    rating: 4.7,
    reviews: 234,
    isNew: true,
    colour: 'Green/Black',
    size: '51mm',
    stock: 67,
    features: [
      'Tough Solar power',
      'Triple Sensor (altimeter, barometer, compass)',
      'Tide graph',
      'Moon data',
      '100-meter water resistance'
    ],
    specifications: {
      "Model": "PAG240-1",
      "Movement": "Digital with Solar",
      "Water Resistance": "100 meters",
      "Sensors": "Altimeter, Barometer, Compass",
      "Features": "Solar, Tide Graph, Moon Data",
      "Power": "Tough Solar",
      "SKU": 'CASIO-PATHFINDER-PAG240'
    },
    collection: 'Pathfinder',
    model: 'PAG240',
    movement: 'Digital',
    waterResistance: '100m',
    icon: FiTarget
  },
  
  // Sheen Watches
  {
    id: 22,
    name: 'Casio Sheen SHE-4536',
    brand: 'Casio',
    category: 'Watches',
    productType: 'Women\'s Watch',
    price: 8999,
    discount: 40,
    originalPrice: 14998,
    image: 'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/S/SH/SHE/SHE-4534PGL-1A/assets/SHE-4534PGL-1A_Seq1.png',
    images: [
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/S/SH/SHE/SHE-4534PGL-1A/assets/SHE-4534PGL-1A_Seq1.png',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/S/SH/SHE/she-4539gm-9a/assets/SHE-4539GM-9AU.png.transform/main-visual-pc/image.png',
      'https://www.casio.com/content/dam/casio/product-info/locales/intl/en/timepiece/product/watch/S/SH/SHE/she-4539bgm-1a/assets/SHE-4539BGM-1AU.png.transform/main-visual-pc/image.png'
    ],
    description: 'Elegant women\'s watch with mother of pearl dial and diamond accents.',
    rating: 4.7,
    reviews: 345,
    isNew: true,
    colour: 'Rose Gold/White',
    size: '34mm',
    stock: 123,
    features: [
      'Mother of pearl dial',
      'Diamond hour markers',
      'Date display',
      'Water resistant',
      'Stainless steel case'
    ],
    specifications: {
      "Model": "SHE-4536PG-7A",
      "Movement": "Quartz",
      "Water Resistance": "50 meters",
      "Dial": "Mother of Pearl",
      "Accents": "Diamond hour markers",
      "Case": "Stainless Steel with Rose Gold IP",
      "SKU": 'CASIO-SHEEN-4536'
    },
    collection: 'Sheen',
    model: 'SHE-4536',
    movement: 'Quartz',
    waterResistance: '50m',
    icon: FiGlobe
  },
  
  // Graphing Calculators
  {
    id: 23,
    name: 'Casio fx-CG50 Graphing Calculator',
    brand: 'Casio',
    category: 'Calculators',
    productType: 'Graphing Calculator',
    price: 11999,
    discount: 20,
    originalPrice: 14999,
    image: 'https://www.casio.com/content/dam/casio/product-info/locales/in/en/calc/product/scientific/F/FX/FXC/fx-CG50/assets/fx-CG50_Seq1.jpg.transform/main-visual-sp/image.jpg',
    images: [
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/calc/product/scientific/F/FX/FXC/fx-CG50/assets/fx-CG50_Seq1.jpg.transform/main-visual-sp/image.jpg',
      'https://m.media-amazon.com/images/I/711yX24c7GL.jpg',
    ],
    description: 'Color graphing calculator with high-resolution display and Python programming capability.',
    rating: 4.8,
    reviews: 456,
    isNew: true,
    colour: 'Black',
    size: 'Standard',
    stock: 89,
    features: [
      'Color LCD display',
      '3D graphing',
      'Python programming',
      'Spreadsheet function',
      'Picture plot'
    ],
    specifications: {
      "Model": "fx-CG50",
      "Display": "Color LCD (216x384 pixels)",
      "Memory": "16 MB",
      "Programming": "Python, Basic",
      "Features": "3D Graphing, Spreadsheet, Picture Plot",
      "Power": "4 AAA batteries",
      "SKU": 'CASIO-FXCG50-GRAPHING'
    },
    collection: 'Graphing',
    model: 'fx-CG50',
    movement: 'N/A',
    waterResistance: 'N/A'
  },
  
  // Final product
  {
    id: 25,
    name: 'Casio World Time AE-1200WH',
    brand: 'Casio',
    category: 'Watches',
    productType: 'World Time Watch',
    price: 3499,
    discount: 45,
    originalPrice: 6364,
    image: 'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/AE/AE1/AE-1200WHD-1AV/assets/AE-1200WHD-1AV_Seq1.png.transform/main-visual-sp/image.png',
    images: [
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/AE/AE1/AE-1200WHD-1AV/assets/AE-1200WHD-1AV_Seq1.png.transform/main-visual-sp/image.png',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/AE/AE1/ae-1200whl-5av/assets/AE-1200WHL-5AV.png',
      'https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/AE/AE1/AE-1200WH-1AV/assets/AE-1200WH-1AV.png.transform/main-visual-sp/image.png'
    ],
    description: 'World time watch with digital map display showing 31 time zones.',
    rating: 4.7,
    reviews: 789,
    isNew: true,
    colour: 'Silver',
    size: '45mm',
    stock: 234,
    features: [
      'World time (31 time zones)',
      'Digital map display',
      '5 daily alarms',
      '1/100 second stopwatch',
      '100-meter water resistance'
    ],
    specifications: {
      "Model": "AE-1200WH-1A",
      "Movement": "Digital Quartz",
      "Water Resistance": "100 meters",
      "Time Zones": "31 (48 cities)",
      "Features": "World Time, Map Display, Alarm",
      "Battery": "CR2025 (approx. 10 years)",
      "SKU": 'CASIO-AE1200-WORLDTIME'
    },
    collection: 'World Time',
    model: 'AE-1200',
    movement: 'Digital Quartz',
    waterResistance: '100m',
    icon: FiGlobe
  }
];