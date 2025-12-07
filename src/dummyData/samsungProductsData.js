// src/data/samsungProductsData.js

export const samsungProducts = [
  // Smartphones
  {
    id: 1,
    name: 'Samsung Galaxy S23 Ultra 5G',
    brand: 'Samsung',
    category: 'Smartphones',
    productType: 'Flagship Phone',
    price: 124999,
    discount: 12,
    originalPrice: 142045,
    image: 'https://m.media-amazon.com/images/I/71goZuIha-L.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71goZuIha-L.jpg',
      'https://initiative.co.in/wp-content/uploads/2024/02/Untitled-design-2024-02-05T153831.654.png',
      'https://m.media-amazon.com/images/I/61Q42RN9+9L._AC_UF894,1000_QL80_.jpg'
    ],
    description: 'Flagship smartphone with 200MP camera, S Pen support, and Snapdragon 8 Gen 2 processor.',
    rating: 4.8,
    reviews: 2345,
    isNew: true,
    colour: 'Phantom Black',
    connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
    screenSize: '6.8 inches',
    stock: 89,
    features: [
      '200MP Adaptive Pixel camera',
      'Built-in S Pen',
      'Snapdragon 8 Gen 2 processor',
      '5000mAh battery',
      '120Hz Dynamic AMOLED 2X display'
    ],
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 2 for Galaxy",
      "RAM": "12GB",
      "Storage": "256GB (not expandable)",
      "Camera": "200MP + 12MP + 10MP + 10MP",
      "Battery": "5000mAh with 45W fast charging",
      "OS": "Android 13 with One UI 5.1",
      "SKU": 'SAMSUNG-S23-ULTRA-BLK'
    },
    series: 'Galaxy S',
    warranty: '1 Year'
  },
  {
    id: 2,
    name: 'Samsung Galaxy Z Fold5 5G',
    brand: 'Samsung',
    category: 'Smartphones',
    productType: 'Foldable Phone',
    price: 154999,
    discount: 8,
    originalPrice: 168477,
    image: 'https://cellbay.in/wp-content/uploads/2023/11/Samsung-Galaxy-Z-Fold-5-phantom-black.jpg',
    images: [
      'https://cellbay.in/wp-content/uploads/2023/11/Samsung-Galaxy-Z-Fold-5-phantom-black.jpg',
    ],
    description: 'Foldable smartphone with 7.6-inch main display, Snapdragon 8 Gen 2, and multi-tasking capabilities.',
    rating: 4.7,
    reviews: 1234,
    isNew: true,
    colour: 'Icy Blue',
    connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
    screenSize: '7.6 inches (unfolded)',
    stock: 45,
    features: [
      '7.6-inch foldable Dynamic AMOLED 2X',
      'Snapdragon 8 Gen 2 for Galaxy',
      'Flex mode for multi-tasking',
      'Under-display camera',
      'IPX8 water resistance'
    ],
    specifications: {
      "Main Display": "7.6-inch Dynamic AMOLED 2X, 120Hz",
      "Cover Display": "6.2-inch Super AMOLED, 120Hz",
      "Processor": "Snapdragon 8 Gen 2 for Galaxy",
      "RAM": "12GB",
      "Storage": "512GB",
      "Camera": "50MP + 12MP + 10MP",
      "Battery": "4400mAh with 25W fast charging",
      "OS": "Android 13 with One UI 5.1.1",
      "SKU": 'SAMSUNG-Z-FOLD5-BLU'
    },
    series: 'Galaxy Z',
    warranty: '1 Year'
  },
  {
    id: 3,
    name: 'Samsung Galaxy A54 5G',
    brand: 'Samsung',
    category: 'Smartphones',
    productType: 'Mid-range Phone',
    price: 38999,
    discount: 15,
    originalPrice: 45881,
    image: 'https://m.media-amazon.com/images/I/71kfHC4ANJL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71kfHC4ANJL.jpg',
      'https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/300463_0_kjm9ek.png',
      'https://img.us.news.samsung.com/us/wp-content/uploads/2023/03/14140259/samsung-galaxy-a54-5g-featured.png'
    ],
    description: 'Premium mid-range smartphone with 120Hz Super AMOLED display and quad camera system.',
    rating: 4.5,
    reviews: 876,
    isNew: true,
    colour: 'Awesome Violet',
    connectivity: '5G, Wi-Fi 6, Bluetooth 5.3',
    screenSize: '6.4 inches',
    stock: 167,
    features: [
      '120Hz Super AMOLED display',
      'Exynos 1380 processor',
      '5000mAh battery',
      'IP67 water and dust resistance',
      '4 years of OS updates'
    ],
    specifications: {
      "Display": "6.4-inch Super AMOLED, 120Hz",
      "Processor": "Exynos 1380",
      "RAM": "8GB",
      "Storage": "256GB (expandable to 1TB)",
      "Camera": "50MP + 12MP + 5MP",
      "Battery": "5000mAh with 25W fast charging",
      "Water Resistance": "IP67",
      "SKU": 'SAMSUNG-A54-VIO'
    },
    series: 'Galaxy A',
    warranty: '1 Year'
  },

  // Tablets
  {
    id: 4,
    name: 'Samsung Galaxy Tab S9 Ultra',
    brand: 'Samsung',
    category: 'Tablets',
    productType: 'Premium Tablet',
    price: 109999,
    discount: 10,
    originalPrice: 122221,
    image: 'https://miditech.ps/upload/02-2024/product/IMG_7437-IDX.png',
    images: [
      'https://miditech.ps/upload/02-2024/product/IMG_7437-IDX.png',
      'https://www.eros.ae/media/catalog/product/cache/4d25cc2d7db4bdfe410479ebb1f61f20/s/a/samsung_galaxy_tab_s9_12gb_ram_256gb_storage_12.4_amoled_displayhu_1.webp',
    ],
    description: 'Ultra-premium tablet with 14.6-inch Dynamic AMOLED 2X display and included S Pen.',
    rating: 4.8,
    reviews: 543,
    isNew: true,
    colour: 'Graphite',
    connectivity: 'Wi-Fi 6E, Bluetooth 5.3, 5G optional',
    screenSize: '14.6 inches',
    stock: 34,
    features: [
      '14.6-inch Dynamic AMOLED 2X, 120Hz',
      'Snapdragon 8 Gen 2 for Galaxy',
      'Included S Pen with low latency',
      'Under-display front camera',
      'IP68 water and dust resistance'
    ],
    specifications: {
      "Display": "14.6-inch Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 2 for Galaxy",
      "RAM": "12GB",
      "Storage": "256GB (expandable to 1TB)",
      "Camera": "13MP + 8MP (rear), 12MP (front)",
      "Battery": "11200mAh with 45W fast charging",
      "S Pen": "Included, wireless charging",
      "SKU": 'SAMSUNG-TAB-S9-ULTRA-GRY'
    },
    series: 'Galaxy Tab S',
    warranty: '1 Year'
  },
  {
    id: 5,
    name: 'Samsung Galaxy Tab A8',
    brand: 'Samsung',
    category: 'Tablets',
    productType: 'Budget Tablet',
    price: 17999,
    discount: 20,
    originalPrice: 22499,
    image: 'https://www.jiomart.com/images/product/original/493838629/samsung-galaxy-tab-a8-26-69-cm-10-5-inch-wi-fi-tablet-4-gb-ram-64-gb-silver-sm-x200nzscins-digital-o493838629-p604355937-10-202511252045.jpeg?im=Resize=(420,420)',
    images: [
      'https://www.jiomart.com/images/product/original/493838629/samsung-galaxy-tab-a8-26-69-cm-10-5-inch-wi-fi-tablet-4-gb-ram-64-gb-silver-sm-x200nzscins-digital-o493838629-p604355937-10-202511252045.jpeg?im=Resize=(420,420)',
      'https://images.samsung.com/is/image/samsung/p6pim/ie/sm-x200nzaaeua/gallery/ie-galaxy-a8-sm-x200-sm-x200nzaaeua-530568890?$Q90_1248_936_F_PNG$',
    ],
    description: 'Affordable tablet with 10.5-inch display, quad speakers, and kids-friendly features.',
    rating: 4.3,
    reviews: 987,
    isNew: false,
    colour: 'Silver',
    connectivity: 'Wi-Fi, Bluetooth 5.0',
    screenSize: '10.5 inches',
    stock: 189,
    features: [
      '10.5-inch LCD display',
      'Unisoc Tiger T618 processor',
      'Quad speakers with Dolby Atmos',
      'Kids Home parental controls',
      'Up to 15 hours battery life'
    ],
    specifications: {
      "Display": "10.5-inch LCD, 1920 x 1200",
      "Processor": "Unisoc Tiger T618",
      "RAM": "4GB",
      "Storage": "64GB (expandable to 1TB)",
      "Audio": "Quad speakers with Dolby Atmos",
      "Battery": "7040mAh",
      "OS": "Android 11",
      "SKU": 'SAMSUNG-TAB-A8-SLV'
    },
    series: 'Galaxy Tab A',
    warranty: '1 Year'
  },

  // Wearables
  {
    id: 6,
    name: 'Samsung Galaxy Watch6 Classic',
    brand: 'Samsung',
    category: 'Wearables',
    productType: 'Smart Watch',
    price: 42999,
    discount: 15,
    originalPrice: 50587,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-classic-r965-469944-sm-r965fzsains-537406435?$684_547_PNG$',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/2307/gallery/in-galaxy-watch6-classic-r965-469944-sm-r965fzsains-537406435?$684_547_PNG$',
      'https://m.media-amazon.com/images/I/71sRBqqrOpL.jpg',
      'https://img.global.news.samsung.com/in/wp-content/uploads/2023/07/Galaxy-Watch6_Combo-KV_2P-e1690432670725.jpg'
    ],
    description: 'Premium smartwatch with rotating bezel, advanced health monitoring, and sapphire crystal glass.',
    rating: 4.7,
    reviews: 654,
    isNew: true,
    colour: 'Black',
    connectivity: 'Bluetooth 5.3, Wi-Fi, LTE optional',
    screenSize: '47mm',
    stock: 78,
    features: [
      'Rotating physical bezel',
      'BioActive sensor for health monitoring',
      'Sapphire crystal glass',
      'Advanced sleep coaching',
      'Body composition analysis'
    ],
    specifications: {
      "Display": "1.5-inch Super AMOLED, 480x480",
      "Processor": "Exynos W930 Dual Core",
      "RAM": "2GB",
      "Storage": "16GB",
      "Battery": "425mAh, up to 40 hours",
      "Health Sensors": "BioActive sensor (Optical HR, ECG, BIA)",
      "Water Resistance": "5ATM + IP68",
      "SKU": 'SAMSUNG-WATCH6-CLASSIC-BLK'
    },
    series: 'Galaxy Watch',
    warranty: '1 Year'
  },
  {
    id: 7,
    name: 'Samsung Galaxy Buds2 Pro',
    brand: 'Samsung',
    category: 'Wearables',
    productType: 'Wireless Earbuds',
    price: 17999,
    discount: 25,
    originalPrice: 23999,
    image: 'https://m.media-amazon.com/images/I/61KVX-MbIUL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61KVX-MbIUL.jpg',
      'https://m.media-amazon.com/images/I/61ReFn+YL1L.jpg',
      'https://img.tatacliq.com/images/i10/437Wx649H/MP000000016239594_437Wx649H_202303031238341.jpeg'
    ],
    description: 'Premium true wireless earbuds with Intelligent ANC and 24-bit Hi-Fi sound.',
    rating: 4.6,
    reviews: 876,
    isNew: true,
    colour: 'Bora Purple',
    connectivity: 'Bluetooth 5.3',
    screenSize: 'N/A',
    stock: 156,
    features: [
      'Intelligent Active Noise Cancellation',
      '24-bit Hi-Fi sound',
      '360 Audio with head tracking',
      'IPX7 water resistance',
      'Voice Detect technology'
    ],
    specifications: {
      "Driver": "2-way with coaxial speaker",
      "Battery Life": "5 hours (ANC on), 18 hours with case",
      "Charging": "Wireless charging, USB-C",
      "Water Resistance": "IPX7",
      "Connectivity": "Bluetooth 5.3",
      "Features": "360 Audio, Bixby voice wake-up",
      "SKU": 'SAMSUNG-BUDS2-PRO-PUR'
    },
    series: 'Galaxy Buds',
    warranty: '1 Year'
  },

  // Televisions
  {
    id: 8,
    name: 'Samsung 65" QN900C Neo QLED 8K Smart TV',
    brand: 'Samsung',
    category: 'Televisions',
    productType: '8K QLED TV',
    price: 489999,
    discount: 18,
    originalPrice: 597560,
    image: 'http://images-cdn.ubuy.co.in/665e2cdab855db291b67916a-samsung-65-class-qn900c-neo-qled-8k.jpg',
    images: [
      'http://images-cdn.ubuy.co.in/665e2cdab855db291b67916a-samsung-65-class-qn900c-neo-qled-8k.jpg',
      'https://images.samsung.com/is/image/samsung/p6pim/levant/qa85qn800cuxtw/gallery/levant-qled-qn800c-qa85qn800cuxtw-541081277?$Q90_1248_936_F_PNG$',
    ],
    description: 'Flagship 8K Neo QLED TV with Infinity Screen design and Quantum Mini LED technology.',
    rating: 4.9,
    reviews: 432,
    isNew: true,
    colour: 'Titan Black',
    connectivity: 'Wi-Fi 6E, Bluetooth 5.2, HDMI 2.1',
    screenSize: '65 inches',
    stock: 23,
    features: [
      'Neo Quantum Processor 8K',
      'Quantum Mini LED technology',
      'Infinity Screen design',
      'Object Tracking Sound Pro',
      'Gaming Hub with cloud gaming'
    ],
    specifications: {
      "Display Technology": "Neo QLED with Quantum Mini LED",
      "Resolution": "8K (7680 x 4320)",
      "Processor": "Neo Quantum Processor 8K",
      "HDR": "Quantum HDR 64X",
      "Refresh Rate": "144Hz",
      "Audio": "Object Tracking Sound Pro (6.2.2ch)",
      "Smart TV": "Tizen OS with Gaming Hub",
      "SKU": 'SAMSUNG-65QN900C-BLK'
    },
    series: 'Neo QLED 8K',
    warranty: '3 Years'
  },
  {
    id: 9,
    name: 'Samsung 55" Frame QLED 4K Smart TV',
    brand: 'Samsung',
    category: 'Televisions',
    productType: 'Lifestyle TV',
    price: 119999,
    discount: 20,
    originalPrice: 149999,
    image: 'https://img-prd-pim.poorvika.com/cdn-cgi/image/width=500,height=500,quality=75/product/samsung-the-frame-qled-4k-smart-tv-ls03f-55-inch-Front-View.png',
    images: [
      'https://img-prd-pim.poorvika.com/cdn-cgi/image/width=500,height=500,quality=75/product/samsung-the-frame-qled-4k-smart-tv-ls03f-55-inch-Front-View.png',
      'https://images.samsung.com/is/image/samsung/p6pim/in/qa55ls03faulxl/gallery/in-the-frame-ls03f-qa55ls03faulxl-thumb-547294023?$UX_EXT1_PNG$',
    ],
    description: 'Art-inspired TV that transforms into beautiful art when not in use with customizable bezels.',
    rating: 4.7,
    reviews: 765,
    isNew: false,
    colour: 'White',
    connectivity: 'Wi-Fi, Bluetooth 5.2, HDMI 2.0',
    screenSize: '55 inches',
    stock: 67,
    features: [
      'Art Mode displays artwork',
      'QLED 4K display',
      'Customizable bezels (sold separately)',
      'Ambient Mode+',
      'One Connect box for clean setup'
    ],
    specifications: {
      "Display Technology": "QLED",
      "Resolution": "4K (3840 x 2160)",
      "Art Mode": "Yes, with Art Store subscription",
      "HDR": "Quantum HDR",
      "Refresh Rate": "60Hz",
      "Audio": "Object Tracking Sound Lite",
      "Smart TV": "Tizen OS",
      "SKU": 'SAMSUNG-55FRAME-WHT'
    },
    series: 'The Frame',
    warranty: '2 Years'
  },

  // Home Appliances
  {
    id: 10,
    name: 'Samsung Bespoke 4-Door Flex Refrigerator',
    brand: 'Samsung',
    category: 'Home Appliances',
    productType: 'Refrigerator',
    price: 259999,
    discount: 12,
    originalPrice: 295454,
    image: 'https://img.us.news.samsung.com/us/wp-content/uploads/2021/01/12143804/Bespoke-Refrigerator-4-Door-Flex.gif',
    images: [
      'https://img.us.news.samsung.com/us/wp-content/uploads/2021/01/12143804/Bespoke-Refrigerator-4-Door-Flex.gif',
      'https://mahajanelectronics.com/cdn/shop/files/in-t-style-french-door-32inch-family-hub-rf71db9950qdtl-540400941_1024x.webp?v=1755155657',
    ],
    description: 'Bespoke refrigerator with customizable panels, FlexZone convertible compartment, and AI Family Hub.',
    rating: 4.8,
    reviews: 321,
    isNew: true,
    colour: 'Black Stainless',
    connectivity: 'Wi-Fi, SmartThings app',
    screenSize: 'N/A',
    stock: 28,
    features: [
      'Customizable front panels',
      'FlexZone convertible compartment',
      'AI Family Hub+ with camera',
      'Twin Cooling Plus technology',
      'SpaceMax technology'
    ],
    specifications: {
      "Capacity": "698 liters",
      "Doors": "4-door French door",
      "Technology": "Twin Cooling Plus, SpaceMax",
      "Smart Features": "AI Family Hub+, internal camera",
      "Convertible Zone": "FlexZone with 4 modes",
      "Energy Rating": "5-star",
      "SKU": 'SAMSUNG-BESPOKE-FRIDGE-BLK'
    },
    series: 'Bespoke',
    warranty: '10 Years on compressor'
  },
  {
    id: 11,
    name: 'Samsung AI Ecobubble Front Load Washing Machine',
    brand: 'Samsung',
    category: 'Home Appliances',
    productType: 'Washing Machine',
    price: 54999,
    discount: 25,
    originalPrice: 73332,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/ww12bb944dgbtl/gallery/in-ww9400b-ww12bb944dgbtl-537647613?$684_547_PNG$',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/ww12bb944dgbtl/gallery/in-ww9400b-ww12bb944dgbtl-537647613?$684_547_PNG$',
      'https://images.samsung.com/is/image/samsung/assets/my/washers-and-dryers/ecobubble-ai-wash/mo-black.jpg?$720_N_JPG$',
    ],
    description: 'AI-powered washing machine with Ecobubble technology and Super Speed wash.',
    rating: 4.6,
    reviews: 543,
    isNew: true,
    colour: 'Silver',
    connectivity: 'Wi-Fi, SmartThings app',
    screenSize: 'N/A',
    stock: 89,
    features: [
      'AI Wash for optimal cleaning',
      'Ecobubble technology',
      'Super Speed wash (39 minutes)',
      'Digital Inverter Motor',
      'SmartThings connectivity'
    ],
    specifications: {
      "Capacity": "9 kg",
      "Motor": "Digital Inverter Motor",
      "Special Features": "AI Wash, Ecobubble, Super Speed",
      "Wash Programs": "14 programs",
      "Energy Rating": "5-star",
      "Spin Speed": "1400 RPM",
      "SKU": 'SAMSUNG-AI-WASHER-SLV'
    },
    series: 'AI Ecobubble',
    warranty: '10 Years on motor'
  },

  // Monitors
  {
    id: 12,
    name: 'Samsung Odyssey Neo G9 49" Curved Gaming Monitor',
    brand: 'Samsung',
    category: 'Monitors',
    productType: 'Gaming Monitor',
    price: 169999,
    discount: 15,
    originalPrice: 199999,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReL_hxX8bkqy9psB0XIRYyYfhvdtSBJy1jDQ&s',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReL_hxX8bkqy9psB0XIRYyYfhvdtSBJy1jDQ&s',
      'https://m.media-amazon.com/images/I/71nyeKrwdnL.jpg',
    ],
    description: 'Ultrawide curved gaming monitor with Quantum Mini LED technology and 240Hz refresh rate.',
    rating: 4.8,
    reviews: 234,
    isNew: true,
    colour: 'White',
    connectivity: 'DisplayPort 1.4, HDMI 2.1, USB Hub',
    screenSize: '49 inches',
    stock: 45,
    features: [
      'Quantum Mini LED with 2048 dimming zones',
      '240Hz refresh rate',
      '1ms response time (GtG)',
      '1000R curvature',
      'CoreSync lighting'
    ],
    specifications: {
      "Panel Type": "VA with Quantum Mini LED",
      "Resolution": "5120 x 1440 (Dual QHD)",
      "Refresh Rate": "240Hz",
      "Response Time": "1ms (GtG)",
      "HDR": "HDR2000",
      "Curvature": "1000R",
      "Ports": "DisplayPort 1.4, HDMI 2.1 x2",
      "SKU": 'SAMSUNG-ODYSSEY-NEO-G9-WHT'
    },
    series: 'Odyssey',
    warranty: '3 Years'
  },
  {
    id: 13,
    name: 'Samsung M8 32" Smart Monitor',
    brand: 'Samsung',
    category: 'Monitors',
    productType: 'Smart Monitor',
    price: 42999,
    discount: 20,
    originalPrice: 53749,
    image: 'https://m.media-amazon.com/images/I/81HSllRLc6L._AC_UF1000,1000_QL80_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81HSllRLc6L._AC_UF1000,1000_QL80_.jpg',
      'https://rukminim2.flixcart.com/image/480/640/l4oi4cw0/monitor/j/i/j/-original-imagfgxavwqsvpsh.jpeg?q=90',
      'https://m.media-amazon.com/images/I/71LJ3RyxHQL._AC_UF350,350_QL50_.jpg'
    ],
    description: 'Smart monitor with 4K resolution, built-in streaming apps, and slim design.',
    rating: 4.5,
    reviews: 432,
    isNew: false,
    colour: 'Sunset Pink',
    connectivity: 'Wi-Fi, Bluetooth 4.2, HDMI, USB-C',
    screenSize: '32 inches',
    stock: 123,
    features: [
      'Built-in Samsung TV Plus',
      'Wireless Dex support',
      'SlimFit camera (optional)',
      'Office 365 integration',
      'Adaptive Picture'
    ],
    specifications: {
      "Panel Type": "VA",
      "Resolution": "4K UHD (3840 x 2160)",
      "Smart Features": "Built-in apps, Wireless Dex",
      "Ports": "USB-C, HDMI x2, USB-A x2",
      "Webcam": "SlimFit camera (sold separately)",
      "OS": "Tizen OS",
      "SKU": 'SAMSUNG-M8-PINK'
    },
    series: 'Smart Monitor',
    warranty: '2 Years'
  },

  // Soundbars
  {
    id: 14,
    name: 'Samsung HW-Q990C 11.1.4ch Soundbar',
    brand: 'Samsung',
    category: 'Audio',
    productType: 'Soundbar',
    price: 89999,
    discount: 22,
    originalPrice: 115384,
    image: 'https://m.media-amazon.com/images/I/71ADaLd7rNL.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71ADaLd7rNL.jpg',
      'https://m.media-amazon.com/images/I/81xf+rJ0SIL.jpg',
    ],
    description: '11.1.4ch soundbar with Dolby Atmos, wireless rear speakers, and SpaceFit Sound Pro.',
    rating: 4.8,
    reviews: 321,
    isNew: true,
    colour: 'Black',
    connectivity: 'Wi-Fi, Bluetooth 5.2, HDMI eARC',
    screenSize: 'N/A',
    stock: 56,
    features: [
      '11.1.4ch configuration',
      'Dolby Atmos & DTS:X',
      'Wireless rear speakers included',
      'SpaceFit Sound Pro',
      'Q-Symphony with compatible Samsung TVs'
    ],
    specifications: {
      "Channels": "11.1.4ch",
      "Power Output": "656W",
      "Audio Format": "Dolby Atmos, DTS:X",
      "Included": "Soundbar, wireless subwoofer, wireless rear speakers",
      "Connectivity": "HDMI eARC, Wi-Fi, Bluetooth 5.2",
      "Features": "SpaceFit Sound Pro, Q-Symphony",
      "SKU": 'SAMSUNG-HW-Q990C-BLK'
    },
    series: 'Q-Series Soundbar',
    warranty: '2 Years'
  },

  // Laptops
  {
    id: 15,
    name: 'Samsung Galaxy Book3 Ultra',
    brand: 'Samsung',
    category: 'Laptops',
    productType: 'Premium Laptop',
    price: 179999,
    discount: 10,
    originalPrice: 199999,
    image: 'https://img.global.news.samsung.com/in/wp-content/uploads/2023/02/fcov.jpg',
    images: [
      'https://img.global.news.samsung.com/in/wp-content/uploads/2023/02/fcov.jpg',
      'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-book3-360-13-3-inch-with-s-pen-np730-np730qfg-ka2in-534939173',
      'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-book3-ultra-16-inch-np960-np960xfh-xa1in-534939067?$720_576_JPG$'
    ],
    description: 'Premium laptop with AMOLED display, Intel Core i9 processor, and RTX 4070 graphics.',
    rating: 4.7,
    reviews: 189,
    isNew: true,
    colour: 'Graphite',
    connectivity: 'Wi-Fi 6E, Bluetooth 5.1, Thunderbolt 4',
    screenSize: '16 inches',
    stock: 34,
    features: [
      '3K Dynamic AMOLED 2X display',
      'Intel Core i9-13900H processor',
      'NVIDIA RTX 4070 graphics',
      'S Pen support',
      'Multi Control with Galaxy devices'
    ],
    specifications: {
      "Display": "16-inch 3K (2880 x 1800) Dynamic AMOLED 2X, 120Hz",
      "Processor": "Intel Core i9-13900H",
      "Graphics": "NVIDIA GeForce RTX 4070",
      "RAM": "32GB LPDDR5",
      "Storage": "1TB NVMe SSD",
      "Battery": "76Wh",
      "Weight": "1.79kg",
      "SKU": 'SAMSUNG-BOOK3-ULTRA-GRY'
    },
    series: 'Galaxy Book',
    warranty: '2 Years'
  },

  // Smartphones (Additional)
  {
    id: 16,
    name: 'Samsung Galaxy S23+ 5G',
    brand: 'Samsung',
    category: 'Smartphones',
    productType: 'Flagship Phone',
    price: 94999,
    discount: 14,
    originalPrice: 110464,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_SlFU8qZXVYkfRKEgqz85Jt4HaXPA-1cpOw&s',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_SlFU8qZXVYkfRKEgqz85Jt4HaXPA-1cpOw&s',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/mobile/t/0/g/-original-imah4zp7fvqp8wev.jpeg?q=90',
      'https://images.samsung.com/in/smartphones/galaxy-s23/buy/DM1-mob-1.jpg?imbypass=true'
    ],
    description: 'Premium smartphone with 50MP camera, 6.6-inch display, and Snapdragon 8 Gen 2 processor.',
    rating: 4.7,
    reviews: 765,
    isNew: true,
    colour: 'Cream',
    connectivity: '5G, Wi-Fi 6E, Bluetooth 5.3',
    screenSize: '6.6 inches',
    stock: 112,
    features: [
      '50MP triple camera system',
      '6.6-inch Dynamic AMOLED 2X, 120Hz',
      'Snapdragon 8 Gen 2 for Galaxy',
      '4700mAh battery',
      '45W fast charging'
    ],
    specifications: {
      "Display": "6.6-inch Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 2 for Galaxy",
      "RAM": "8GB",
      "Storage": "256GB",
      "Camera": "50MP + 12MP + 10MP",
      "Battery": "4700mAh with 45W fast charging",
      "OS": "Android 13 with One UI 5.1",
      "SKU": 'SAMSUNG-S23-PLUS-CRM'
    },
    series: 'Galaxy S',
    warranty: '1 Year'
  },

  // Audio (Additional)
  {
    id: 17,
    name: 'Samsung HW-S800B 3.1.2ch Ultra Slim Soundbar',
    brand: 'Samsung',
    category: 'Audio',
    productType: 'Slim Soundbar',
    price: 39999,
    discount: 30,
    originalPrice: 57141,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/hw-s800b-xl/gallery/in-slim-soundbar-hw-s800b-hw-s800b-xl-536974022?$684_547_PNG$',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/hw-s800b-xl/gallery/in-slim-soundbar-hw-s800b-hw-s800b-xl-536974022?$684_547_PNG$',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXEUCRx-mODvnBvnWhgQN6hB-jVATUwUvrNY11086EszbBx9Q3Ew8n95_l-5j7AI-nwuI&usqp=CAU',
    ],
    description: 'Ultra-slim soundbar with Dolby Atmos, wireless subwoofer, and Q-Symphony compatibility.',
    rating: 4.5,
    reviews: 432,
    isNew: true,
    colour: 'Black',
    connectivity: 'HDMI eARC, Bluetooth 5.2',
    screenSize: 'N/A',
    stock: 89,
    features: [
      'Ultra-slim design (1.6-inch height)',
      'Dolby Atmos & DTS Virtual:X',
      'Wireless subwoofer included',
      'Q-Symphony with compatible Samsung TVs',
      'Adaptive Sound'
    ],
    specifications: {
      "Channels": "3.1.2ch",
      "Dimensions": "1.6-inch height",
      "Audio Format": "Dolby Atmos, DTS Virtual:X",
      "Included": "Soundbar, wireless subwoofer",
      "Connectivity": "HDMI eARC, Bluetooth 5.2",
      "Features": "Q-Symphony, Adaptive Sound",
      "SKU": 'SAMSUNG-HW-S800B-BLK'
    },
    series: 'Slim Soundbar',
    warranty: '1 Year'
  },

  // Accessories
  {
    id: 18,
    name: 'Samsung 25W Super Fast Charging Adapter',
    brand: 'Samsung',
    category: 'Accessories',
    productType: 'Charger',
    price: 1999,
    discount: 40,
    originalPrice: 3332,
    image: 'https://rukminim2.flixcart.com/image/480/640/xif0q/battery-charger/m/g/l/ep-ta800nbegin-samsung-original-imaheee5775hj9cg.jpeg?q=90',
    images: [
      'https://rukminim2.flixcart.com/image/480/640/xif0q/battery-charger/m/g/l/ep-ta800nbegin-samsung-original-imaheee5775hj9cg.jpeg?q=90',
      'https://m.media-amazon.com/images/I/51wI3ihMKsL._AC_UF1000,1000_QL80_.jpg',
      'https://m.media-amazon.com/images/I/61HBcHQoHHL.jpg'
    ],
    description: 'Compact 25W USB-C fast charger compatible with Samsung Galaxy smartphones and tablets.',
    rating: 4.4,
    reviews: 876,
    isNew: false,
    colour: 'White',
    connectivity: 'USB-C',
    screenSize: 'N/A',
    stock: 345,
    features: [
      'Super Fast Charging 2.0',
      'Compact and portable design',
      'PD 3.0 compatible',
      'PPS (Programmable Power Supply)',
      'Official Samsung accessory'
    ],
    specifications: {
      "Output": "25W (5V/3A, 9V/2.77A)",
      "Input": "100-240V, 50-60Hz",
      "Connector": "USB-C",
      "Charging Protocol": "PD 3.0, PPS, AFC",
      "Compatibility": "Galaxy S23 series, Z Fold/Flip, Tab S series",
      "Dimensions": "50 x 50 x 28 mm",
      "SKU": 'SAMSUNG-25W-CHARGER-WHT'
    },
    series: 'Official Accessories',
    warranty: '1 Year'
  }
];

// Export filter options generator function
export const getSamsungFilterOptions = (products) => {
  const categories = ['All', 'Smartphones', 'Tablets', 'Wearables', 'Televisions', 'Home Appliances', 'Monitors', 'Audio', 'Laptops', 'Accessories'];
  const productTypes = [...new Set(products.map(p => p.productType))];
  const colours = [...new Set(products.map(p => p.colour))];
  const series = [...new Set(products.map(p => p.series))];
  const connectivityOptions = [...new Set(products.map(p => p.connectivity))];
  const screenSizes = [...new Set(products.map(p => p.screenSize))].filter(size => size !== 'N/A');
  
  return {
    sort: ['Newest', 'Price: Low to High', 'Price: High to Low', 'Popularity', 'Customer Rating'],
    category: categories,
    productType: productTypes.sort(),
    colour: colours.sort(),
    series: series.sort(),
    connectivity: connectivityOptions.sort(),
    screenSize: ['All', ...screenSizes.sort()],
    discount: ['10% and above', '12% and above', '15% and above', '18% and above', '20% and above', '22% and above', '25% and above', '30% and above', '40% and above'],
    priceRange: [
      'Under ₹5,000',
      '₹5,000 - ₹20,000',
      '₹20,000 - ₹50,000',
      '₹50,000 - ₹1,00,000',
      '₹1,00,000 - ₹2,00,000',
      '₹2,00,000 - ₹3,00,000',
      '₹3,00,000 - ₹5,00,000',
      'Above ₹5,00,000'
    ],
    rating: ['4.0 and above', '4.3 and above', '4.5 and above', '4.7 and above']
  };
};