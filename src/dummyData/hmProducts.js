// src/data/hmProducts.js
export const hmProducts = [
  // Women's Clothing
  {
    id: 1,
    name: 'H&M Loose Fit Denim Jacket',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Jackets',
    price: 2999,
    discount: 40,
    originalPrice: 4998,
    image: 'https://image.hm.com/assets/hm/fd/ea/fdead3e6016b3bcb1fb9ea4db6b3dc0cffe692dc.jpg',
    images: [
      'https://image.hm.com/assets/hm/fd/ea/fdead3e6016b3bcb1fb9ea4db6b3dc0cffe692dc.jpg',
      'https://image.hm.com/assets/hm/a8/74/a874dd60d04b4b7c924cdd6bdeea67a6267a1461.jpg?imwidth=2160',
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/SEPTEMBER/10/MQsmGire_098e980d375c42c79757b099858ad1c2.jpg'
    ],
    description: 'Oversized denim jacket with a loose fit and light wash for a casual look.',
    rating: 4.5,
    reviews: 876,
    isNew: true,
    colour: 'Light Blue',
    size: 'M',
    stock: 89,
    features: [
      '100% cotton denim',
      'Oversized fit',
      'Button front',
      'Front pockets',
      'Light wash'
    ],
    specifications: {
      "Material": "100% Cotton Denim",
      "Fit": "Loose/Oversized",
      "Care": "Machine wash at 30°C",
      "Style": "Casual",
      "Collection": "Divided",
      "SKU": 'HM-DENIM-JACKET-001'
    },
    collection: 'Divided',
    gender: 'Women'
  },
  {
    id: 2,
    name: 'H&M Ribbed Knit Dress',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Dresses',
    price: 1999,
    discount: 50,
    originalPrice: 3998,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80',
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=900&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=80'
    ],
    description: 'Bodycon dress with ribbed knit fabric and turtleneck for a chic look.',
    rating: 4.6,
    reviews: 654,
    isNew: true,
    colour: 'Black',
    size: 'S',
    stock: 112,
    features: [
      'Ribbed knit fabric',
      'Bodycon fit',
      'Turtleneck collar',
      'Mid-length',
      'Stretchy material'
    ],
    specifications: {
      "Material": "95% Viscose, 5% Elastane",
      "Fit": "Bodycon",
      "Length": "Mid-length",
      "Care": "Hand wash recommended",
      "Collection": "H&M Studio",
      "SKU": 'HM-RIBBED-DRESS-001'
    },
    collection: 'H&M Studio',
    gender: 'Women'
  },
  {
    id: 4,
    name: 'H&M Logo Print T-shirt',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'T-Shirts',
    price: 799,
    discount: 60,
    originalPrice: 1998,
    image: 'https://image.hm.com/assets/hm/ca/3b/ca3beec86e5bc80c3687fb7c8de2a8caa26765be.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/ca/3b/ca3beec86e5bc80c3687fb7c8de2a8caa26765be.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/ab/33/ab334394227d80f60e739972911b96bce03fb167.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/5d/22/5d22cd7ab7b2b25dce8d2a55e4befceb8587b6df.jpg?imwidth=2160'
    ],
    description: 'Basic cotton t-shirt with H&M logo print for everyday casual wear.',
    rating: 4.3,
    reviews: 1234,
    isNew: false,
    colour: 'White',
    size: 'L',
    stock: 256,
    features: [
      '100% organic cotton',
      'Regular fit',
      'Screen print logo',
      'Crew neck',
      'Sustainable material'
    ],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Regular",
      "Sustainability": "Organic Cotton",
      "Care": "Machine wash at 40°C",
      "Collection": "Conscious",
      "SKU": 'HM-LOGO-TEE-001'
    },
    collection: 'Conscious',
    gender: 'Women'
  },
  {
    id: 5,
    name: 'H&M Knit Cardigan',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Sweaters',
    price: 2499,
    discount: 30,
    originalPrice: 3570,
    image: 'https://image.hm.com/assets/hm/95/16/95161f566e8e33b54c55b265925293c8255745d7.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/95/16/95161f566e8e33b54c55b265925293c8255745d7.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/cd/66/cd6617e097cb2b602ce80e582be5f3107339d7b4.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/6e/7c/6e7c72ef211d0cd1f894f6cf3669c9019bc8eb9d.jpg?imwidth=2160'
    ],
    description: 'Chunky knit cardigan with button front for cozy layering.',
    rating: 4.7,
    reviews: 567,
    isNew: true,
    colour: 'Cream',
    size: 'S',
    stock: 94,
    features: [
      'Chunky knit fabric',
      'Button front',
      'Long sleeves',
      'Pockets',
      'Oversized fit'
    ],
    specifications: {
      "Material": "70% Acrylic, 30% Wool",
      "Fit": "Oversized",
      "Closure": "Button Front",
      "Care": "Machine wash at 30°C",
      "Collection": "Premium Quality",
      "SKU": 'HM-CARDIGAN-001'
    },
    collection: 'Premium Quality',
    gender: 'Women'
  },
  
  // Men's Clothing
  {
    id: 6,
    name: 'H&M Slim Fit Chinos',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Pants',
    price: 1799,
    discount: 40,
    originalPrice: 2998,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/SEPTEMBER/10/zJZLsMYb_2817ba9d0cc449a6aaf8c26d2383f2a5.jpg',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/SEPTEMBER/10/zJZLsMYb_2817ba9d0cc449a6aaf8c26d2383f2a5.jpg',
      'https://image.hm.com/assets/hm/05/ea/05eaf4f96d11a3cb3ef7124aeaf4a94f6c9260a3.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/51/69/516952584bccc812d03e0d2c9487309322c788f4.jpg?imwidth=768'
    ],
    description: 'Slim fit chinos in stretch cotton twill for comfortable all-day wear.',
    rating: 4.5,
    reviews: 789,
    isNew: true,
    colour: 'Navy',
    size: '32W x 32L',
    stock: 134,
    features: [
      'Stretch cotton twill',
      'Slim fit',
      'Button and zip fly',
      'Four pockets',
      'Easy care'
    ],
    specifications: {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Slim",
      "Closure": "Button & Zip Fly",
      "Care": "Machine wash at 40°C",
      "Collection": "Modern Classic",
      "SKU": 'HM-CHINOS-001'
    },
    collection: 'Modern Classic',
    gender: 'Men'
  },
  {
    id: 7,
    name: 'H&M Oxford Shirt',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Shirts',
    price: 1299,
    discount: 45,
    originalPrice: 2362,
    image: 'https://image.hm.com/assets/hm/68/57/68574ee51428689db0936e61f16faf3535b96422.jpg?imwidth=768',
    images: [
      'https://image.hm.com/assets/hm/68/57/68574ee51428689db0936e61f16faf3535b96422.jpg?imwidth=768',
      'https://image.hm.com/assets/hm/ca/84/ca8423bef1118e7149d56dec14cb734adc13915e.jpg',
      'https://image.hm.com/assets/hm/3d/63/3d63433da6949ac774cb20f3967d07835490bcf8.jpg'
    ],
    description: 'Classic Oxford shirt in regular fit with button-down collar.',
    rating: 4.6,
    reviews: 456,
    isNew: false,
    colour: 'Light Blue',
    size: 'M',
    stock: 167,
    features: [
      '100% cotton Oxford fabric',
      'Regular fit',
      'Button-down collar',
      'Button cuffs',
      'Chest pocket'
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Collar": "Button-down",
      "Care": "Machine wash at 40°C",
      "Collection": "Premium Quality",
      "SKU": 'HM-OXFORD-SHIRT-001'
    },
    collection: 'Premium Quality',
    gender: 'Men'
  },
  {
    id: 8,
    name: 'H&M Hooded Sweatshirt',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Sweatshirts',
    price: 1999,
    discount: 35,
    originalPrice: 3075,
    image: 'https://assets.ajio.com/medias/sys_master/root/20240914/QOXr/66e4e5556f60443f317b7973/-473Wx593H-700420474-olive-MODEL.jpg',
    images: [
      'https://assets.ajio.com/medias/sys_master/root/20240914/QOXr/66e4e5556f60443f317b7973/-473Wx593H-700420474-olive-MODEL.jpg',
      'https://image.hm.com/assets/hm/fe/1d/fe1d9eb32ad4ce6ff75027b9489e513edcc66bb4.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/01/30/01301dcd95cec03a4231345e6efcf0e4f0b1abf9.jpg?imwidth=2160'
    ],
    description: 'Comfortable hooded sweatshirt with kangaroo pocket and drawstring hood.',
    rating: 4.7,
    reviews: 892,
    isNew: true,
    colour: 'Grey',
    size: 'L',
    stock: 189,
    features: [
      'Soft cotton blend',
      'Kangaroo pocket',
      'Drawstring hood',
      'Ribbed cuffs and hem',
      'Relaxed fit'
    ],
    specifications: {
      "Material": "80% Cotton, 20% Polyester",
      "Fit": "Relaxed",
      "Features": "Hood & Pocket",
      "Care": "Machine wash at 30°C",
      "Collection": "Divided",
      "SKU": 'HM-HOODIE-001'
    },
    collection: 'Divided',
    gender: 'Men'
  },
  {
    id: 9,
    name: 'H&M Cargo Pants',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Pants',
    price: 2299,
    discount: 30,
    originalPrice: 3284,
    image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/JULY/30/SaTc7Pa1_914e989ba1604787a2a48ab25e5760ca.jpg',
    images: [
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/JULY/30/SaTc7Pa1_914e989ba1604787a2a48ab25e5760ca.jpg',
      'https://image.hm.com/assets/hm/3e/05/3e056c76e27b0b105087d54dd23d37713e9a41cd.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/aa/d5/aad5ca7d7a93d8fe62e69c53f132fe43c2bbf2d9.jpg'
    ],
    description: 'Utility cargo pants with multiple pockets and tapered leg.',
    rating: 4.4,
    reviews: 321,
    isNew: true,
    colour: 'Olive Green',
    size: '34W x 32L',
    stock: 76,
    features: [
      'Cotton twill fabric',
      'Multiple cargo pockets',
      'Tapered leg',
      'Adjustable waist tabs',
      'Button and zip fly'
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular, Tapered Leg",
      "Pockets": "Multiple Cargo Pockets",
      "Care": "Machine wash at 40°C",
      "Collection": "Divided",
      "SKU": 'HM-CARGO-PANTS-001'
    },
    collection: 'Divided',
    gender: 'Men'
  },
  {
    id: 10,
    name: 'H&M Denim Jacket',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Jackets',
    price: 3499,
    discount: 25,
    originalPrice: 4665,
    image: 'https://image.hm.com/assets/hm/5e/74/5e748cff456e96f0c674597e827ce6433849bc57.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/5e/74/5e748cff456e96f0c674597e827ce6433849bc57.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/c6/0b/c60b946013a8d50a09ab10ff8ede001b9923d883.jpg?imwidth=768',
      'https://image.hm.com/assets/hm/10/f5/10f5b1fa2b3428de7ca49e9fb8b44ddf0a5ebed8.jpg?imwidth=2160'
    ],
    description: 'Classic denim jacket in regular fit with button front and chest pockets.',
    rating: 4.8,
    reviews: 567,
    isNew: false,
    colour: 'Dark Blue',
    size: 'L',
    stock: 58,
    features: [
      '100% cotton denim',
      'Regular fit',
      'Button front',
      'Chest pockets',
      'Classic wash'
    ],
    specifications: {
      "Material": "100% Cotton Denim",
      "Fit": "Regular",
      "Closure": "Button Front",
      "Care": "Machine wash at 30°C",
      "Collection": "Premium Quality",
      "SKU": 'HM-MENS-DENIM-001'
    },
    collection: 'Premium Quality',
    gender: 'Men'
  },
  
  // Accessories
  {
    id: 13,
    name: 'H&M Leather Belt',
    brand: 'H&M',
    category: 'Accessories',
    productType: 'Belts',
    price: 999,
    discount: 50,
    originalPrice: 1998,
    image: 'https://image.hm.com/assets/hm/db/00/db004e8b396ecc25bce5d85f71717846657c24e2.jpg',
    images: [
      'https://image.hm.com/assets/hm/db/00/db004e8b396ecc25bce5d85f71717846657c24e2.jpg',
      'https://image.hm.com/assets/hm/c6/26/c62667049595106235ba7dac34963f564cb895d6.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/e8/89/e889594f9a4aebd0b35cbcd9171185187a949efa.jpg?imwidth=2160'
    ],
    description: 'Genuine leather belt with simple buckle for everyday wear.',
    rating: 4.4,
    reviews: 456,
    isNew: true,
    colour: 'Brown',
    size: '32 inches',
    stock: 234,
    features: [
      'Genuine leather',
      'Simple buckle',
      'Adjustable fit',
      'Classic design',
      'Versatile'
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Buckle": "Metal",
      "Size": "32 inches",
      "Care": "Wipe clean",
      "Collection": "Premium Quality",
      "SKU": 'HM-BELT-001'
    },
    collection: 'Premium Quality',
    gender: 'Men'
  },
  {
    id: 14,
    name: 'H&M Canvas Tote Bag',
    brand: 'H&M',
    category: 'Accessories',
    productType: 'Bags',
    price: 1299,
    discount: 35,
    originalPrice: 1998,
    image: 'https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/2025/SEPTEMBER/10/9WV44eo7_57e094b5faf94075ad6adfb2f8e26b76.jpg',
    images: [
      'https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/2025/SEPTEMBER/10/9WV44eo7_57e094b5faf94075ad6adfb2f8e26b76.jpg',
      'https://image.hm.com/assets/hm/ff/59/ff591db12b922b87dfee278ecb28eee891cd50e5.jpg?imwidth=2160',
      'https://assets.ajio.com/medias/sys_master/root/20250312/GH6u/67d1a19d2960820c49e75c8f/-473Wx593H-700375425-beige-MODEL.jpg'
    ],
    description: 'Sustainable canvas tote bag with leather-like handles and roomy interior.',
    rating: 4.7,
    reviews: 321,
    isNew: true,
    colour: 'Beige',
    size: 'Large',
    stock: 167,
    features: [
      'Sustainable canvas',
      'Leather-like handles',
      'Roomy interior',
      'Open top',
      'Durable construction'
    ],
    specifications: {
      "Material": "100% Cotton Canvas",
      "Dimensions": "40 x 35 x 15 cm",
      "Handles": "Leather-like",
      "Care": "Spot clean",
      "Collection": "Conscious",
      "SKU": 'HM-TOTE-BAG-001'
    },
    collection: 'Conscious',
    gender: 'Unisex'
  },
  {
    id: 15,
    name: 'H&M Wool Blend Scarf',
    brand: 'H&M',
    category: 'Accessories',
    productType: 'Scarves',
    price: 799,
    discount: 45,
    originalPrice: 1453,
    image: 'https://image.hm.com/assets/hm/0d/a0/0da007c3a74497ed815356d021405fb1aa1b43e5.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/0d/a0/0da007c3a74497ed815356d021405fb1aa1b43e5.jpg?imwidth=2160',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG6sog3RIZFSiIOYwhIwC1m2TPWSpn_KbnWvhwgCrFih8nCz3LlG81gHiklp14cSb00qE&usqp=CAU',
      'https://image.hm.com/assets/hm/a0/3b/a03b7149f0d4d938da56fee29f608bc9a873e7e5.jpg?imwidth=1260'
    ],
    description: 'Warm wool blend scarf with fringe detailing for winter styling.',
    rating: 4.6,
    reviews: 234,
    isNew: false,
    colour: 'Grey',
    size: 'One Size',
    stock: 189,
    features: [
      'Wool blend fabric',
      'Fringe detailing',
      'Warm and cozy',
      'Versatile styling',
      'Seasonal essential'
    ],
    specifications: {
      "Material": "70% Acrylic, 30% Wool",
      "Length": "180 cm",
      "Width": "30 cm",
      "Care": "Hand wash recommended",
      "Collection": "Premium Quality",
      "SKU": 'HM-SCARF-001'
    },
    collection: 'Premium Quality',
    gender: 'Unisex'
  },
  {
    id: 16,
    name: 'H&M Logo Cap',
    brand: 'H&M',
    category: 'Accessories',
    productType: 'Hats',
    price: 699,
    discount: 30,
    originalPrice: 999,
    image: 'https://image.hm.com/assets/hm/c3/29/c329a97f49b6a0de0ff6bdd6cdf81acfda225bef.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/c3/29/c329a97f49b6a0de0ff6bdd6cdf81acfda225bef.jpg?imwidth=2160',
      'https://www.fashiola.in/product-list/118883557.webp',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeE8WEeAni9fxGhDaIerJA0nrCCXWkLwMm00p9IIgIXUl8giRdYTTBlADK6rEAIEWOQhY&usqp=CAU'
    ],
    description: 'Classic baseball cap with H&M logo embroidery and adjustable strap.',
    rating: 4.3,
    reviews: 567,
    isNew: true,
    colour: 'Black',
    size: 'Adjustable',
    stock: 256,
    features: [
      'Cotton twill fabric',
      'Embroidered logo',
      'Adjustable strap',
      'Curved brim',
      'Unisex design'
    ],
    specifications: {
      "Material": "100% Cotton Twill",
      "Closure": "Adjustable Strap",
      "Brim": "Curved",
      "Care": "Hand wash",
      "Collection": "Divided",
      "SKU": 'HM-CAP-001'
    },
    collection: 'Divided',
    gender: 'Unisex'
  },
  
  // Shoes
  {
    id: 17,
    name: 'H&M Platform Sneakers',
    brand: 'H&M',
    category: 'Shoes',
    productType: 'Sneakers',
    price: 2999,
    discount: 40,
    originalPrice: 4998,
    image: 'https://image.hm.com/assets/hm/fb/8d/fb8d78018ef31d1891a4e96c7ad7b0bb80348db8.jpg?imwidth=1260',
    images: [
      'https://image.hm.com/assets/hm/fb/8d/fb8d78018ef31d1891a4e96c7ad7b0bb80348db8.jpg?imwidth=1260',
    ],
    description: 'Chunky platform sneakers with rubber sole and lace-up closure.',
    rating: 4.5,
    reviews: 432,
    isNew: true,
    colour: 'White',
    size: 'US 7',
    stock: 98,
    features: [
      'Platform sole',
      'Rubber outsole',
      'Lace-up closure',
      'Textile upper',
      'Padded collar'
    ],
    specifications: {
      "Material": "Textile Upper, Rubber Sole",
      "Sole": "Platform",
      "Closure": "Lace-up",
      "Care": "Wipe clean",
      "Collection": "Divided",
      "SKU": 'HM-SNEAKERS-001'
    },
    collection: 'Divided',
    gender: 'Women'
  },
  {
    id: 18,
    name: 'H&M Loafers',
    brand: 'H&M',
    category: 'Shoes',
    productType: 'Loafers',
    price: 2499,
    discount: 35,
    originalPrice: 3845,
    image: 'https://image.hm.com/assets/hm/b9/d7/b9d794884005be363a364a8f11f5fcae32709430.jpg?imwidth=786',
    images: [
      'https://image.hm.com/assets/hm/b9/d7/b9d794884005be363a364a8f11f5fcae32709430.jpg?imwidth=786',
      'https://image.hm.com/assets/hm/26/58/2658a6658f368d180a6c49d5d8219f2846cac692.jpg',
      'https://image.hm.com/assets/hm/8c/dc/8cdc7c973589c5f1fe9b4ab74b62377dc804d212.jpg?imwidth=2160'
    ],
    description: 'Classic loafers with horsebit detailing and comfortable fit.',
    rating: 4.4,
    reviews: 234,
    isNew: false,
    colour: 'Black',
    size: 'US 9',
    stock: 76,
    features: [
      'Synthetic leather upper',
      'Horsebit detailing',
      'Slip-on style',
      'Rubber sole',
      'Cushioned insole'
    ],
    specifications: {
      "Material": "Synthetic Leather",
      "Style": "Loafer",
      "Closure": "Slip-on",
      "Care": "Wipe clean",
      "Collection": "Premium Quality",
      "SKU": 'HM-LOAFERS-001'
    },
    collection: 'Premium Quality',
    gender: 'Men'
  },
  
  // Home
  {
    id: 19,
    name: 'H&M Home Cotton Duvet Cover',
    brand: 'H&M',
    category: 'Home',
    productType: 'Bedding',
    price: 3999,
    discount: 30,
    originalPrice: 5714,
    image: 'https://image.hm.com/assets/hm/34/60/34600f943a900faec285ce4b9140f151d56d7bda.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/34/60/34600f943a900faec285ce4b9140f151d56d7bda.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/f2/9e/f29eb44dc14c30940a3039c27149d6c2515aebd8.jpg?imwidth=2160',
      'http://image.hm.com/assets/hm/84/7d/847d1d3b0446327e5f8b8c8111f014f1bb2419db.jpg?imwidth=2160'
    ],
    description: 'Soft cotton duvet cover with simple striped pattern for bedroom.',
    rating: 4.7,
    reviews: 189,
    isNew: true,
    colour: 'White/Blue',
    size: 'Double',
    stock: 67,
    features: [
      '100% cotton',
      'Striped pattern',
      'Button closure',
      'Includes pillowcases',
      'Machine washable'
    ],
    specifications: {
      "Material": "100% Cotton",
      "Size": "Double (200 x 200 cm)",
      "Includes": "1 Duvet Cover + 2 Pillowcases",
      "Care": "Machine wash at 60°C",
      "Collection": "H&M Home",
      "SKU": 'HM-DUVET-001'
    },
    collection: 'H&M Home',
    gender: 'Unisex'
  },
  {
    id: 20,
    name: 'H&M Home Ceramic Mug Set',
    brand: 'H&M',
    category: 'Home',
    productType: 'Tableware',
    price: 1299,
    discount: 40,
    originalPrice: 2165,
    image: 'https://image.hm.com/assets/hm/1c/46/1c4665c36c8bc2399f5d0f9d38a804d7a7366d25.jpg',
    images: [
      'https://image.hm.com/assets/hm/1c/46/1c4665c36c8bc2399f5d0f9d38a804d7a7366d25.jpg',
      'https://image.hm.com/assets/hm/30/31/30319f20f64dd3163d0129cfc61073e862ef0067.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/33/1a/331ab9a52c59c95058c73b2051142bc6ea183dc9.jpg?imwidth=2160'
    ],
    description: 'Set of 4 ceramic mugs with minimalist design for daily use.',
    rating: 4.8,
    reviews: 156,
    isNew: true,
    colour: 'White',
    size: 'Set of 4',
    stock: 123,
    features: [
      'Ceramic material',
      'Minimalist design',
      'Set of 4 mugs',
      'Dishwasher safe',
      'Microwave safe'
    ],
    specifications: {
      "Material": "Ceramic",
      "Capacity": "350 ml each",
      "Set": "4 Pieces",
      "Care": "Dishwasher & Microwave Safe",
      "Collection": "H&M Home",
      "SKU": 'HM-MUGS-001'
    },
    collection: 'H&M Home',
    gender: 'Unisex'
  },
  {
    id: 21,
    name: 'H&M Home Velvet Cushion Cover',
    brand: 'H&M',
    category: 'Home',
    productType: 'Cushions',
    price: 899,
    discount: 35,
    originalPrice: 1383,
    image: 'https://image.hm.com/assets/hm/97/76/9776a827da19213b5ddedf4f542b1bd23dec714b.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/97/76/9776a827da19213b5ddedf4f542b1bd23dec714b.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/d8/d0/d8d064b180757777456a140a8425db4b432bf802.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/98/de/98de9f1e4cf1468916731e0026a7bd3d111fe705.jpg'
    ],
    description: 'Luxurious velvet cushion cover with zip closure for sofa styling.',
    rating: 4.6,
    reviews: 98,
    isNew: false,
    colour: 'Emerald Green',
    size: '45 x 45 cm',
    stock: 89,
    features: [
      'Velvet fabric',
      'Zip closure',
      'Square shape',
      'Luxurious feel',
      'Easy to clean'
    ],
    specifications: {
      "Material": "100% Polyester Velvet",
      "Size": "45 x 45 cm",
      "Closure": "Hidden Zip",
      "Care": "Machine wash at 40°C",
      "Collection": "H&M Home",
      "SKU": 'HM-CUSHION-001'
    },
    collection: 'H&M Home',
    gender: 'Unisex'
  },
  
  // Beauty
  {
    id: 22,
    name: 'H&M Beauty Lipstick Set',
    brand: 'H&M',
    category: 'Beauty',
    productType: 'Makeup',
    price: 1499,
    discount: 25,
    originalPrice: 1999,
    image: 'https://image.hm.com/assets/hm/01/8a/018aa853836dd8d66dbecdf3cbc360eb43f0dd39.jpg?imwidth=786',
    images: [
      'https://image.hm.com/assets/hm/01/8a/018aa853836dd8d66dbecdf3cbc360eb43f0dd39.jpg?imwidth=786',
      'https://image.hm.com/assets/hm/e3/32/e33278b2b5bd9c9a30c13438fbea787f1951d349.jpg?imwidth=1260',
    ],
    description: 'Set of 3 cream lipsticks in wearable shades for everyday makeup.',
    rating: 4.5,
    reviews: 234,
    isNew: true,
    colour: 'Nude/Pink/Red',
    size: '3.5g each',
    stock: 156,
    features: [
      'Creamy formula',
      'Set of 3 shades',
      'Long-wearing',
      'Moisturizing',
      'Vegan formula'
    ],
    specifications: {
      "Formula": "Cream",
      "Set": "3 Lipsticks",
      "Weight": "3.5g each",
      "Features": "Vegan, Cruelty-free",
      "Collection": "H&M Beauty",
      "SKU": 'HM-LIPSTICK-001'
    },
    collection: 'H&M Beauty',
    gender: 'Women'
  },
  {
    id: 23,
    name: 'H&M Beauty Nail Polish Collection',
    brand: 'H&M',
    category: 'Beauty',
    productType: 'Makeup',
    price: 799,
    discount: 30,
    originalPrice: 1141,
    image: 'https://image.hm.com/assets/hm/96/20/9620e6f035067932e656e0194531f2e7a15e90c3.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/96/20/9620e6f035067932e656e0194531f2e7a15e90c3.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/9d/5c/9d5c674f74c95709005ed67a347c70bc31b4e68f.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/bf/e4/bfe4dc46c6e4201311bb3aaed3ac90a59feb1384.jpg?imwidth=2160'
    ],
    description: 'Set of 5 nail polishes in trending colors with glossy finish.',
    rating: 4.4,
    reviews: 189,
    isNew: false,
    colour: 'Various',
    size: '10 ml each',
    stock: 198,
    features: [
      'Set of 5 colors',
      'Glossy finish',
      'Quick drying',
      'Chip-resistant',
      '7-free formula'
    ],
    specifications: {
      "Formula": "7-Free",
      "Set": "5 Nail Polishes",
      "Volume": "10 ml each",
      "Finish": "Glossy",
      "Collection": "H&M Beauty",
      "SKU": 'HM-NAIL-POLISH-001'
    },
    collection: 'H&M Beauty',
    gender: 'Women'
  },
  
  // Sustainable Collection
  {
    id: 24,
    name: 'H&M Conscious Recycled Denim Jeans',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Jeans',
    price: 3499,
    discount: 20,
    originalPrice: 4374,
    image: 'https://image.hm.com/assets/hm/3a/dc/3adc6f51d198e3dd9f94f2584efcd3015b726c5d.jpg?imwidth=2160',
    images: [
      'https://image.hm.com/assets/hm/3a/dc/3adc6f51d198e3dd9f94f2584efcd3015b726c5d.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/08/c1/08c1935fb210f3e4d918f5164ecc4f65eb72aa2f.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/bb/ef/bbefb82df7ae151b1b6dab79059fb01932217f1e.jpg?imwidth=2160'
    ],
    description: 'Sustainable jeans made from recycled denim with slim fit and stretch.',
    rating: 4.8,
    reviews: 456,
    isNew: true,
    colour: 'Dark Blue',
    size: '30W x 32L',
    stock: 67,
    features: [
      'Made from recycled denim',
      'Slim fit',
      'Stretch comfort',
      'Sustainable production',
      'Conscious choice'
    ],
    specifications: {
      "Material": "Recycled Denim with Elastane",
      "Fit": "Slim",
      "Sustainability": "Made from Recycled Materials",
      "Care": "Machine wash at 30°C",
      "Collection": "Conscious",
      "SKU": 'HM-CONSCIOUS-JEANS-001'
    },
    collection: 'Conscious',
    gender: 'Men'
  },
  {
    id: 25,
    name: 'H&M Conscious Organic Cotton Sweatshirt',
    brand: 'H&M',
    category: 'Clothing',
    productType: 'Sweatshirts',
    price: 1999,
    discount: 35,
    originalPrice: 3077,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmhzRku781S-cYWT8-f1cP1HV0boCqPvaIyw&s',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmhzRku781S-cYWT8-f1cP1HV0boCqPvaIyw&s',
      'https://image.hm.com/assets/hm/89/2e/892ea28563fa57670eaf6a1b51ac5dfebd23fff5.jpg?imwidth=2160',
      'https://image.hm.com/assets/hm/9a/be/9abeb82da6d07aff48067bcd5d1d20cbc3e8c54d.jpg'
    ],
    description: 'Cozy sweatshirt made from 100% organic cotton with ribbed details.',
    rating: 4.7,
    reviews: 321,
    isNew: true,
    colour: 'Heather Grey',
    size: 'L',
    stock: 123,
    features: [
      '100% organic cotton',
      'Ribbed collar and cuffs',
      'Relaxed fit',
      'Sustainable material',
      'Comfortable wear'
    ],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Relaxed",
      "Sustainability": "Organic Cotton",
      "Care": "Machine wash at 30°C",
      "Collection": "Conscious",
      "SKU": 'HM-CONSCIOUS-SWEATSHIRT-001'
    },
    collection: 'Conscious',
    gender: 'Unisex'
  }
];