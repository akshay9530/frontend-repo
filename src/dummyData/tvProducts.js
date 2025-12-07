const tvProducts = [
  {
    id: 201,
    name: 'Sony Bravia 4K LED TV',
    brand: 'Sony',
    category: 'TV',
    productType: 'Smart TV',
    price: 54999,
    originalPrice: 73332,
    images: [
      'https://rukminim2.flixcart.com/image/480/640/krp94sw0/television/b/s/9/kd-75x80j-kd-75x80j-sony-original-imag5fz7hm2k74fd.jpeg?q=90',
      'https://rukminim2.flixcart.com/image/480/640/l3929ow0/television/h/d/m/kd-65x75k-in5-sony-original-imagef3zkuszrfgh.jpeg?q=90'
    ],
    rating: 4.7,
    reviews: 234,
    colour: 'Black',
    size: '55 inch',
    screenType: '4K UHD',
    resolution: '3840 x 2160',
    smartFeatures: ['Android TV', 'Google Assistant', 'Netflix', 'Prime Video'],
    stock: 12,
    description: 'Experience stunning 4K resolution with Sony\'s renowned picture quality and smart features.',
    features: [
      "4K HDR Processor X1",
      "TRILUMINOS Display",
      "Android TV with Google Assistant",
      "Dolby Vision & Atmos",
      "Acoustic Surface Audio+"
    ],
    sku: 'SONY-BRAVIA-55'
  },
  {
    id: 202,
    name: 'Samsung Crystal 4K UHD TV',
    brand: 'Samsung',
    category: 'TV',
    productType: 'LED TV',
    price: 42999,
    originalPrice: 61428,
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/ua43cue60aklxl/gallery/in-crystal-uhd-cu7000-458954-ua43cue60aklxl-536446982?$684_547_PNG$',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/television/a/7/f/-original-imah44cpcfntc4zn.jpeg?q=90'
    ],
    rating: 4.6,
    reviews: 189,
    colour: 'Black',
    size: '50 inch',
    screenType: '4K UHD',
    resolution: '3840 x 2160',
    smartFeatures: ['Tizen OS', 'Bixby', 'Disney+', 'Apple TV'],
    stock: 18,
    description: 'Crystal clear 4K display with powerful sound and smart connectivity.',
    features: [
      "Crystal Processor 4K",
      "PurColor Technology",
      "HDR10+ Support",
      "Adaptive Sound",
      "Game Mode"
    ],
    sku: 'SAMSUNG-CRYSTAL-50'
  },
  {
    id: 203,
    name: 'LG OLED 4K TV',
    brand: 'LG',
    category: 'TV',
    productType: 'OLED TV',
    price: 89999,
    discount: 20,
    originalPrice: 112499,
    images: [
      'https://tehno-mag.hr/upload/catalog/product/24115/thumb/8806091898968-lg-oled-tv-oled55c41la-5_66a395f5586b5_650xr.jpg'
    ],
    rating: 4.8,
    reviews: 156,
    colour: 'Dark Silver',
    size: '65 inch',
    screenType: 'OLED 4K',
    resolution: '3840 x 2160',
    smartFeatures: ['webOS', 'ThinQ AI', 'AirPlay 2', 'Magic Remote'],
    stock: 8,
    description: 'Perfect black and infinite contrast with LG\'s award-winning OLED technology.',
    features: [
      "α9 Gen5 AI Processor",
      "Self-lit OLED Pixels",
      "Dolby Vision IQ",
      "Filmmaker Mode",
      "G-SYNC Compatible"
    ],
    sku: 'LG-OLED-65'
  },
  {
    id: 211,
    name: 'Xiaomi 6A 32-inch HD Ready TV',
    brand: 'Xiaomi',
    category: 'TV',
    productType: 'LED TV',
    price: 13999,
    originalPrice: 18665,
    images: [
      'https://mahajanelectronics.com/cdn/shop/files/Mi_32-Inch_HD_Ready_Smart_LED_TV_A_Series_Google_TV_Dolby_Audio_Dual-Band_Wi-Fi_Voice_Control_Buy_Online_at_Mahajan_Electronics.jpg?v=1762691049&width=1500',
      'https://img-prd-pim.poorvika.com/product/Xiaomi-hd-ready-led-smart-tv-a-series-32-inch-Front-View-Model.png'
    ],
    rating: 4.4,
    reviews: 156,
    colour: 'Black',
    size: '32 inch',
    screenType: 'HD Ready',
    resolution: '1366 x 768',
    smartFeatures: ['PatchWall', 'Google Assistant'],
    stock: 42,
    description: 'Crisp HD display with smart features at an affordable price.',
    features: [
      "Vivid Picture Engine",
      "20W Speakers",
      "PatchWall 4",
      "Multiple Ports",
      "Android TV"
    ],
    sku: 'XIAOMI-6A-32'
  },
  {
    id: 214,
    name: 'Panasonic 4K Smart TV',
    brand: 'Panasonic',
    category: 'TV',
    productType: 'Smart TV',
    price: 45999,
    originalPrice: 58973,
    images: [
      'https://rukminim2.flixcart.com/image/480/640/xif0q/television/x/u/k/-original-imagy65rtk2h2rrs.jpeg?q=90',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/television/s/v/o/-original-imagy65rfrzeb4cx.jpeg?q=90'
    ],
    rating: 4.5,
    reviews: 78,
    colour: 'Silver',
    size: '55 inch',
    screenType: '4K UHD',
    resolution: '3840 x 2160',
    smartFeatures: ['my Home Screen', 'Google Assistant'],
    stock: 15,
    description: 'Hollywood-inspired color accuracy with Hexa Chroma Drive.',
    features: [
      "Hexa Chroma Drive Pro",
      "HCX Pro AI Processor",
      "Dolby Vision & Atmos",
      "Game Mode Extreme",
      "Voice Control"
    ],
    sku: 'PANASONIC-55'
  },
  {
    id: 216,
    name: 'Sony Bravia 8K OLED TV',
    brand: 'Sony',
    category: 'TV',
    productType: 'OLED TV',
    price: 299999,
    discount: 15,
    originalPrice: 352940,
    images: [
      'https://shopatsc.com/cdn/shop/files/01-65XR80-Primary-Image.jpg?v=1756129282',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/television/c/b/n/-original-imahgfyu85qvjfu3.jpeg?q=90'
    ],
    rating: 4.9,
    reviews: 89,
    colour: 'Black',
    size: '75 inch',
    screenType: '8K OLED',
    resolution: '7680 x 4320',
    smartFeatures: ['Google TV', 'Dolby Vision', 'IMAX Enhanced'],
    stock: 6,
    description: 'The ultimate viewing experience with 8K resolution and OLED technology.',
    features: [
      "Cognitive Processor XR",
      "XR OLED Contrast Pro",
      "Acoustic Surface Audio++",
      "BRAVIA CORE",
      "Netflix Calibrated Mode"
    ],
    sku: 'SONY-8K-OLED-75'
  },
  {
    id: 217,
    name: 'Samsung The Frame 4K TV',
    brand: 'Samsung',
    category: 'TV',
    productType: 'Lifestyle TV',
    price: 79999,
    discount: 20,
    originalPrice: 99999,
    images: [
      'https://dynamicdistributors.in/wp-content/uploads/2025/07/81TJ3oQMXGL._SL1500_.jpg',
      'https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/202404/12/00114842329832____8__1200x1200.jpg'
    ],
    rating: 4.7,
    reviews: 145,
    colour: 'Beige',
    size: '55 inch',
    screenType: '4K QLED',
    resolution: '3840 x 2160',
    smartFeatures: ['Art Mode', 'Ambient Mode', 'SmartThings'],
    stock: 10,
    description: 'Transforms into beautiful art when not in use. A TV that blends with your decor.',
    features: [
      "QLED 4K Display",
      "Art Mode with Art Store",
      "One Connect Box",
      "Motion Sensor",
      "Anti-Reflection Matte Display"
    ],
    sku: 'SAMSUNG-FRAME-55'
  },
  {
    id: 218,
    name: 'OnePlus U1S 4K LED TV',
    brand: 'OnePlus',
    category: 'TV',
    productType: 'Android TV',
    price: 32999,
    discount: 18,
    originalPrice: 40243,
    images: [
      'https://m.media-amazon.com/images/I/71WP6JNtJ-S.jpg',
      'https://doiqgxrhp4iii.cloudfront.net/50UC1A00_1_11zon.jpg'
    ],
    rating: 4.5,
    reviews: 112,
    colour: 'Black',
    size: '50 inch',
    screenType: '4K UHD',
    resolution: '3840 x 2160',
    smartFeatures: ['Android TV 11', 'Google Assistant', 'OxygenPlay'],
    stock: 25,
    description: 'Smooth viewing experience with Gamma Engine and Dolby Audio.',
    features: [
      "Gamma Engine",
      "Dolby Vision & Atmos",
      "MEMC Technology",
      "Bezel-less Design",
      "30W Speakers"
    ],
    sku: 'ONEPLUS-U1S-50'
  }
];

export default tvProducts;