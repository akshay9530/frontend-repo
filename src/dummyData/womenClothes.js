const womenClothes = [
  // Summer Dresses Collection
  {
    id: 1,
    name: 'Floral Maxi Dress',
    brand: 'H&M',
    category: 'Dresses',
    productType: 'Maxi Dress',
    price: 3299,
    discount: 30,
    originalPrice: 4713,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/MAY/12/KJ5SZaN8_641049e1919045a3a3f755654fcf3450.jpg',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/MAY/12/KJ5SZaN8_641049e1919045a3a3f755654fcf3450.jpg',
      'https://sassafras.in/cdn/shop/files/SFDRSS1811-6_7f2cce7b-59a3-4997-82de-4fb0e13ee7f0.jpg?v=1757500446',
      'https://m.media-amazon.com/images/I/81mfle5-iGL._AC_UY1100_.jpg'
    ],
    description: 'Beautiful floral maxi dress made from lightweight chiffon fabric, perfect for summer parties and beach vacations.',
    rating: 4.8,
    reviews: 156,
    isNew: true,
    colour: 'Floral Print',
    size: 'M',
    stock: 38,
    features: [
      'Lightweight chiffon fabric',
      'Floral print pattern',
      'V-neck design',
      'Tie waist for adjustable fit',
      'Flowy A-line silhouette'
    ],
    specifications: {
      "Material": "100% Polyester Chiffon",
      "Fit": "Regular Fit",
      "Length": "Maxi Length (120cm)",
      "Care": "Hand Wash Recommended",
      "Occasion": "Party & Wedding",
      "Season": "Spring & Summer",
      "SKU": 'WC-HM-FLORAL-001'
    }
  },
  {
    id: 2,
    name: 'Summer Wrap Dress',
    brand: 'ZARA',
    category: 'Dresses',
    productType: 'Wrap Dress',
    price: 4299,
    discount: 25,
    originalPrice: 5732,
    image: 'https://sepiastories.in/wp-content/uploads/2024/08/WRAP-DRESS6.webp',
    images: [
      'https://sepiastories.in/wp-content/uploads/2024/08/WRAP-DRESS6.webp',
      'https://www.bunastudio.com/cdn/shop/collections/Buna_Evergreen_Angarakha_Wrap_Dress_1.jpg?crop=center&height=1200&v=1706878313&width=1200'
    ],
    description: 'Elegant wrap dress with adjustable tie waist and flattering V-neck design for a sophisticated look.',
    rating: 4.7,
    reviews: 234,
    isNew: true,
    colour: 'Navy Blue',
    size: 'S',
    stock: 52,
    features: [
      'Wrap design for adjustable fit',
      'V-neck with tie closure',
      'Flowy viscose fabric',
      'Knee-length',
      'Perfect for office or parties'
    ],
    specifications: {
      "Material": "100% Viscose",
      "Fit": "Wrap Fit",
      "Length": "Knee Length (85cm)",
      "Care": "Machine Wash Cold",
      "Occasion": "Office & Casual",
      "Season": "All Year",
      "SKU": 'WC-ZARA-WRAP-001'
    }
  },
  
  {
    id: 4,
    name: 'Oversized Cotton T-Shirt',
    brand: 'Levi\'s',
    category: 'Tops',
    productType: 'T-Shirt',
    price: 1499,
    discount: 40,
    originalPrice: 2498,
    image: 'https://www.yourprint.in/new-admin-ajax.php?action=resize_outer_image&cfcache=all&url=med-s3/d-i-o/Tshirts/Women/tshirt_hs_oversized_women_pat_d28_o.jpg&resizeTo=600',
    images: [
      'https://www.yourprint.in/new-admin-ajax.php?action=resize_outer_image&cfcache=all&url=med-s3/d-i-o/Tshirts/Women/tshirt_hs_oversized_women_pat_d28_o.jpg&resizeTo=600',
      'https://m.media-amazon.com/images/I/71eeQuGByEL._AC_UY1100_.jpg'
    ],
    description: 'Comfortable oversized cotton t-shirt with ribbed texture and crew neck design.',
    rating: 4.4,
    reviews: 167,
    isNew: false,
    colour: 'White',
    size: 'L',
    stock: 85,
    features: [
      '100% Organic Cotton',
      'Oversized fit',
      'Ribbed texture',
      'Crew neck',
      'Comfortable for everyday wear'
    ],
    specifications: {
      "Material": "100% Organic Cotton",
      "Fit": "Oversized",
      "Style": "Casual",
      "Care": "Machine Wash",
      "Occasion": "Casual & Home",
      "SKU": 'WC-LEVIS-TSHIRT-001'
    }
  },
  
  // Jeans & Denim
  {
    id: 5,
    name: 'High-Waist Skinny Jeans',
    brand: 'Levi\'s',
    category: 'Jeans',
    productType: 'Skinny Jeans',
    price: 3999,
    discount: 25,
    originalPrice: 5332,
    image: 'https://www.crossjeans.com/cdn/shop/files/P_429_084_cross_jeans_null_1_1445x.jpg?v=1712169195',
    images: [
      'https://www.crossjeans.com/cdn/shop/files/P_429_084_cross_jeans_null_1_1445x.jpg?v=1712169195',
      'https://levi.in/cdn/shop/files/748960048_Side_1.jpg?v=1715682363'
    ],
    description: 'Stretch skinny jeans with high-waist design for comfortable all-day wear and perfect fit.',
    rating: 4.6,
    reviews: 324,
    isNew: false,
    colour: 'Dark Blue',
    size: '28',
    stock: 52,
    features: [
      'High-waist design',
      'Stretch denim (2% elastane)',
      'Skinny fit throughout',
      'Five-pocket style',
      'Modern ankle length'
    ],
    specifications: {
      "Material": "98% Cotton, 2% Elastane",
      "Fit": "Skinny Fit",
      "Rise": "High Rise",
      "Wash": "Dark Wash",
      "Care": "Machine Wash Inside Out",
      "Style": "Casual",
      "SKU": 'WC-LEVIS-JEANS-001'
    }
  },
  {
    id: 6,
    name: 'Mom Fit Jeans',
    brand: 'H&M',
    category: 'Jeans',
    productType: 'Mom Jeans',
    price: 3499,
    discount: 30,
    originalPrice: 4999,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/13526714/2021/4/23/d45a3d4c-520c-47ba-bcf7-3c89b59ededb1619154651719-Chemistry-Women-Jeans-9461619154650318-1.jpg',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/13526714/2021/4/23/d45a3d4c-520c-47ba-bcf7-3c89b59ededb1619154651719-Chemistry-Women-Jeans-9461619154650318-1.jpg',
      'https://www.jiomart.com/images/product/original/441776600_mediumblue/heavily-washed-invert-pleated-mom-fit-jeans-model-441776600_mediumblue-0-202305261726.jpg?im=Resize=(500,630)'
    ],
    description: 'Vintage-inspired mom jeans with high waist and relaxed fit through the thigh.',
    rating: 4.5,
    reviews: 198,
    isNew: true,
    colour: 'Light Blue',
    size: '30',
    stock: 45,
    features: [
      'High-waist mom fit',
      'Vintage stonewash',
      'Relaxed through thigh',
      'Straight leg',
      'Authentic five-pocket design'
    ],
    specifications: {
      "Material": "100% Cotton Denim",
      "Fit": "Mom Fit",
      "Rise": "High Rise",
      "Wash": "Vintage Stonewash",
      "Care": "Machine Wash",
      "Style": "Vintage & Casual",
      "SKU": 'WC-HM-MOMJEANS-001'
    }
  },
  
  // Skirts
  {
    id: 7,
    name: 'Midi Pleated Skirt',
    brand: 'ZARA',
    category: 'Skirts',
    productType: 'Midi Skirt',
    price: 2899,
    discount: 35,
    originalPrice: 4460,
    image: 'https://www.veromoda.in/cdn/shop/files/901366102_g0.jpg?v=1745716273&width=2048',
    images: [
      'https://www.veromoda.in/cdn/shop/files/901366102_g0.jpg?v=1745716273&width=2048',
      'https://cdn.shopify.com/s/files/1/0486/0634/7416/products/pleated_flared_midi_skirt_l1_3.jpg?v=1613130812'
    ],
    description: 'Elegant pleated midi skirt with elastic waistband for comfortable fit and sophisticated look.',
    rating: 4.7,
    reviews: 143,
    isNew: true,
    colour: 'Black',
    size: 'M',
    stock: 62,
    features: [
      'Pleated design',
      'Elastic waistband',
      'Midi length',
      'Flowy fabric',
      'Perfect for office wear'
    ],
    specifications: {
      "Material": "100% Polyester",
      "Fit": "A-line Fit",
      "Length": "Midi Length (70cm)",
      "Care": "Machine Wash",
      "Occasion": "Office & Formal",
      "Season": "All Year",
      "SKU": 'WC-ZARA-SKIRT-001'
    }
  },
  
  // Pants & Trousers
  {
    id: 8,
    name: 'Wide Leg Trousers',
    brand: 'H&M',
    category: 'Pants',
    productType: 'Trousers',
    price: 2799,
    discount: 25,
    originalPrice: 3732,
    image: 'https://levi.in/cdn/shop/files/A82730001_02_StyleShot.jpg?v=1714992590',
    images: [
      'https://levi.in/cdn/shop/files/A82730001_02_StyleShot.jpg?v=1714992590',
      'https://assets.ajio.com/medias/sys_master/root/20240925/wWMz/66f43925260f9c41e8298d66/-473Wx593H-700479441-khaki-MODEL.jpg'
    ],
    description: 'Stylish wide leg trousers with high waist and flowy fabric for a chic office look.',
    rating: 4.6,
    reviews: 89,
    isNew: true,
    colour: 'Olive Green',
    size: 'M',
    stock: 41,
    features: [
      'Wide leg design',
      'High waist',
      'Flowy viscose fabric',
      'Elastic waistband',
      'Professional look'
    ],
    specifications: {
      "Material": "100% Viscose",
      "Fit": "Wide Leg",
      "Rise": "High Rise",
      "Care": "Machine Wash Gentle",
      "Occasion": "Office & Smart Casual",
      "SKU": 'WC-HM-PANTS-001'
    }
  },
  
  // Jackets & Outerwear
  {
    id: 9,
    name: 'Classic Denim Jacket',
    brand: 'Levi\'s',
    category: 'Jackets',
    productType: 'Denim Jacket',
    price: 4499,
    discount: 30,
    originalPrice: 6428,
    image: 'https://spykar.com/cdn/shop/products/04wtEOwzi-WTJFAS2BC014-MID-BLUE-_1.webp?v=1757081124',
    images: [
      'https://spykar.com/cdn/shop/products/04wtEOwzi-WTJFAS2BC014-MID-BLUE-_1.webp?v=1757081124',
      'https://www.missmosa.in/cdn/shop/files/CAC1064B-887B-47A4-AFE9-E0AF3E8ABC94.jpg?v=1749207461&width=450'
    ],
    description: 'Classic denim jacket with cropped fit and vintage wash for timeless style.',
    rating: 4.7,
    reviews: 232,
    isNew: false,
    colour: 'Light Blue',
    size: 'S',
    stock: 36,
    features: [
      'Cropped fit',
      'Vintage stonewash',
      'Button front',
      'Chest pockets',
      'Timeless design'
    ],
    specifications: {
      "Material": "100% Cotton Denim",
      "Fit": "Cropped Fit",
      "Length": "Cropped (60cm)",
      "Care": "Machine Wash",
      "Style": "Casual",
      "Season": "Spring & Fall",
      "SKU": 'WC-LEVIS-JACKET-001'
    }
  },
  {
    id: 10,
    name: 'Trench Coat',
    brand: 'ZARA',
    category: 'Coats',
    productType: 'Trench Coat',
    price: 7999,
    discount: 20,
    originalPrice: 9999,
    image: 'https://media.smart.dhgate.com/wp-content/uploads/2025/09/71jgUw7dyAL._UY1000_-3.jpg',
    images: [
      'https://media.smart.dhgate.com/wp-content/uploads/2025/09/71jgUw7dyAL._UY1000_-3.jpg',
      'https://d1pdzcnm6xgxlz.cloudfront.net/tops/8445866855098-9.jpg'
    ],
    description: 'Classic trench coat with belt and water-resistant finish for all seasons.',
    rating: 4.8,
    reviews: 156,
    isNew: true,
    colour: 'Beige',
    size: 'M',
    stock: 24,
    features: [
      'Water-resistant fabric',
      'Belted waist',
      'Double-breasted',
      'Functional pockets',
      'Classic collar'
    ],
    specifications: {
      "Material": "100% Cotton Gabardine",
      "Fit": "Regular Fit",
      "Length": "Knee Length (110cm)",
      "Care": "Dry Clean Only",
      "Season": "All Year",
      "SKU": 'WC-ZARA-TRENCH-001'
    }
  },
  
  // Sweaters & Knitwear
  {
    id: 11,
    name: 'Cashmere Sweater',
    brand: 'H&M',
    category: 'Sweaters',
    productType: 'Pullover',
    price: 5499,
    discount: 15,
    originalPrice: 6469,
    image: 'https://naadam.co/cdn/shop/files/The_Original_Cashmere_Crewneck_Sweater_Women_s__CO_White__CO__058_800x.jpg?v=1762889232',
    images: [
      'https://naadam.co/cdn/shop/files/The_Original_Cashmere_Crewneck_Sweater_Women_s__CO_White__CO__058_800x.jpg?v=1762889232',
      'https://content.purecollection.com/img/b/7f876-67290_lkbz4_black_w_14.jpg'
    ],
    description: 'Luxurious cashmere sweater with crew neck design for ultimate comfort and warmth.',
    rating: 4.9,
    reviews: 89,
    isNew: true,
    colour: 'Camel',
    size: 'M',
    stock: 32,
    features: [
      '100% Pure Cashmere',
      'Crew neck design',
      'Ribbed cuffs and hem',
      'Soft touch',
      'Lightweight warmth'
    ],
    specifications: {
      "Material": "100% Cashmere",
      "Fit": "Regular Fit",
      "Weight": "Lightweight",
      "Care": "Hand Wash Cold",
      "Season": "Winter",
      "SKU": 'WC-HM-CASHMERE-001'
    }
  },
  
  // Formal Wear
  {
    id: 14,
    name: 'Evening Gown',
    brand: 'H&M',
    category: 'Dresses',
    productType: 'Evening Dress',
    price: 8999,
    discount: 20,
    originalPrice: 11249,
    image: 'https://m.media-amazon.com/images/I/41EtKk-9GXL._AC_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/41EtKk-9GXL._AC_.jpg',
      'https://i.pinimg.com/236x/77/8a/e6/778ae6ea5a5c3b5629174ad0d0afbd85.jpg'
    ],
    description: 'Glamorous evening gown with sequin details and elegant mermaid silhouette.',
    rating: 4.9,
    reviews: 67,
    isNew: true,
    colour: 'Emerald Green',
    size: 'L',
    stock: 18,
    features: [
      'Sequin embellishment',
      'Mermaid silhouette',
      'V-neck design',
      'Open back',
      'Floor length'
    ],
    specifications: {
      "Material": "Polyester with Sequin",
      "Fit": "Mermaid Fit",
      "Length": "Floor Length",
      "Care": "Dry Clean Only",
      "Occasion": "Formal & Red Carpet",
      "Season": "Special Occasion",
      "SKU": 'WC-HM-EVENING-001'
    }
  },
  
  // Jumpsuits & Rompers
  {
    id: 15,
    name: 'Culotte Jumpsuit',
    brand: 'ZARA',
    category: 'Jumpsuits',
    productType: 'Jumpsuit',
    price: 5299,
    discount: 25,
    originalPrice: 7065,
    image: 'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/SearchINT/Lge/B38699.jpg?im=Resize,width=450',
    images: [
      'https://xcdn.next.co.uk/Common/Items/Default/Default/ItemImages/3_4Ratio/SearchINT/Lge/B38699.jpg?im=Resize,width=450',
      'https://cdna.lystit.com/photos/yumi/6dca2517/yumi-Green-Twill-Viscose-Utility-Jumpsuit.jpeg'
    ],
    description: 'Stylish culotte jumpsuit with wide legs and wrap design for sophisticated evenings.',
    rating: 4.6,
    reviews: 98,
    isNew: true,
    colour: 'Navy Blue',
    size: 'M',
    stock: 26,
    features: [
      'Wrap design',
      'Wide leg culotte',
      'V-neck',
      'Tie waist',
      'Flowy fabric'
    ],
    specifications: {
      "Material": "100% Viscose",
      "Fit": "Regular Fit",
      "Length": "Full Length",
      "Care": "Dry Clean Only",
      "Occasion": "Party & Special",
      "SKU": 'WC-ZARA-JUMPSUIT-001'
    }
  },
  
  // Winter Wear
  {
    id: 16,
    name: 'Wool Blend Coat',
    brand: 'H&M',
    category: 'Coats',
    productType: 'Winter Coat',
    price: 6999,
    discount: 35,
    originalPrice: 10768,
    image: 'https://m.media-amazon.com/images/I/9133SEA+gcL._AC_UY1100_.jpg',
    images: [
      'https://m.media-amazon.com/images/I/9133SEA+gcL._AC_UY1100_.jpg',
      'https://cdn.platform.next/common/items/default/default/itemimages/3_4Ratio/product/lge/Q85772s.jpg'
    ],
    description: 'Warm wool blend coat with oversized fit and stylish lapel collar for winter.',
    rating: 4.7,
    reviews: 134,
    isNew: true,
    colour: 'Camel',
    size: 'L',
    stock: 32,
    features: [
      'Wool blend fabric',
      'Oversized fit',
      'Lapel collar',
      'Deep pockets',
      'Button closure'
    ],
    specifications: {
      "Material": "70% Wool, 30% Polyester",
      "Fit": "Oversized Fit",
      "Length": "Mid-thigh (90cm)",
      "Care": "Dry Clean Only",
      "Season": "Winter",
      "SKU": 'WC-HM-COAT-001'
    }
  },
  
  // Summer Essentials
  {
    id: 17,
    name: 'Linen Button-Down Shirt',
    brand: 'H&M',
    category: 'Tops',
    productType: 'Shirt',
    price: 2299,
    discount: 40,
    originalPrice: 3832,
    image: 'https://i.etsystatic.com/15150209/r/il/c3cc87/1828575253/il_570xN.1828575253_qfnw.jpg',
    images: [
      'https://i.etsystatic.com/15150209/r/il/c3cc87/1828575253/il_570xN.1828575253_qfnw.jpg',
        'https://images-cdn.ubuy.co.in/655e0312dadd2b533a1f0776-womens-cotton-linen-button-down-shirt.jpg'
    ],
    description: 'Breathable linen shirt with button-down design, perfect for summer casual wear.',
    rating: 4.5,
    reviews: 187,
    isNew: true,
    colour: 'Natural',
    size: 'M',
    stock: 56,
    features: [
      '100% Linen',
      'Button-down front',
      'Relaxed fit',
      'Chest pocket',
      'Breathable fabric'
    ],
    specifications: {
      "Material": "100% Linen",
      "Fit": "Relaxed Fit",
      "Style": "Casual",
      "Care": "Machine Wash Gentle",
      "Season": "Summer",
      "SKU": 'WC-HM-LINEN-001'
    }
  },
  
  // Casual Wear
  {
    id: 18,
    name: 'Oversized Hoodie',
    brand: 'Nike',
    category: 'Sweaters',
    productType: 'Hoodie',
    price: 3999,
    discount: 30,
    originalPrice: 5713,
    image: 'https://images.meesho.com/images/products/454917334/fqbsy_512.webp?width=512',
    images: [
      'https://images.meesho.com/images/products/454917334/fqbsy_512.webp?width=512',
      'https://lachicpick.in/wp-content/uploads/2023/01/683-1.png'
    ],
    description: 'Comfortable oversized hoodie with kangaroo pocket and ribbed cuffs for casual days.',
    rating: 4.6,
    reviews: 245,
    isNew: false,
    colour: 'Heather Grey',
    size: 'L',
    stock: 48,
    features: [
      'Oversized fit',
      'Kangaroo pocket',
      'Ribbed cuffs and hem',
      'Adjustable hood',
      'Soft fleece lining'
    ],
    specifications: {
      "Material": "80% Cotton, 20% Polyester",
      "Fit": "Oversized",
      "Style": "Athleisure",
      "Care": "Machine Wash",
      "Season": "Fall & Winter",
      "SKU": 'WC-NIKE-HOODIE-001'
    }
  },
  
  // Workwear Essentials
  {
    id: 19,
    name: 'Tailored Blazer',
    brand: 'ZARA',
    category: 'Blazers',
    productType: 'Formal Blazer',
    price: 5999,
    discount: 20,
    originalPrice: 7499,
    image: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/B24784s.jpg?im=Resize,width=750',
    images: [
      'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/B24784s.jpg?im=Resize,width=750',
      'https://assets.ajio.com/medias/sys_master/root/20241120/fN58/673de5900f47f80c87982c7c/-473Wx593H-442797187-maroon-MODEL.jpg'
    ],
    description: 'Professional tailored blazer with notch lapel and single back vent for office wear.',
    rating: 4.8,
    reviews: 156,
    isNew: true,
    colour: 'Black',
    size: 'M',
    stock: 34,
    features: [
      'Tailored fit',
      'Notch lapel',
      'Single back vent',
      'Functional buttons',
      'Structured shoulders'
    ],
    specifications: {
      "Material": "65% Polyester, 35% Viscose",
      "Fit": "Tailored Fit",
      "Style": "Professional",
      "Care": "Dry Clean Only",
      "Occasion": "Office & Business",
      "SKU": 'WC-ZARA-BLAZER-001'
    }
  },
  
  // Lounge & Home Wear
  {
    id: 20,
    name: 'Cashmere Lounge Set',
    brand: 'H&M',
    category: 'Sweaters',
    productType: 'Loungewear',
    price: 8499,
    discount: 15,
    originalPrice: 9999,
    image: 'https://www.sanskrutihomes.in/cdn/shop/files/IMGL5512.jpg?v=1755583084&width=2048',
    images: [
      'https://www.sanskrutihomes.in/cdn/shop/files/IMGL5512.jpg?v=1755583084&width=2048',
      'https://www.sanskrutihomes.in/cdn/shop/files/IMGL5555.jpg?v=1755583091&width=2048'
    ],
    description: 'Luxurious cashmere lounge set with matching pants for ultimate home comfort.',
    rating: 4.9,
    reviews: 89,
    isNew: true,
    colour: 'Cream',
    size: 'M',
    stock: 22,
    features: [
      'Pure cashmere fabric',
      'Matching set',
      'Elastic waistband',
      'Ribbed cuffs',
      'Ultra soft'
    ],
    specifications: {
      "Material": "100% Cashmere",
      "Fit": "Relaxed Fit",
      "Style": "Loungewear",
      "Care": "Hand Wash Only",
      "Season": "All Year",
      "SKU": 'WC-HM-LOUNGE-001'
    }
  }
];

export default womenClothes;