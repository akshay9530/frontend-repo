const titanProducts = [
  // Watches - Men's
  {
    id: 1,
    name: 'Titan Edge Ceramic',
    brand: 'Titan',
    category: 'Watches',
    productType: 'Analog Watches',
    price: 24999,
    discount: 25,
    originalPrice: 33332,
    image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw64efcb3a/images/Titan/Catalog/1696QC06_1.jpg?sw=800&sh=800',
    images: [
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw64efcb3a/images/Titan/Catalog/1696QC06_1.jpg?sw=800&sh=800',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/watch/f/y/t/-original-imahfwzh9vtbmgfq.jpeg?q=90',
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw75653485/images/Titan/Catalog/1696NC01_1.jpg?sw=600&sh=600'
    ],
    description: 'World\'s slimmest watch with ceramic case, featuring the thinnest movement.',
    rating: 4.8,
    reviews: 1245,
    isNew: true,
    colour: 'Black Ceramic',
    size: 'Regular',
    stock: 56,
    features: [
      'World\'s slimmest watch',
      'Ceramic case and bracelet',
      'Scratch-resistant sapphire crystal',
      'Water resistant 30m',
      'Two-year warranty'
    ],
    specifications: {
      "Movement": "Quartz",
      "Case Material": "Ceramic",
      "Crystal": "Sapphire",
      "Water Resistance": "30 meters",
      "Battery Life": "3 years",
      "SKU": 'TITAN-EDGE-CERAMIC-001'
    },
    material: 'Ceramic',
    gender: 'Men'
  },
  {
    id: 2,
    name: 'Titan Raga Rose Gold',
    brand: 'Titan',
    category: 'Watches',
    productType: 'Analog Watches',
    price: 18999,
    discount: 30,
    originalPrice: 27142,
    image: 'https://m.media-amazon.com/images/I/516j8D-ft5L.jpg',
    images: [
      'https://m.media-amazon.com/images/I/516j8D-ft5L.jpg',
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw7fbd3e1a/images/Titan/Catalog/95288WM01_1.jpg?sw=600&sh=600',
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw61242041/images/Titan/Catalog/2606WM05_2.jpg?sw=600&sh=600'
    ],
    description: 'Elegant women\'s watch with rose gold plating and mother of pearl dial.',
    rating: 4.7,
    reviews: 987,
    isNew: true,
    colour: 'Rose Gold',
    size: 'Small',
    stock: 89,
    features: [
      'Rose gold plating',
      'Mother of pearl dial',
      'Diamond hour markers',
      'Leather strap',
      'Water resistant 30m'
    ],
    specifications: {
      "Movement": "Quartz",
      "Case Material": "Stainless Steel with Rose Gold Plating",
      "Dial": "Mother of Pearl",
      "Water Resistance": "30 meters",
      "Strap": "Genuine Leather",
      "SKU": 'TITAN-RAGA-ROSEGOLD-001'
    },
    material: 'Stainless Steel',
    gender: 'Women'
  },
  {
    id: 3,
    name: 'Titan Octane Sports',
    brand: 'Titan',
    category: 'Watches',
    productType: 'Digital Watches',
    price: 8999,
    discount: 35,
    originalPrice: 13845,
    image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw9c359812/images/Titan/Catalog/90154NL01_1.jpg?sw=600&sh=600',
    images: [
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw9c359812/images/Titan/Catalog/90154NL01_1.jpg?sw=600&sh=600',
      'https://img.tatacliq.com/images/i8/450Wx545H/MP000000015256260_450Wx545H_202211112059581.jpeg',
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwd08170dc/images/Titan/Catalog/90086KM01J_1.jpg?sw=360&sh=360'
    ],
    description: 'Rugged digital sports watch with multiple functions for active lifestyle.',
    rating: 4.6,
    reviews: 654,
    isNew: false,
    colour: 'Black/Red',
    size: 'Large',
    stock: 112,
    features: [
      'Digital-analog display',
      'Chronograph function',
      'Water resistant 100m',
      'Alarm and timer',
      'Backlight'
    ],
    specifications: {
      "Movement": "Digital Quartz",
      "Case Material": "Polycarbonate",
      "Water Resistance": "100 meters",
      "Functions": "Chronograph, Alarm, Timer",
      "Battery": "SR626SW",
      "SKU": 'TITAN-OCTANE-SPORTS-001'
    },
    material: 'Polycarbonate',
    gender: 'Men'
  },
  {
    id: 4,
    name: 'Titan Nebula Starry Night',
    brand: 'Titan',
    category: 'Watches',
    productType: 'Analog Watches',
    price: 15999,
    discount: 20,
    originalPrice: 19999,
    image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw18bfecec/images/Titan/Catalog/5064DL05_1.jpg?sw=600&sh=600',
    images: [
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw18bfecec/images/Titan/Catalog/5064DL05_1.jpg?sw=600&sh=600',
      'https://stg.titan.co.in/on/demandware.static/-/Library-Sites-TitanSharedLibrary/default/dwbfa191f6/images/Nebula-Jewels/nebula_moj_dev_m_5.png',
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw83a85172/images/Titan/Catalog/5064DL09_1.jpg?sw=600&sh=600'
    ],
    description: 'Celestial inspired watch with starry night dial and moon phase indicator.',
    rating: 4.8,
    reviews: 432,
    isNew: true,
    colour: 'Blue/Silver',
    size: 'Regular',
    stock: 67,
    features: [
      'Celestial dial design',
      'Moon phase indicator',
      'Stainless steel case',
      'Leather strap',
      'Exhibition case back'
    ],
    specifications: {
      "Movement": "Quartz",
      "Case Material": "Stainless Steel",
      "Special Feature": "Moon Phase Indicator",
      "Water Resistance": "50 meters",
      "Strap": "Genuine Leather",
      "SKU": 'TITAN-NEBULA-STARRY-001'
    },
    material: 'Stainless Steel',
    gender: 'Unisex'
  },
  {
    id: 5,
    name: 'Titan Karishma Diamond',
    brand: 'Titan',
    category: 'Watches',
    productType: 'Analog Watches',
    price: 32999,
    discount: 15,
    originalPrice: 38822,
    image: 'https://rukminim2.flixcart.com/image/480/640/xif0q/watch/k/j/3/-original-imahfwzkqh65rkdy.jpeg?q=90',
    images: [
      'https://rukminim2.flixcart.com/image/480/640/xif0q/watch/k/j/3/-original-imahfwzkqh65rkdy.jpeg?q=90',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/watch/z/l/h/-original-imahftsfyfmx6pdf.jpeg?q=90',
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/AUGUST/21/fTixVLwK_3ccbecccdab440bfb3cb363f35e7d937.jpg'
    ],
    description: 'Luxury women\'s watch with diamond-studded bezel and elegant design.',
    rating: 4.9,
    reviews: 289,
    isNew: true,
    colour: 'Gold/White',
    size: 'Small',
    stock: 34,
    features: [
      'Diamond-studded bezel',
      'Swiss quartz movement',
      'Mother of pearl dial',
      'Stainless steel bracelet',
      'Water resistant 30m'
    ],
    specifications: {
      "Movement": "Swiss Quartz",
      "Case Material": "Stainless Steel with Gold Plating",
      "Diamonds": "32 diamonds on bezel",
      "Dial": "Mother of Pearl",
      "Water Resistance": "30 meters",
      "SKU": 'TITAN-KARISHMA-DIAMOND-001'
    },
    material: 'Stainless Steel',
    gender: 'Women'
  },
  
  // Eyewear - Sunglasses
  {
    id: 6,
    name: 'Titan Eye+ Aviator Classic',
    brand: 'Titan',
    category: 'Eyewear',
    productType: 'Sunglasses',
    price: 3999,
    discount: 40,
    originalPrice: 6665,
    image: 'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/M/8/M8021GR19V_3_lar.jpg',
    images: [
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/M/8/M8021GR19V_3_lar.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/M/2/M281BR4V_3_lar.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/M/2/M281GY1V_3_lar.jpg'
    ],
    description: 'Classic aviator sunglasses with polarized lenses for UV protection.',
    rating: 4.7,
    reviews: 876,
    isNew: false,
    colour: 'Gold/Green',
    size: 'Medium',
    stock: 156,
    features: [
      'Polarized lenses',
      'UV400 protection',
      'Metal frame',
      'Spring hinges',
      'Hard case included'
    ],
    specifications: {
      "Lens Type": "Polarized",
      "UV Protection": "UV400",
      "Frame Material": "Metal",
      "Lens Material": "Polycarbonate",
      "Included": "Hard Case, Microfiber Cloth",
      "SKU": 'TITAN-AVIATOR-CLASSIC-001'
    },
    material: 'Metal',
    gender: 'Unisex'
  },
  {
    id: 7,
    name: 'Titan Eye+ Wayfarer Pro',
    brand: 'Titan',
    category: 'Eyewear',
    productType: 'Sunglasses',
    price: 2999,
    discount: 35,
    originalPrice: 4614,
    image: 'https://pbs.twimg.com/media/Gq6jrtNawAA7K3w.jpg',
    images: [
      'https://pbs.twimg.com/media/Gq6jrtNawAA7K3w.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/R/S/RSM4006601715050_1_lar.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/P/5/P549BR2V_1_lar.jpg'
    ],
    description: 'Modern wayfarer sunglasses with gradient lenses and acetate frame.',
    rating: 4.6,
    reviews: 543,
    isNew: true,
    colour: 'Tortoise Shell',
    size: 'Medium',
    stock: 189,
    features: [
      'Gradient lenses',
      'UV400 protection',
      'Acetate frame',
      'Lightweight design',
      'Includes soft pouch'
    ],
    specifications: {
      "Lens Type": "Gradient",
      "UV Protection": "UV400",
      "Frame Material": "Acetate",
      "Lens Material": "CR-39",
      "Weight": "25g",
      "SKU": 'TITAN-WAYFARER-PRO-001'
    },
    material: 'Acetate',
    gender: 'Unisex'
  },
  {
    id: 8,
    name: 'Titan Eye+ Sports Wrap',
    brand: 'Titan',
    category: 'Eyewear',
    productType: 'Sunglasses',
    price: 4999,
    discount: 30,
    originalPrice: 7141,
    image: 'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/p/4/p434yl2_1_lar.jpg',
    images: [
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/p/4/p434yl2_1_lar.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/p/4/p434yl2_5_lar.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/P/5/P552GR1V_1_lar.jpg'
    ],
    description: 'Wrap-around sports sunglasses with polarized lenses for outdoor activities.',
    rating: 4.8,
    reviews: 321,
    isNew: true,
    colour: 'Black/Red',
    size: 'Large',
    stock: 98,
    features: [
      'Polarized polycarbonate lenses',
      'Wrap-around design',
      'Anti-slip nose pads',
      'Adjustable temple tips',
      'Includes hard case'
    ],
    specifications: {
      "Lens Type": "Polarized",
      "UV Protection": "UV400",
      "Frame Material": "TR-90",
      "Lens Material": "Polycarbonate",
      "Activity": "Sports & Outdoor",
      "SKU": 'TITAN-SPORTS-WRAP-001'
    },
    material: 'TR-90',
    gender: 'Men'
  },
  
  // Eyewear - Prescription Glasses
  {
    id: 9,
    name: 'Titan Eye+ ThinOptics',
    brand: 'Titan',
    category: 'Eyewear',
    productType: 'Prescription Glasses',
    price: 5999,
    discount: 25,
    originalPrice: 7999,
    image: 'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/t/c/tc1019mfp1s_7_lar.jpg',
    images: [
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/t/c/tc1019mfp1s_7_lar.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/T/C/TC1019MFP3SBRV_7_lar.jpg',
      'https://d3995ea24pmi7m.cloudfront.net/media/catalog/product/T/A/TA00155UFA3SBUV_7_lar.jpg'
    ],
    description: 'Ultra-thin prescription glasses with blue light filter for digital protection.',
    rating: 4.7,
    reviews: 456,
    isNew: true,
    colour: 'Black',
    size: 'Medium',
    stock: 124,
    features: [
      'Blue light filter',
      'Ultra-thin frames',
      'Anti-reflective coating',
      'Lightweight titanium',
      'Includes cleaning kit'
    ],
    specifications: {
      "Lens Type": "Prescription with Blue Light Filter",
      "Frame Material": "Titanium",
      "Coating": "Anti-Reflective, Anti-Scratch",
      "Weight": "18g",
      "Prescription": "Available for all powers",
      "SKU": 'TITAN-THINOPTICS-001'
    },
    material: 'Titanium',
    gender: 'Unisex'
  },
  
  // Jewellery
  {
    id: 11,
    name: 'Titan Raga Diamond Necklace',
    brand: 'Titan',
    category: 'Jewellery',
    productType: 'Necklaces',
    price: 49999,
    discount: 20,
    originalPrice: 62499,
    image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/JUNE/26/zPTcmOFh_b375c313a08d472abc2618c07d58ccc5.jpg',
    images: [
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/JUNE/26/zPTcmOFh_b375c313a08d472abc2618c07d58ccc5.jpg',
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/OCTOBER/17/RNOcRv1J_60ec133de0794b59b7d5d0f10cb8169d.jpg',
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/24/gpthP2RR_04bbe2d4cfc74a84b73f347386315cf3.jpg'
    ],
    description: 'Elegant diamond necklace with 18k gold plating and certified diamonds.',
    rating: 4.9,
    reviews: 189,
    isNew: true,
    colour: 'Gold',
    size: '18 inches',
    stock: 28,
    features: [
      'Certified diamonds',
      '18k gold plating',
      'Adjustable length',
      'Secure clasp',
      'Premium velvet box'
    ],
    specifications: {
      "Material": "18k Gold Plated Sterling Silver",
      "Diamonds": "0.5 carat total",
      "Length": "18 inches (adjustable)",
      "Clasp": "Lobster Clasp",
      "Certification": "IGI Certified",
      "SKU": 'TITAN-RAGA-NECKLACE-001'
    },
    material: 'Gold Plated Sterling Silver',
    gender: 'Women'
  },
  {
    id: 12,
    name: 'Titan Karishma Diamond Earrings',
    brand: 'Titan',
    category: 'Jewellery',
    productType: 'Earrings',
    price: 29999,
    discount: 25,
    originalPrice: 39999,
    image: 'https://img.tatacliq.com/images/i22//437Wx649H/MP000000024733662_437Wx649H_202502071911551.jpeg',
    images: [
      'https://img.tatacliq.com/images/i22//437Wx649H/MP000000024733662_437Wx649H_202502071911551.jpeg',
      'https://www.miabytanishq.com/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw488f560c/images/Mia/hi-res/2819SCT_1.jpg?sw=480&sh=480',
      'https://img.tatacliq.com/images/i20//437Wx649H/MP000000024008427_437Wx649H_202410091447281.jpeg'
    ],
    description: 'Stud earrings with brilliant cut diamonds in 18k gold setting.',
    rating: 4.8,
    reviews: 156,
    isNew: true,
    colour: 'White Gold',
    size: 'Small',
    stock: 45,
    features: [
      'Brilliant cut diamonds',
      '18k white gold plating',
      'Screw-back closure',
      'Hypoallergenic',
      'Certificate included'
    ],
    specifications: {
      "Material": "18k White Gold Plated Sterling Silver",
      "Diamonds": "0.25 carat each",
      "Closure": "Screw Back",
      "Certification": "IGI Certified",
      "Hypoallergenic": "Yes",
      "SKU": 'TITAN-KARISHMA-EARRINGS-001'
    },
    material: 'White Gold Plated Sterling Silver',
    gender: 'Women'
  },
  {
    id: 13,
    name: 'Titan Nebula Star Bracelet',
    brand: 'Titan',
    category: 'Jewellery',
    productType: 'Bracelets',
    price: 15999,
    discount: 30,
    originalPrice: 22857,
    image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw60c67dab/images/Titan/Catalog/5501DM02_5.jpg?sw=600&sh=600',
    images: [
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw60c67dab/images/Titan/Catalog/5501DM02_5.jpg?sw=600&sh=600',
      'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwa69e0c97/images/Titan/Catalog/5600DM01_5.jpg?sw=600&sh=600',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80'
    ],
    description: 'Celestial themed bracelet with star charms and cubic zirconia stones.',
    rating: 4.7,
    reviews: 98,
    isNew: true,
    colour: 'Rose Gold',
    size: 'Adjustable',
    stock: 78,
    features: [
      'Celestial star charms',
      'Cubic zirconia stones',
      'Adjustable length',
      'Secure clasp',
      'Gift box included'
    ],
    specifications: {
      "Material": "Rose Gold Plated Brass",
      "Stones": "Cubic Zirconia",
      "Length": "7.5 inches (adjustable)",
      "Clasp": "Toggle Clasp",
      "Weight": "22g",
      "SKU": 'TITAN-NEBULA-BRACELET-001'
    },
    material: 'Rose Gold Plated Brass',
    gender: 'Women'
  },
  {
    id: 14,
    name: 'Titan Men\'s Leather Bracelet',
    brand: 'Titan',
    category: 'Jewellery',
    productType: 'Bracelets',
    price: 3999,
    discount: 35,
    originalPrice: 6154,
    image: 'https://m.media-amazon.com/images/I/511J28Qm3BL._AC_UY300_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/511J28Qm3BL._AC_UY300_.jpg',
      'https://sc04.alicdn.com/kf/H93d9eaf67fe84ebd9e5129b3df9647e2I.jpg_350x350.jpg',
    ],
    description: 'Rugged leather bracelet with stainless steel buckle for men.',
    rating: 4.6,
    reviews: 234,
    isNew: false,
    colour: 'Brown',
    size: 'Large',
    stock: 112,
    features: [
      'Genuine leather',
      'Stainless steel buckle',
      'Adjustable fit',
      'Water resistant',
      'Gift packaging'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Buckle": "Stainless Steel",
      "Length": "9 inches (adjustable)",
      "Width": "20mm",
      "Care": "Avoid water exposure",
      "SKU": 'TITAN-MENS-BRACELET-001'
    },
    material: 'Leather',
    gender: 'Men'
  },
  
  // Bags & Wallets
  {
    id: 15,
    name: 'Titan Men\'s Leather Wallet',
    brand: 'Titan',
    category: 'Accessories',
    productType: 'Wallets',
    price: 2499,
    discount: 40,
    originalPrice: 4165,
    image: 'https://cdn.grofers.com/da/cms-assets/cms/product/afb261a8-1b22-47d6-ad82-5b33869b368b.jpg',
    images: [
      'https://cdn.grofers.com/da/cms-assets/cms/product/afb261a8-1b22-47d6-ad82-5b33869b368b.jpg',
      'https://m.media-amazon.com/images/I/81Ol1FlBzML._AC_UY1100_.jpg',
      'https://m.media-amazon.com/images/I/61zJPwOVwbL._AC_UY1100_.jpg'
    ],
    description: 'Slim leather wallet with multiple card slots and RFID protection.',
    rating: 4.7,
    reviews: 456,
    isNew: true,
    colour: 'Black',
    size: 'Regular',
    stock: 189,
    features: [
      'Genuine leather',
      'RFID blocking technology',
      '8 card slots',
      '2 bill compartments',
      'ID window'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "RFID Protection": "Yes",
      "Card Slots": "8",
      "Compartments": "2",
      "Dimensions": "4.5 x 3.5 inches",
      "SKU": 'TITAN-MENS-WALLET-001'
    },
    material: 'Leather',
    gender: 'Men'
  },
  {
    id: 17,
    name: 'Titan Business Laptop Bag',
    brand: 'Titan',
    category: 'Accessories',
    productType: 'Bags',
    price: 8999,
    discount: 25,
    originalPrice: 11999,
    image: 'https://m.media-amazon.com/images/I/71iHFTzBk3L._AC_UF1000,1000_QL80_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71iHFTzBk3L._AC_UF1000,1000_QL80_.jpg',
      'https://m.media-amazon.com/images/I/71LHp9d0q+L._AC_UF1000,1000_QL80_.jpg',
      'https://m.media-amazon.com/images/I/71-xSqIZelL._AC_UF1000,1000_QL80_.jpg'
    ],
    description: 'Professional laptop bag with multiple compartments for business needs.',
    rating: 4.6,
    reviews: 123,
    isNew: false,
    colour: 'Black',
    size: '15.6 inch',
    stock: 89,
    features: [
      'Fits 15.6" laptop',
      'Multiple compartments',
      'Padded shoulder strap',
      'Water-resistant material',
      'Business card holder'
    ],
    specifications: {
      "Material": "Polyester",
      "Laptop Size": "Up to 15.6 inches",
      "Compartments": "Multiple",
      "Water Resistance": "Light Rain",
      "Dimensions": "16 x 12 x 5 inches",
      "SKU": 'TITAN-LAPTOP-BAG-001'
    },
    material: 'Polyester',
    gender: 'Men'
  },
  
  // Belts
  {
    id: 18,
    name: 'Titan Men\'s Formal Belt',
    brand: 'Titan',
    category: 'Accessories',
    productType: 'Belts',
    price: 1999,
    discount: 35,
    originalPrice: 3077,
    image: 'https://rukminim2.flixcart.com/image/480/640/belt/a/s/z/38-tbg3jlfm10bk0138-titan-belt-original-imade87fqasv2gzt.jpeg?q=90',
    images: [
      'https://rukminim2.flixcart.com/image/480/640/belt/a/s/z/38-tbg3jlfm10bk0138-titan-belt-original-imade87fqasv2gzt.jpeg?q=90',
      'https://rukminim2.flixcart.com/image/480/640/l02r1jk0/belt/k/u/w/-original-imagbxemuamwgdf4.jpeg?q=90',
      'https://rukminim2.flixcart.com/image/480/640/k4lmv0w0/belt/q/p/u/36-belt-tb182lm4r2l-belt-titan-original-imafngzzghcng4uq.jpeg?q=90'
    ],
    description: 'Formal leather belt with stainless steel buckle for office wear.',
    rating: 4.7,
    reviews: 345,
    isNew: true,
    colour: 'Black',
    size: '38 inches',
    stock: 156,
    features: [
      'Genuine leather',
      'Stainless steel buckle',
      'Formal design',
      'Multiple size options',
      'Durable construction'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Buckle": "Stainless Steel",
      "Size": "38 inches (other sizes available)",
      "Width": "35mm",
      "Care": "Leather conditioner",
      "SKU": 'TITAN-FORMAL-BELT-001'
    },
    material: 'Leather',
    gender: 'Men'
  },
  {
    id: 19,
    name: 'Titan Women\'s Fashion Belt',
    brand: 'Titan',
    category: 'Accessories',
    productType: 'Belts',
    price: 1599,
    discount: 40,
    originalPrice: 2665,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjR5UlcOYNM7H8onWcDke5qbW8L19bF1lyhg&s',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjR5UlcOYNM7H8onWcDke5qbW8L19bF1lyhg&s',
      'https://rukminim2.flixcart.com/image/704/844/ksyz8280/belt/j/z/b/46-black-and-brown-reversible-formal-belt-tb232lm4r2x-belt-titan-original-imag6f6sey9awvns.jpeg?q=20&crop=false',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80'
    ],
    description: 'Fashion belt with decorative buckle for women\'s casual wear.',
    rating: 4.6,
    reviews: 234,
    isNew: false,
    colour: 'Brown',
    size: '32 inches',
    stock: 178,
    features: [
      'Genuine leather',
      'Decorative buckle',
      'Adjustable fit',
      'Casual design',
      'Gift ready packaging'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Buckle": "Decorative Metal",
      "Size": "32 inches",
      "Width": "25mm",
      "Style": "Casual",
      "SKU": 'TITAN-WOMENS-BELT-001'
    },
    material: 'Leather',
    gender: 'Women'
  },
  
  // Perfumes & Fragrances
  {
    id: 20,
    name: 'Titan Skinn Raw for Men',
    brand: 'Titan',
    category: 'Fragrances',
    productType: 'Perfumes',
    price: 2999,
    discount: 30,
    originalPrice: 4286,
    image: 'https://www.bbassets.com/media/uploads/p/l/40083407_9-skinn-by-titan-raw-perfume-for-men-edp.jpg',
    images: [
      'https://www.bbassets.com/media/uploads/p/l/40083407_9-skinn-by-titan-raw-perfume-for-men-edp.jpg',
      'https://m.media-amazon.com/images/I/719Oi82cVjL.jpg',
      'https://m.media-amazon.com/images/I/61yZJiJvgoL.jpg'
    ],
    description: 'Masculine fragrance with woody and spicy notes for confident men.',
    rating: 4.8,
    reviews: 456,
    isNew: true,
    colour: 'Amber',
    size: '100ml',
    stock: 134,
    features: [
      'Woody-spicy fragrance',
      'Long lasting',
      'Eau de Parfum',
      'Elegant packaging',
      'Great for all occasions'
    ],
    specifications: {
      "Fragrance Type": "Eau de Parfum",
      "Volume": "100ml",
      "Notes": "Woody, Spicy, Amber",
      "Longevity": "8-10 hours",
      "Occasion": "Day & Night",
      "SKU": 'TITAN-SKINN-RAW-001'
    },
    material: 'Eau de Parfum',
    gender: 'Men'
  },
  {
    id: 21,
    name: 'Titan Skinn Celeste for Women',
    brand: 'Titan',
    category: 'Fragrances',
    productType: 'Perfumes',
    price: 3499,
    discount: 25,
    originalPrice: 4666,
    image: 'https://rukminim2.flixcart.com/image/480/640/xif0q/perfume/k/m/s/-original-imahea4fhuvnyhrq.jpeg?q=90',
    images: [
      'https://rukminim2.flixcart.com/image/480/640/xif0q/perfume/k/m/s/-original-imahea4fhuvnyhrq.jpeg?q=90',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80',
      'https://imgcdn.floweraura.com/titan-skinn-celeste-parfum-n-deodorant-combo-for-women-9789067gf-C_0.jpg'
    ],
    description: 'Elegant floral fragrance with fruity notes for sophisticated women.',
    rating: 4.7,
    reviews: 389,
    isNew: true,
    colour: 'Pink',
    size: '100ml',
    stock: 156,
    features: [
      'Floral-fruity fragrance',
      'Long lasting',
      'Eau de Parfum',
      'Elegant bottle design',
      'Perfect for special occasions'
    ],
    specifications: {
      "Fragrance Type": "Eau de Parfum",
      "Volume": "100ml",
      "Notes": "Floral, Fruity, Musky",
      "Longevity": "8-10 hours",
      "Occasion": "Evening & Special Events",
      "SKU": 'TITAN-SKINN-CELESTE-001'
    },
    material: 'Eau de Parfum',
    gender: 'Women'
  },
  
  // Gift Sets
  {
    id: 23,
    name: 'Titan Corporate Gift Set',
    brand: 'Titan',
    category: 'Gift Sets',
    productType: 'Gift Boxes',
    price: 7999,
    discount: 20,
    originalPrice: 9999,
    image: 'https://www.titancorporategifting.com/wp-content/uploads/2025/02/Mask-group-9.png',
    images: [
      'https://www.titancorporategifting.com/wp-content/uploads/2025/02/Mask-group-9.png',
    ],
    description: 'Premium corporate gift set including watch, wallet, and pen.',
    rating: 4.8,
    reviews: 89,
    isNew: true,
    colour: 'Black/Gold',
    size: 'Gift Box',
    stock: 45,
    features: [
      'Premium watch',
      'Leather wallet',
      'Executive pen',
      'Gift packaging',
      'Corporate branding available'
    ],
    specifications: {
      "Includes": "Watch, Wallet, Pen",
      "Packaging": "Premium Gift Box",
      "Customization": "Corporate Branding Available",
      "Occasion": "Corporate Gifting",
      "SKU": 'TITAN-CORPORATE-GIFT-001'
    },
    material: 'Multiple',
    gender: 'Unisex'
  },
  {
    id: 24,
    name: 'Titan Wedding Gift Set',
    brand: 'Titan',
    category: 'Gift Sets',
    productType: 'Gift Boxes',
    price: 14999,
    discount: 15,
    originalPrice: 17647,
    image: 'https://www.angroos.com/wp-content/uploads/2021/07/003-99-scaled.jpg',
    images: [
      'https://www.angroos.com/wp-content/uploads/2021/07/003-99-scaled.jpg',
    ],
    description: 'Luxury wedding gift set with matching watches for bride and groom.',
    rating: 4.9,
    reviews: 56,
    isNew: true,
    colour: 'Gold/Silver',
    size: 'Premium Box',
    stock: 28,
    features: [
      'Matching couple watches',
      'Premium packaging',
      'Personalization available',
      'Wedding card included',
      'Luxury presentation'
    ],
    specifications: {
      "Includes": "His & Hers Watches",
      "Packaging": "Luxury Wedding Box",
      "Personalization": "Engraving Available",
      "Occasion": "Wedding & Anniversary",
      "SKU": 'TITAN-WEDDING-GIFT-001'
    },
    material: 'Multiple',
    gender: 'Unisex'
  },
];

export default titanProducts;