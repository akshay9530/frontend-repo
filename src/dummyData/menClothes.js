// src/data/menClothes.js
export const menClothes = [
  // Formal Shirts
  {
    id: 1,
    name: 'Classic Oxford Shirt',
    brand: 'Levi\'s',
    category: 'Shirts',
    productType: 'Formal Shirt',
    price: 2499,
    discount: 25,
    originalPrice: 3332,
    image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=900&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=900&q=80',
      'https://image.hm.com/assets/hm/8f/31/8f31f90f9e907e1646bd216bc68bd1fa618c48ed.jpg?imwidth=1260'
    ],
    description: 'Premium cotton Oxford shirt with classic fit and button-down collar for professional occasions.',
    rating: 4.7,
    reviews: 189,
    isNew: true,
    colour: 'White',
    size: 'M',
    stock: 45,
    features: [
      '100% Premium Cotton Oxford',
      'Button-down Collar',
      'Single Needle Stitching',
      'Chest Pocket',
      'Long Sleeves with Button Cuffs'
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Classic Fit",
      "Collar": "Button-down",
      "Care": "Machine Washable",
      "Occasion": "Formal & Business",
      "Season": "All Year",
      "SKU": 'MC-LS-OXFORD-001'
    }
  },
  {
    id: 2,
    name: 'Slim Fit Linen Shirt',
    brand: 'H&M',
    category: 'Shirts',
    productType: 'Casual Shirt',
    price: 2299,
    discount: 30,
    originalPrice: 3284,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80'
    ],
    description: 'Breathable linen shirt with slim fit and modern cut for summer casual wear.',
    rating: 4.6,
    reviews: 234,
    isNew: true,
    colour: 'Navy Blue',
    size: 'L',
    stock: 52,
    features: [
      '100% Pure Linen',
      'Slim Fit Design',
      'Button Front',
      'Chest Pocket',
      'Curved Hem'
    ],
    specifications: {
      "Material": "100% Linen",
      "Fit": "Slim Fit",
      "Collar": "Point Collar",
      "Care": "Machine Wash Gentle",
      "Season": "Summer",
      "SKU": 'MC-HM-LINEN-001'
    }
  },
  
  // T-Shirts
  {
    id: 3,
    name: 'Premium Cotton T-Shirt',
    brand: 'Levi\'s',
    category: 'T-Shirts',
    productType: 'Basic Tee',
    price: 1299,
    discount: 35,
    originalPrice: 1998,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80'
    ],
    description: 'Soft premium cotton t-shirt with regular fit and ribbed crew neck for everyday comfort.',
    rating: 4.5,
    reviews: 456,
    isNew: false,
    colour: 'Black',
    size: 'XL',
    stock: 85,
    features: [
      '100% Organic Cotton',
      'Regular Fit',
      'Ribbed Crew Neck',
      'Pre-shrunk Fabric',
      'Double-stitched Hem'
    ],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Regular Fit",
      "Neck": "Crew Neck",
      "Care": "Machine Wash",
      "Style": "Casual",
      "SKU": 'MC-LS-TSHIRT-001'
    }
  },
  {
    id: 4,
    name: 'Performance Polo Shirt',
    brand: 'Nike',
    category: 'T-Shirts',
    productType: 'Polo Shirt',
    price: 2499,
    discount: 25,
    originalPrice: 3332,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80'
    ],
    description: 'Moisture-wicking polo shirt with Dri-FIT technology and modern fit for active lifestyle.',
    rating: 4.7,
    reviews: 312,
    isNew: true,
    colour: 'Grey',
    size: 'L',
    stock: 62,
    features: [
      'Dri-FIT Technology',
      'Moisture-wicking Fabric',
      '3-button Placket',
      'Ribbed Collar and Cuffs',
      'UV Protection UPF 30+'
    ],
    specifications: {
      "Material": "100% Polyester",
      "Fit": "Modern Fit",
      "Technology": "Dri-FIT",
      "Care": "Machine Wash",
      "Activity": "Sports & Casual",
      "SKU": 'MC-NIKE-POLO-001'
    }
  },
  
  // Jeans
  {
    id: 5,
    name: 'Slim Fit Stretch Jeans',
    brand: 'Levi\'s',
    category: 'Jeans',
    productType: 'Denim Jeans',
    price: 4299,
    discount: 20,
    originalPrice: 5374,
    image: 'https://levi.in/cdn/shop/files/182981393_02_Front_cf51fd0b-7e14-4999-b87a-84b91cceb5cc.jpg?v=1740488432',
    images: [
      'https://levi.in/cdn/shop/files/182981393_02_Front_cf51fd0b-7e14-4999-b87a-84b91cceb5cc.jpg?v=1740488432',
      'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/325446s.jpg?im=Resize,width=750'
    ],
    description: 'Slim fit jeans with stretch denim for comfort and mobility, featuring dark wash finish.',
    rating: 4.8,
    reviews: 523,
    isNew: false,
    colour: 'Dark Blue',
    size: '32',
    stock: 67,
    features: [
      'Stretch Denim (2% Elastane)',
      'Slim Fit Throughout',
      'Dark Wash Finish',
      'Five Pocket Design',
      'Button Fly'
    ],
    specifications: {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Slim Fit",
      "Rise": "Mid Rise",
      "Wash": "Dark Wash",
      "Care": "Machine Wash Inside Out",
      "Style": "Casual",
      "SKU": 'MC-LS-JEANS-001'
    }
  },
  {
    id: 6,
    name: 'Relaxed Fit Jeans',
    brand: 'H&M',
    category: 'Jeans',
    productType: 'Casual Jeans',
    price: 2999,
    discount: 30,
    originalPrice: 4284,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/31661011/2024/12/7/ec3706cc-53a6-4579-8d03-847be08905321733545069444-DENIMLOOK-Men-Relaxed-Fit-Mid-Rise-Baggy-Stretchable-Jeans-5-1.jpg',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/31661011/2024/12/7/ec3706cc-53a6-4579-8d03-847be08905321733545069444-DENIMLOOK-Men-Relaxed-Fit-Mid-Rise-Baggy-Stretchable-Jeans-5-1.jpg',
      'https://rukminim2.flixcart.com/image/480/640/xif0q/jean/p/g/m/30-t-baggy-dark-blue-tidda-original-imah3ztw5ngr78hf.jpeg?q=90'
    ],
    description: 'Comfortable relaxed fit jeans with vintage wash for casual everyday wear.',
    rating: 4.4,
    reviews: 287,
    isNew: true,
    colour: 'Light Blue',
    size: '34',
    stock: 58,
    features: [
      '100% Cotton Denim',
      'Relaxed Fit',
      'Vintage Stonewash',
      'Straight Leg',
      'Zipper Fly'
    ],
    specifications: {
      "Material": "100% Cotton Denim",
      "Fit": "Relaxed Fit",
      "Rise": "Regular Rise",
      "Wash": "Vintage Stonewash",
      "Care": "Machine Wash",
      "Style": "Casual & Vintage",
      "SKU": 'MC-HM-JEANS-001'
    }
  },
  
  // Pants & Trousers
  {
    id: 7,
    name: 'Slim Fit Chinos',
    brand: 'H&M',
    category: 'Pants',
    productType: 'Chinos',
    price: 2299,
    discount: 25,
    originalPrice: 3065,
    image: 'https://cdn.muftijeans.in/media/catalog/product/1/_/1_mft-17264-r-89-stone_6.jpg',
    images: [
      'https://cdn.muftijeans.in/media/catalog/product/1/_/1_mft-17264-r-89-stone_6.jpg',
      'https://levi.in/cdn/shop/files/a82880010_1.jpg?v=1736237196'
    ],
    description: 'Modern slim fit chinos with stretch cotton blend for all-day comfort and style.',
    rating: 4.6,
    reviews: 412,
    isNew: true,
    colour: 'Khaki',
    size: '32',
    stock: 73,
    features: [
      'Stretch Cotton Blend',
      'Slim Fit Design',
      'Flat Front',
      'Zip Fly with Button',
      'Four Pocket Style'
    ],
    specifications: {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Slim Fit",
      "Closure": "Zip Fly with Button",
      "Pockets": "2 Front, 2 Back",
      "Care": "Machine Wash Cold",
      "Occasion": "Smart Casual",
      "SKU": 'MC-HM-CHINOS-001'
    }
  },
  {
    id: 8,
    name: 'Formal Dress Pants',
    brand: 'H&M',
    category: 'Pants',
    productType: 'Dress Pants',
    price: 3299,
    discount: 20,
    originalPrice: 4124,
    image: 'https://m.media-amazon.com/images/I/616evE3EBIL._AC_UY1100_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/616evE3EBIL._AC_UY1100_.jpg',
      'https://images.meesho.com/images/products/142481028/0hhnj_512.webp?width=512'
    ],
    description: 'Classic dress pants with sharp crease and comfortable stretch fabric for formal occasions.',
    rating: 4.7,
    reviews: 198,
    isNew: true,
    colour: 'Charcoal Grey',
    size: '34',
    stock: 48,
    features: [
      'Wool Blend Fabric',
      'Slim Fit',
      'Flat Front Design',
      'Sharp Crease',
      'Hook & Bar Closure'
    ],
    specifications: {
      "Material": "85% Wool, 15% Polyester",
      "Fit": "Slim Fit",
      "Rise": "Mid Rise",
      "Care": "Dry Clean Recommended",
      "Occasion": "Formal & Business",
      "SKU": 'MC-HM-DRESSPANTS-001'
    }
  },
  
  // Jackets & Outerwear
  {
    id: 9,
    name: 'Classic Denim Jacket',
    brand: 'Levi\'s',
    category: 'Jackets',
    productType: 'Denim Jacket',
    price: 5299,
    discount: 25,
    originalPrice: 7065,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/AUGUST/26/BHJl4B3I_58a14c04f49747e68de89b722f79bf14.jpg',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/AUGUST/26/BHJl4B3I_58a14c04f49747e68de89b722f79bf14.jpg',
      'https://images-cdn.ubuy.co.in/66bbb687c17df141bf68d3c6-lzler-casual-jean-jacket-for-men-ripped.jpg',
      'https://cdn.shopify.com/s/files/1/0755/9518/6453/files/Denim_Jacket_480x480.webp?v=1718174321'
    ],
    description: 'Classic denim jacket with vintage wash and comfortable regular fit for timeless style.',
    rating: 4.9,
    reviews: 345,
    isNew: true,
    colour: 'Mid Blue',
    size: 'L',
    stock: 42,
    features: [
      '100% Cotton Denim',
      'Vintage Stonewash',
      'Button Front Closure',
      'Chest Pockets',
      'Ribbed Cuffs'
    ],
    specifications: {
      "Material": "100% Cotton Denim",
      "Fit": "Regular Fit",
      "Wash": "Vintage Stonewash",
      "Care": "Machine Wash Separately",
      "Style": "Casual & Streetwear",
      "SKU": 'MC-LS-JACKET-001'
    }
  },
  {
    id: 10,
    name: 'Lightweight Bomber Jacket',
    brand: 'H&M',
    category: 'Jackets',
    productType: 'Bomber Jacket',
    price: 3999,
    discount: 30,
    originalPrice: 5714,
    image: 'https://images-cdn.ubuy.co.in/6538f0a51062e542922d4d5a-winter-jackets-for-men-men-39-s.jpg',
    images: [
      'https://images-cdn.ubuy.co.in/6538f0a51062e542922d4d5a-winter-jackets-for-men-men-39-s.jpg',
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/31534147/2025/7/19/445ea7c6-de57-4905-ad32-e792da3cf0a31752929304718-Dollar-Men-Lightweight-Bomber-Jacket-4171752929304320-1.jpg'
    ],
    description: 'Lightweight bomber jacket with ribbed cuffs and hem for casual spring and fall wear.',
    rating: 4.6,
    reviews: 231,
    isNew: true,
    colour: 'Olive Green',
    size: 'M',
    stock: 36,
    features: [
      'Nylon Shell',
      'Quilted Lining',
      'Ribbed Cuffs and Hem',
      'Zipper Front',
      'Side Pockets'
    ],
    specifications: {
      "Material": "100% Nylon",
      "Fit": "Regular Fit",
      "Lining": "Polyester Quilted",
      "Care": "Machine Wash Cold",
      "Season": "Spring & Fall",
      "SKU": 'MC-HM-BOMBER-001'
    }
  },
  
  // Sweaters & Hoodies
  {
    id: 11,
    name: 'Merino Wool Sweater',
    brand: 'H&M',
    category: 'Sweaters',
    productType: 'Wool Sweater',
    price: 3799,
    discount: 25,
    originalPrice: 5065,
    image: 'https://m.media-amazon.com/images/I/71os82tkfmL._AC_UY1100_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/71os82tkfmL._AC_UY1100_.jpg',
      'https://bobbyjones.com/cdn/shop/products/BJ472030_015.jpg?v=1659980692'
    ],
    description: 'Warm merino wool sweater with crew neck design and ribbed trim for cold weather.',
    rating: 4.7,
    reviews: 187,
    isNew: true,
    colour: 'Navy Blue',
    size: 'L',
    stock: 54,
    features: [
      '100% Merino Wool',
      'Crew Neck Design',
      'Ribbed Cuffs and Hem',
      'Soft Touch Fabric',
      'Regular Fit'
    ],
    specifications: {
      "Material": "100% Merino Wool",
      "Fit": "Regular Fit",
      "Weight": "Medium Weight",
      "Care": "Hand Wash Cold",
      "Season": "Winter",
      "SKU": 'MC-HM-WOOLSWEATER-001'
    }
  },
  {
    id: 12,
    name: 'Tech Fleece Hoodie',
    brand: 'Nike',
    category: 'Hoodies',
    productType: 'Fleece Hoodie',
    price: 5299,
    discount: 20,
    originalPrice: 6624,
    image: 'https://www.dtlr.com/cdn/shop/files/nike_HV0949_20063_M-045.jpg?v=1731109726',
    images: [
      'https://www.dtlr.com/cdn/shop/files/nike_HV0949_20063_M-045.jpg?v=1731109726',
      'https://www.dtlr.com/cdn/shop/files/HV0949-277.jpg?v=1751476743'
    ],
    description: 'Lightweight tech fleece hoodie with modern fit and thermal insulation for active lifestyle.',
    rating: 4.8,
    reviews: 423,
    isNew: true,
    colour: 'Black',
    size: 'XL',
    stock: 67,
    features: [
      'Tech Fleece Fabric',
      'Kangaroo Pocket',
      'Adjustable Hood',
      'Ribbed Cuffs and Hem',
      'Modern Fit'
    ],
    specifications: {
      "Material": "Cotton-Polyester Blend",
      "Fit": "Modern Fit",
      "Insulation": "Lightweight Thermal",
      "Care": "Machine Wash",
      "Style": "Athleisure",
      "SKU": 'MC-NIKE-HOODIE-001'
    }
  },
  
  // Activewear
  {
    id: 13,
    name: 'Running Shorts',
    brand: 'Adidas',
    category: 'Shorts',
    productType: 'Sports Shorts',
    price: 1999,
    discount: 35,
    originalPrice: 3075,
    image: 'https://m.media-amazon.com/images/I/81JIeM5g0RL._AC_UY1100_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/81JIeM5g0RL._AC_UY1100_.jpg',
      'https://m.media-amazon.com/images/I/71CkqDbJtWL._AC_SL1500_.jpg'
    ],
    description: 'Lightweight running shorts with moisture management and side pockets for active training.',
    rating: 4.6,
    reviews: 278,
    isNew: true,
    colour: 'Dark Grey',
    size: 'M',
    stock: 89,
    features: [
      'ClimaCool Technology',
      'Moisture-wicking Fabric',
      'Elastic Waistband with Drawstring',
      'Side Zipper Pocket',
      '7-inch Inseam'
    ],
    specifications: {
      "Material": "100% Polyester",
      "Fit": "Regular Fit",
      "Length": "7-inch Inseam",
      "Care": "Machine Wash",
      "Activity": "Running & Training",
      "SKU": 'MC-ADIDAS-SHORTS-001'
    }
  },
  {
    id: 14,
    name: 'Training Joggers',
    brand: 'Nike',
    category: 'Pants',
    productType: 'Joggers',
    price: 3499,
    discount: 25,
    originalPrice: 4665,
    image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/MARCH/19/dHn9kW9D_d583cfa19fa94ba8b96e94ecb6089f3c.jpg',
    images: [
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/MARCH/19/dHn9kW9D_d583cfa19fa94ba8b96e94ecb6089f3c.jpg',
      'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1738873116-mhl-joggers-under-armour-649-67a51915e8839.jpg?crop=0.5xw:1xh;center,top&resize=980:*'
    ],
    description: 'Sporty joggers with tapered fit and elastic ankle cuffs for training and casual wear.',
    rating: 4.7,
    reviews: 312,
    isNew: true,
    colour: 'Charcoal',
    size: 'L',
    stock: 76,
    features: [
      'Tapered Fit',
      'Elastic Ankle Cuffs',
      'Drawstring Waist',
      'Side Pockets',
      'Dri-FIT Technology'
    ],
    specifications: {
      "Material": "Cotton-Polyester Blend",
      "Fit": "Tapered Fit",
      "Closure": "Elastic with Drawstring",
      "Care": "Machine Wash",
      "Activity": "Training & Casual",
      "SKU": 'MC-NIKE-JOGGERS-001'
    }
  },
  
  // Formal Wear
  {
    id: 15,
    name: 'Tailored Wool Blazer',
    brand: 'H&M',
    category: 'Blazers',
    productType: 'Formal Blazer',
    price: 7999,
    discount: 30,
    originalPrice: 11428,
    image: 'https://www.selectedhomme.in/cdn/shop/files/120824502_gFront_e8fbc18d-c5f2-4c35-92ca-0bdc24fc04f0.jpg?v=1757669504&width=1080',
    images: [
      'https://www.selectedhomme.in/cdn/shop/files/120824502_gFront_e8fbc18d-c5f2-4c35-92ca-0bdc24fc04f0.jpg?v=1757669504&width=1080',
      'https://www.richlook.in/cdn/shop/files/R198163_1_a277cdb4-a6cb-4437-9ec4-4e0516af8486.jpg?v=1754917707'
    ],
    description: 'Modern tailored blazer with wool blend fabric and notch lapel for sophisticated occasions.',
    rating: 4.8,
    reviews: 134,
    isNew: true,
    colour: 'Navy Blue',
    size: '40',
    stock: 28,
    features: [
      'Wool Blend Fabric',
      'Notch Lapel',
      'Single Back Vent',
      'Functional Buttons',
      'Inner Pocket'
    ],
    specifications: {
      "Material": "70% Wool, 30% Polyester",
      "Fit": "Tailored Fit",
      "Lining": "Polyester",
      "Care": "Dry Clean Only",
      "Occasion": "Formal & Business",
      "SKU": 'MC-HM-BLAZER-001'
    }
  },
  
  // Casual Wear
  {
    id: 16,
    name: 'Casual Button-up Shirt',
    brand: 'Levi\'s',
    category: 'Shirts',
    productType: 'Casual Shirt',
    price: 2699,
    discount: 20,
    originalPrice: 3374,
    image: 'https://cdn.shopify.com/s/files/1/0981/8178/files/Spread-collar-casual-shirt.jpg?525',
    images: [
      'https://cdn.shopify.com/s/files/1/0981/8178/files/Spread-collar-casual-shirt.jpg?525',
      'https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/d/0/d01cee8UDSHTO1210_4.jpg?rnd=20200526195200&tr=w-512'
    ],
    description: 'Versatile casual shirt with check pattern and comfortable regular fit for smart casual occasions.',
    rating: 4.5,
    reviews: 245,
    isNew: false,
    colour: 'Blue Check',
    size: 'M',
    stock: 62,
    features: [
      '100% Cotton',
      'Check Pattern',
      'Button-down Collar',
      'Curved Hem',
      'Chest Pocket'
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular Fit",
      "Pattern": "Check",
      "Care": "Machine Wash",
      "Occasion": "Smart Casual",
      "SKU": 'MC-LS-CHECKSHIRT-001'
    }
  },
  
  // Winter Wear
  {
    id: 17,
    name: 'Puffer Jacket',
    brand: 'Adidas',
    category: 'Jackets',
    productType: 'Winter Jacket',
    price: 6999,
    discount: 25,
    originalPrice: 9332,
    image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2024/NOVEMBER/29/zXLpNsqf_3f504d6f9417410fa4514887cf9e2f43.jpg',
    images: [
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2024/NOVEMBER/29/zXLpNsqf_3f504d6f9417410fa4514887cf9e2f43.jpg',
      'https://www.jiomart.com/images/product/original/442253127_navy/men-hooded-puffer-jacket-with-insert-pockets-model-442253127_navy-0-202402171636.jpg?im=Resize=(500,630)'
    ],
    description: 'Warm puffer jacket with synthetic insulation and water-resistant finish for winter.',
    rating: 4.7,
    reviews: 189,
    isNew: true,
    colour: 'Black',
    size: 'XL',
    stock: 34,
    features: [
      'Synthetic Insulation',
      'Water-resistant Finish',
      'Stand-up Collar',
      'Zipper Front',
      'Multiple Pockets'
    ],
    specifications: {
      "Material": "Polyester with Insulation",
      "Fit": "Regular Fit",
      "Insulation": "Synthetic Fill",
      "Care": "Machine Wash Gentle",
      "Season": "Winter",
      "SKU": 'MC-ADIDAS-PUFFER-001'
    }
  },
  
  // Workwear
  {
    id: 18,
    name: 'Cargo Pants',
    brand: 'Levi\'s',
    category: 'Pants',
    productType: 'Cargo Pants',
    price: 3499,
    discount: 20,
    originalPrice: 4374,
    image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/26339960/2023/12/13/ef9632b7-5b34-40d4-b1bc-437734bc0cb11702462355157-Overdyed-Trouser-with-Snap-button--Baggy-Pocket-412170246235-1.jpg',
    images: [
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/26339960/2023/12/13/ef9632b7-5b34-40d4-b1bc-437734bc0cb11702462355157-Overdyed-Trouser-with-Snap-button--Baggy-Pocket-412170246235-1.jpg',
      'https://triprindia.com/cdn/shop/files/1_0f518094-649c-4ab8-8568-6a3363f9a6d8_1.jpg?v=1741074258'
    ],
    description: 'Durable cargo pants with multiple pockets and comfortable fit for work and outdoor activities.',
    rating: 4.6,
    reviews: 156,
    isNew: true,
    colour: 'Olive Green',
    size: '34',
    stock: 58,
    features: [
      'Cotton Twill Fabric',
      'Multiple Cargo Pockets',
      'Elastic Waist with Drawstring',
      'Reinforced Stitching',
      'Durable Construction'
    ],
    specifications: {
      "Material": "100% Cotton Twill",
      "Fit": "Relaxed Fit",
      "Pockets": "8 Total",
      "Care": "Machine Wash",
      "Activity": "Work & Outdoor",
      "SKU": 'MC-LS-CARGO-001'
    }
  },
  
  // Summer Essentials
  {
    id: 19,
    name: 'Linen Shorts',
    brand: 'H&M',
    category: 'Shorts',
    productType: 'Casual Shorts',
    price: 1799,
    discount: 30,
    originalPrice: 2570,
    image: 'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/APRIL/22/3fbQ6PuT_f90dcfae79484afbad257ae5458e1504.jpg',
    images: [
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/APRIL/22/3fbQ6PuT_f90dcfae79484afbad257ae5458e1504.jpg',
      'https://i.etsystatic.com/13008011/r/il/8f8cc9/2002212026/il_570xN.2002212026_ekgd.jpg'
    ],
    description: 'Breathable linen shorts with drawstring waist and relaxed fit for summer casual wear.',
    rating: 4.5,
    reviews: 198,
    isNew: true,
    colour: 'Beige',
    size: '32',
    stock: 72,
    features: [
      '100% Linen',
      'Drawstring Waist',
      'Relaxed Fit',
      'Side Pockets',
      '9-inch Inseam'
    ],
    specifications: {
      "Material": "100% Linen",
      "Fit": "Relaxed Fit",
      "Length": "9-inch Inseam",
      "Care": "Machine Wash Gentle",
      "Season": "Summer",
      "SKU": 'MC-HM-LINENSHORTS-001'
    }
  },
  
  // Lounge & Home Wear
  {
    id: 20,
    name: 'Cotton Lounge Set',
    brand: 'Nike',
    category: 'Sweaters',
    productType: 'Loungewear',
    price: 4299,
    discount: 25,
    originalPrice: 5732,
    image: 'https://cottonworld.net/cdn/shop/files/M-PANTS-17175-21068-GREY_8.jpg?v=1756980281',
    images: [
      'https://cottonworld.net/cdn/shop/files/M-PANTS-17175-21068-GREY_8.jpg?v=1756980281',
      'https://gflock.com/cdn/shop/files/17_625b9f43-404b-4d8f-b11f-4fc9f01c399a_1024x1024.jpg?v=1724262815'
    ],
    description: 'Comfortable cotton lounge set with matching pants for ultimate home relaxation.',
    rating: 4.8,
    reviews: 167,
    isNew: true,
    colour: 'Heather Grey',
    size: 'L',
    stock: 45,
    features: [
      '100% Cotton Fleece',
      'Matching Set',
      'Elastic Waistband',
      'Ribbed Cuffs and Hem',
      'Relaxed Fit'
    ],
    specifications: {
      "Material": "100% Cotton Fleece",
      "Fit": "Relaxed Fit",
      "Style": "Loungewear",
      "Care": "Machine Wash",
      "Season": "All Year",
      "SKU": 'MC-NIKE-LOUNGE-001'
    }
  }
];