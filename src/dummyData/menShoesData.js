export const menShoesData = [
  // Casual Sneakers
  {
    id: 1,
    name: 'Classic White Sneakers',
    brand: 'Nike',
    category: 'Sneakers',
    productType: 'Casual Sneakers',
    price: 6499,
    discount: 20,
    originalPrice: 8124,
    image: 'http://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png',
    images: [
      'http://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png',
      'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto/44f222ab-96b6-43b9-82e7-9a1bd888611d/NIKE+COURT+VISION+LO.png',
      'https://assets.ajio.com/medias/sys_master/root/20240506/NvqL/6638ec5e05ac7d77bb431bec/-1117Wx1400H-460941938-white-MODEL.jpg'
    ],
    description: 'Timeless white leather sneakers with premium comfort for everyday wear.',
    rating: 4.8,
    reviews: 324,
    isNew: true,
    colour: 'White',
    size: 'US 10',
    stock: 52,
    features: [
      'Premium leather upper',
      'Memory foam insole',
      'Rubber outsole',
      'Padded collar',
      'Lace-up closure'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Closure": "Lace-up",
      "Sole": "Rubber",
      "Style": "Casual",
      "Care": "Wipe Clean",
      "Occasion": "Casual & Everyday",
      "SKU": 'MS-NIKE-WHITE-001'
    }
  },
  {
    id: 2,
    name: 'Black Running Shoes',
    brand: 'Adidas',
    category: 'Sports',
    productType: 'Running Shoes',
    price: 7999,
    discount: 25,
    originalPrice: 10665,
    image: 'https://img.tatacliq.com/images/i19//1348Wx2000H/MP000000023553501_1348Wx2000H_202409060452201.jpeg',
    images: [
      'https://img.tatacliq.com/images/i19//1348Wx2000H/MP000000023553501_1348Wx2000H_202409060452201.jpeg',
      'https://assets.adidas.com/images/w_600,f_auto,q_auto/d3793c3e847b46e6b907b62fd380270a_faec/Ultrarun_5_Running_Shoes_Black_IH2640_db01_standard.jpg'
    ],
    description: 'High-performance running shoes with Boost technology for maximum energy return.',
    rating: 4.9,
    reviews: 456,
    isNew: true,
    colour: 'Black',
    size: 'US 11',
    stock: 38,
    features: [
      'Boost cushioning',
      'Breathable mesh upper',
      'Continental rubber outsole',
      'Torsion system',
      'Reflective details'
    ],
    specifications: {
      "Material": "Primeknit Upper",
      "Technology": "Boost Cushioning",
      "Weight": "290g (Size US 10)",
      "Activity": "Running & Jogging",
      "Care": "Wipe Clean",
      "SKU": 'MS-ADIDAS-RUN-001'
    }
  },
  
  // Formal Shoes
  {
    id: 3,
    name: 'Oxford Leather Shoes',
    brand: 'Steve Madden',
    category: 'Formal',
    productType: 'Oxford Shoes',
    price: 8999,
    discount: 30,
    originalPrice: 12857,
    image: 'https://m.media-amazon.com/images/I/716qSlxPRaL._SY575_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/716qSlxPRaL._SY575_.jpg',
      'https://assets.ajio.com/medias/sys_master/root/20230513/gngL/645e92ead55b7d0c63aaa521/-473Wx593H-410384145-blk-MODEL.jpg'
    ],
    description: 'Classic Oxford shoes with cap toe design for formal occasions and business wear.',
    rating: 4.7,
    reviews: 189,
    isNew: false,
    colour: 'Brown',
    size: 'US 9.5',
    stock: 28,
    features: [
      'Full-grain leather',
      'Cap toe design',
      'Leather lining',
      'Goodyear welted',
      'Leather sole'
    ],
    specifications: {
      "Material": "Full Grain Leather",
      "Closure": "Lace-up",
      "Construction": "Goodyear Welt",
      "Occasion": "Formal & Business",
      "Care": "Leather Conditioner",
      "SKU": 'MS-MADDEN-OXFORD-001'
    }
  },
  {
    id: 4,
    name: 'Derby Leather Shoes',
    brand: 'H&M',
    category: 'Formal',
    productType: 'Derby Shoes',
    price: 5499,
    discount: 35,
    originalPrice: 8459,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/OCTOBER/10/HafJA1Mu_8348ee0e21664cde8cee4765c86feeef.jpg',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/OCTOBER/10/HafJA1Mu_8348ee0e21664cde8cee4765c86feeef.jpg',
      'https://image.hm.com/assets/hm/81/0d/810d103e9b8e02c3db03d0a64da8f64411daa784.jpg?imwidth=2160'
    ],
    description: 'Elegant Derby shoes with open lacing system for smart casual occasions.',
    rating: 4.6,
    reviews: 167,
    isNew: true,
    colour: 'Black',
    size: 'US 10',
    stock: 42,
    features: [
      'Genuine leather',
      'Open lacing system',
      'Cushioned footbed',
      'Rubber sole',
      'Versatile styling'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Closure": "Open Lace",
      "Sole": "Rubber",
      "Style": "Smart Casual",
      "Care": "Leather Cleaner",
      "SKU": 'MS-HM-DERBY-001'
    }
  },
  
  // Loafers & Slip-ons
  {
    id: 5,
    name: 'Leather Penny Loafers',
    brand: 'Steve Madden',
    category: 'Loafers',
    productType: 'Penny Loafers',
    price: 6299,
    discount: 25,
    originalPrice: 8399,
    image: 'https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/000000410538109001/cyjXwlTH6CW-000000410538109001_1.jpg',
    images: [
      'https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/products/pictures/item/free/original/000000410538109001/cyjXwlTH6CW-000000410538109001_1.jpg',
      'https://assets.ajio.com/medias/sys_master/root/20230220/XFOA/63f3a737f997dde6f4b54b2e/-473Wx593H-410366207-cof-MODEL.jpg'
    ],
    description: 'Classic penny loafers with horsebit detail for sophisticated casual wear.',
    rating: 4.8,
    reviews: 234,
    isNew: true,
    colour: 'Burgundy',
    size: 'US 9',
    stock: 36,
    features: [
      'Premium leather',
      'Penny keeper strap',
      'Cushioned insole',
      'Leather sole',
      'Handcrafted details'
    ],
    specifications: {
      "Material": "Premium Calf Leather",
      "Closure": "Slip-on",
      "Sole": "Leather",
      "Style": "Classic",
      "Occasion": "Casual & Office",
      "Care": "Leather Care Kit",
      "SKU": 'MS-MADDEN-LOAFER-001'
    }
  },
  {
    id: 6,
    name: 'Canvas Slip-on Shoes',
    brand: 'Vans',
    category: 'Sneakers',
    productType: 'Slip-on Sneakers',
    price: 4299,
    discount: 20,
    originalPrice: 5374,
    image: 'https://m.media-amazon.com/images/I/51eDAxY8NHL._AC_UY1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/51eDAxY8NHL._AC_UY1000_.jpg',
      'https://m.media-amazon.com/images/I/91bRZOfh7nL._AC_UY1000_.jpg'
    ],
    description: 'Classic checkerboard slip-ons with elastic side accents for easy wear.',
    rating: 4.7,
    reviews: 345,
    isNew: false,
    colour: 'Checkerboard',
    size: 'US 10.5',
    stock: 68,
    features: [
      'Canvas upper',
      'Elastic side accents',
      'Padded collar',
      'Waffle outsole',
      'Signature checkerboard'
    ],
    specifications: {
      "Material": "Canvas",
      "Closure": "Slip-on",
      "Sole": "Waffle Rubber",
      "Style": "Skate",
      "Care": "Machine Washable",
      "SKU": 'MS-VANS-SLIPON-001'
    }
  },
  
  // Boots
  {
    id: 7,
    name: 'Leather Chelsea Boots',
    brand: 'Steve Madden',
    category: 'Boots',
    productType: 'Chelsea Boots',
    price: 8999,
    discount: 30,
    originalPrice: 12857,
    image: 'https://m.media-amazon.com/images/I/81yG3vzm-bL._AC_UY300_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81yG3vzm-bL._AC_UY300_.jpg',
      'https://assets.ajio.com/medias/sys_master/root/20210923/Edis/614b7714f997ddce89d74e2b/-473Wx593H-410292697-tan-MODEL.jpg'
    ],
    description: 'Stylish Chelsea boots with elastic side panels and pull tabs for easy wear.',
    rating: 4.8,
    reviews: 198,
    isNew: true,
    colour: 'Brown',
    size: 'US 11',
    stock: 32,
    features: [
      'Full-grain leather',
      'Elastic side panels',
      'Pull tabs',
      'Leather sole',
      'Classic silhouette'
    ],
    specifications: {
      "Material": "Full Grain Leather",
      "Closure": "Elastic Gore",
      "Sole": "Leather",
      "Style": "Chelsea Boot",
      "Season": "Fall & Winter",
      "Care": "Leather Conditioner",
      "SKU": 'MS-MADDEN-CHELSEA-001'
    }
  },
  {
    id: 8,
    name: 'Work Boots',
    brand: 'Timberland',
    category: 'Boots',
    productType: 'Work Boots',
    price: 11999,
    discount: 25,
    originalPrice: 15999,
    image: 'https://m.media-amazon.com/images/I/71AgmIUwccL._AC_UY1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71AgmIUwccL._AC_UY1000_.jpg',
      'https://m.media-amazon.com/images/I/718pL8pw8OL._AC_UY1000_.jpg'
    ],
    description: 'Durable work boots with waterproof construction and anti-fatigue technology.',
    rating: 4.9,
    reviews: 267,
    isNew: true,
    colour: 'Wheat',
    size: 'US 10',
    stock: 28,
    features: [
      'Waterproof leather',
      'Anti-fatigue technology',
      'Rubber lug outsole',
      'Padded collar',
      'Rebound footbed'
    ],
    specifications: {
      "Material": "Premium Waterproof Leather",
      "Waterproof": "Yes",
      "Technology": "Anti-Fatigue",
      "Sole": "Rubber Lug",
      "Care": "Leather Cleaner",
      "SKU": 'MS-TIMBERLAND-WORK-001'
    }
  },
  
  // Sports & Training
  {
    id: 9,
    name: 'Basketball Shoes',
    brand: 'Nike',
    category: 'Sports',
    productType: 'Basketball Shoes',
    price: 10999,
    discount: 20,
    originalPrice: 13749,
    image: 'https://img.tatacliq.com/images/i11/437Wx649H/MP000000018130378_437Wx649H_202306280357271.jpeg',
    images: [
      'https://img.tatacliq.com/images/i11/437Wx649H/MP000000018130378_437Wx649H_202306280357271.jpeg',
      'https://assets.ajio.com/medias/sys_master/root/20241104/2x9m/6728c02bf9b8ef490bffedd7/-473Wx593H-469685696-white-MODEL.jpg'
    ],
    description: 'High-performance basketball shoes with Zoom Air cushioning and ankle support.',
    rating: 4.8,
    reviews: 189,
    isNew: true,
    colour: 'Black/Red',
    size: 'US 10.5',
    stock: 34,
    features: [
      'Zoom Air cushioning',
      'Ankle support system',
      'Breathable mesh',
      'Multi-directional traction',
      'Lightweight construction'
    ],
    specifications: {
      "Material": "Mesh & Synthetic",
      "Cushioning": "Zoom Air",
      "Weight": "420g (Size US 10.5)",
      "Activity": "Basketball",
      "Care": "Wipe Clean",
      "SKU": 'MS-NIKE-BASKETBALL-001'
    }
  },
  {
    id: 10,
    name: 'Training Shoes',
    brand: 'Under Armour',
    category: 'Sports',
    productType: 'Training Shoes',
    price: 7499,
    discount: 30,
    originalPrice: 10714,
    image: 'https://underarmour.scene7.com/is/image/Underarmour/3027341-001_DEFAULT?rp=standard-30pad|gridTileDesktop&scl=1&fmt=jpg&qlt=50&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=512&hei=640&size=472,600',
    images: [
      'https://underarmour.scene7.com/is/image/Underarmour/3027341-001_DEFAULT?rp=standard-30pad|gridTileDesktop&scl=1&fmt=jpg&qlt=50&resMode=sharp2&cache=on,on&bgc=F0F0F0&wid=512&hei=640&size=472,600',
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/27334372/2024/2/15/8c12fa0f-0cad-40d6-829a-260edecc500d1707992188258-UA-Charged-Revitalize-6991707992188010-1.jpg'
    ],
    description: 'Versatile training shoes with Micro G cushioning for gym workouts and cross-training.',
    rating: 4.7,
    reviews: 156,
    isNew: true,
    colour: 'Grey/Black',
    size: 'US 11',
    stock: 46,
    features: [
      'Micro G cushioning',
      'Charged foam midsole',
      'Breathable upper',
      'Lateral support',
      'Durable outsole'
    ],
    specifications: {
      "Material": "Mesh & TPU",
      "Cushioning": "Micro G",
      "Weight": "340g (Size US 11)",
      "Activity": "Training & Gym",
      "Care": "Wipe Clean",
      "SKU": 'MS-UA-TRAINING-001'
    }
  },
  
  // Sandals & Slides
  {
    id: 11,
    name: 'Leather Sandals',
    brand: 'H&M',
    category: 'Sandals',
    productType: 'Leather Sandals',
    price: 2999,
    discount: 40,
    originalPrice: 4998,
    image: 'https://image.hm.com/assets/hm/4f/d7/4fd770b89675e30866547ad492b1a4884d06fe77.jpg',
    images: [
      'https://image.hm.com/assets/hm/4f/d7/4fd770b89675e30866547ad492b1a4884d06fe77.jpg',
      'https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/11953766/2020/6/15/1ef26e6a-6b8c-40e9-a7c8-f5cc63cb86741592229943617Leathersandals1.jpg'
    ],
    description: 'Comfortable leather sandals with adjustable straps for summer casual wear.',
    rating: 4.5,
    reviews: 178,
    isNew: true,
    colour: 'Brown',
    size: 'US 9',
    stock: 58,
    features: [
      'Genuine leather straps',
      'Adjustable buckle closure',
      'Cushioned footbed',
      'Rubber sole',
      'Beach and pool wear'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Closure": "Buckle",
      "Sole": "Rubber",
      "Season": "Summer",
      "Care": "Leather Cleaner",
      "SKU": 'MS-HM-SANDALS-001'
    }
  },
  {
    id: 12,
    name: 'Sport Slides',
    brand: 'Adidas',
    category: 'Sandals',
    productType: 'Slides',
    price: 2499,
    discount: 35,
    originalPrice: 3845,
    image: 'https://www.jdsports.com.sg/cdn/shop/files/jd_IF3668_a.jpg?v=1750963258&width=500',
    images: [
      'https://www.jdsports.com.sg/cdn/shop/files/jd_IF3668_a.jpg?v=1750963258&width=500',
      'https://assets.adidas.com/images/w_383,h_383,f_auto,q_auto,fl_lossy,c_fill,g_auto/624068c9517d41b485acad65010523bb_9366/adilette-shower-slides.jpg',
      
    ],
    description: 'Comfortable sport slides with Cloudfoam cushioning for post-workout recovery.',
    rating: 4.6,
    reviews: 289,
    isNew: false,
    colour: 'Black',
    size: 'US 10',
    stock: 72,
    features: [
      'Cloudfoam cushioning',
      'Adjustable strap',
      'Quick-dry material',
      'Lightweight EVA',
      'Shower safe'
    ],
    specifications: {
      "Material": "EVA Foam",
      "Closure": "Slide-on",
      "Waterproof": "Yes",
      "Weight": "Light (180g)",
      "Care": "Rinse with Water",
      "SKU": 'MS-ADIDAS-SLIDES-001'
    }
  },
  
  // Hiking & Outdoor
  {
    id: 13,
    name: 'Hiking Boots',
    brand: 'Columbia',
    category: 'Boots',
    productType: 'Hiking Boots',
    price: 9999,
    discount: 30,
    originalPrice: 14286,
    image: 'https://m.media-amazon.com/images/I/61JSW9fAHOL._AC_UY1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/61JSW9fAHOL._AC_UY1000_.jpg',
      'https://m.media-amazon.com/images/I/71S6zPl6NSL._AC_UY1000_.jpg'
    ],
    description: 'Waterproof hiking boots with advanced traction for outdoor adventures.',
    rating: 4.8,
    reviews: 234,
    isNew: true,
    colour: 'Navy/Orange',
    size: 'US 10.5',
    stock: 38,
    features: [
      'Omni-Tech waterproof',
      'Techlite midsole',
      'Omni-Grip traction',
      'Ankle support',
      'Durable construction'
    ],
    specifications: {
      "Material": "Nylon & Leather",
      "Waterproof": "Omni-Tech",
      "Sole": "Omni-Grip Rubber",
      "Activity": "Hiking & Trekking",
      "Care": "Wipe Clean",
      "SKU": 'MS-COLUMBIA-HIKE-001'
    }
  },
  
  // Luxury Shoes
  {
    id: 14,
    name: 'Italian Leather Brogues',
    brand: 'Steve Madden',
    category: 'Formal',
    productType: 'Brogues',
    price: 12999,
    discount: 20,
    originalPrice: 16249,
    image: 'https://assets.ajio.com/medias/sys_master/root/20230227/78Xc/63fcd50baeb26924e3933aba/-473Wx593H-410366197-184-MODEL.jpg',
    images: [
      'https://assets.ajio.com/medias/sys_master/root/20230227/78Xc/63fcd50baeb26924e3933aba/-473Wx593H-410366197-184-MODEL.jpg',
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/7923125/2018/12/13/4e7424fe-b12e-4c2f-b3dc-09e4645293601544706592253-Tan-Formal-Shoes-5281544706591413-1.jpg'
    ],
    description: 'Handcrafted Italian leather brogues with intricate perforation details.',
    rating: 4.9,
    reviews: 98,
    isNew: true,
    colour: 'Black',
    size: 'US 9.5',
    stock: 24,
    features: [
      'Italian calf leather',
      'Handcrafted details',
      'Perforated broguing',
      'Leather lining',
      'Leather sole'
    ],
    specifications: {
      "Material": "Italian Calf Leather",
      "Construction": "Handcrafted",
      "Style": "Brogues",
      "Occasion": "Formal & Weddings",
      "Care": "Professional Clean",
      "SKU": 'MS-MADDEN-BROGUES-001'
    }
  },
  
  // Casual Shoes
  {
    id: 15,
    name: 'Canvas Casual Shoes',
    brand: 'Converse',
    category: 'Sneakers',
    productType: 'Canvas Sneakers',
    price: 4999,
    discount: 25,
    originalPrice: 6665,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/v1/images/style/properties/Converse-Men-Navy-Chuck-Taylor-All-Star-Canvas-Shoes_c8721fb4d2f4c67b2293342632a7fcf7_images.jpg',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/v1/images/style/properties/Converse-Men-Navy-Chuck-Taylor-All-Star-Canvas-Shoes_c8721fb4d2f4c67b2293342632a7fcf7_images.jpg',
      'https://img.tatacliq.com/images/i26//437Wx649H/MP000000027844080_437Wx649H_202508201517571.jpeg'
    ],
    description: 'Iconic canvas sneakers with rubber toe cap and ankle patch.',
    rating: 4.7,
    reviews: 456,
    isNew: false,
    colour: 'White',
    size: 'US 10',
    stock: 82,
    features: [
      'Canvas upper',
      'Rubber toe cap',
      'OrthoLite insole',
      'Ankle patch',
      'Classic design'
    ],
    specifications: {
      "Material": "Canvas",
      "Closure": "Lace-up",
      "Sole": "Rubber",
      "Style": "Iconic",
      "Care": "Machine Washable",
      "SKU": 'MS-CONVERSE-CANVAS-001'
    }
  },
  
  // Winter Boots
  {
    id: 16,
    name: 'Snow Boots',
    brand: 'Timberland',
    category: 'Boots',
    productType: 'Snow Boots',
    price: 13999,
    discount: 25,
    originalPrice: 18665,
    image: 'https://assets.timberland.com/images/t_Thumbnail/v1719394248/TB1A2E31231-ALT4/Mens-Timberland-Premium-6Inch-Waterproof-Winter-Boot.png',
    images: [
      'https://assets.timberland.com/images/t_Thumbnail/v1719394248/TB1A2E31231-ALT4/Mens-Timberland-Premium-6Inch-Waterproof-Winter-Boot.png',
      'https://www.travelmag.com/wp-content/uploads/2023/09/euro-hiker-large-scaled.jpg'
    ],
    description: 'Insulated snow boots with waterproof construction for extreme winter conditions.',
    rating: 4.8,
    reviews: 178,
    isNew: true,
    colour: 'Black',
    size: 'US 11',
    stock: 32,
    features: [
      '400g insulation',
      'Waterproof leather',
      'Temperature rated -32°C',
      'Removable liner',
      'Ice traction'
    ],
    specifications: {
      "Material": "Waterproof Leather",
      "Insulation": "400g Thinsulate",
      "Temperature": "-32°C Rated",
      "Sole": "Ice Grip Rubber",
      "Care": "Leather Cleaner",
      "SKU": 'MS-TIMBERLAND-SNOW-001'
    }
  },
  
  // Moccasins
  {
    id: 17,
    name: 'Leather Moccasins',
    brand: 'H&M',
    category: 'Loafers',
    productType: 'Moccasins',
    price: 3799,
    discount: 35,
    originalPrice: 5845,
    image: 'https://image.hm.com/assets/hm/49/55/4955e768479189d0cddb2c969e0eb874da0d45ee.jpg?imwidth=1260',
    images: [
      'https://image.hm.com/assets/hm/49/55/4955e768479189d0cddb2c969e0eb874da0d45ee.jpg?imwidth=1260',
      'https://image.hm.com/assets/hm/1c/22/1c22976c7ec3dd977d4d6d437f611d3614f2487a.jpg?imwidth=2160'
    ],
    description: 'Soft leather moccasins with hand-sewn construction for ultimate comfort.',
    rating: 4.6,
    reviews: 134,
    isNew: true,
    colour: 'Tan',
    size: 'US 9',
    stock: 46,
    features: [
      'Soft leather upper',
      'Hand-sewn construction',
      'Cushioned footbed',
      'Flexible sole',
      'Indoor/outdoor wear'
    ],
    specifications: {
      "Material": "Soft Leather",
      "Construction": "Hand-sewn",
      "Sole": "Flexible Rubber",
      "Style": "Moccasin",
      "Care": "Leather Conditioner",
      "SKU": 'MS-HM-MOCCASIN-001'
    }
  },
  
  // Golf Shoes
  {
    id: 20,
    name: 'Golf Shoes',
    brand: 'Adidas',
    category: 'Sports',
    productType: 'Golf Shoes',
    price: 9999,
    discount: 25,
    originalPrice: 13332,
    image: 'https://m.media-amazon.com/images/I/71yzkyTuQ3L._AC_UY1000_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71yzkyTuQ3L._AC_UY1000_.jpg',
      'https://m.media-amazon.com/images/I/71Mp9BGPP4L._AC_UY1000_.jpg'
    ],
    description: 'Waterproof golf shoes with spiked outsole for optimal grip on the course.',
    rating: 4.9,
    reviews: 156,
    isNew: true,
    colour: 'White/Black',
    size: 'US 10',
    stock: 34,
    features: [
      'Waterproof construction',
      'Boost cushioning',
      'Spiked outsole',
      'Breathable upper',
      '360° traction'
    ],
    specifications: {
      "Material": "Waterproof Leather",
      "Technology": "Boost Cushioning",
      "Outsole": "Spiked Golf",
      "Activity": "Golf",
      "Care": "Wipe Clean",
      "SKU": 'MS-ADIDAS-GOLF-001'
    }
  }
];