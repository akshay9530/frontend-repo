// src/data/saleProductsData.js

// Sale & Offer products with high discounts
export const saleProducts = [
  // High Discount Clothing
  {
    id: 102,
    name: 'Designer Winter Coat',
    brand: 'ZARA',
    category: 'Clothes',
    productType: 'Coat',
    price: 4999,
    discount: 55,
    originalPrice: 11199,
    isSale: true,
    saleBadge: 'WINTER SALE',
    images: [
      'https://www.fashiongonerogue.com/wp-content/uploads/2015/12/Zara-Winter-2015-Coats-Lookbook01.jpg',
      'https://www.fashiongonerogue.com/wp-content/uploads/2015/12/Zara-Winter-2015-Coats-Lookbook01.jpg'
    ],
    rating: 4.7,
    reviews: 156,
    colour: 'Black',
    size: 'L',
    stock: 12,
    description: 'Premium winter coat with 55% discount. Warm and stylish.',
    features: [
      "Wool Blend Fabric",
      "Water Resistant",
      "Deep Pockets",
      "Button Closure",
      "Dry Clean Only"
    ],
    sku: 'WINTER-COAT-BLK-L'
  },
  
  // Electronics with Discounts
  {
    id: 103,
    name: 'Samsung Galaxy S23',
    brand: 'Samsung',
    category: 'Electronics',
    productType: 'Smartphone',
    price: 54999,
    discount: 45,
    originalPrice: 99999,
    isSale: true,
    saleBadge: 'CLEARANCE',
    images: [
      'https://media.tatacroma.com/Croma%20Assets/Communication/Mobiles/Images/268867_0_sstd64.png',
      'https://d10cggh4v5dmy2.cloudfront.net/media/catalog/product/cache/bcdc1b9c106b4f6bf5eae8fe126528ce/G/A/GALAXY_S23_BLACK_ALL_59f9.jpg'
    ],
    rating: 4.6,
    reviews: 234,
    colour: 'Green',
    storage: '256GB',
    stock: 6,
    description: 'Previous generation flagship with massive 45% discount.',
    features: [
      "Snapdragon 8 Gen 2",
      "50MP Camera",
      "120Hz Display",
      "Wireless Charging",
      "One Year Warranty"
    ],
    sku: 'SGS23-256-GRN'
  },
  {
    id: 104,
    name: 'Sony WH-1000XM4',
    brand: 'Sony',
    category: 'Electronics',
    productType: 'Headphones',
    price: 19999,
    discount: 50,
    originalPrice: 39999,
    isSale: true,
    isLimited: true,
    saleBadge: 'LIMITED STOCK',
    images: [
      'https://rukminim2.flixcart.com/image/704/844/xif0q/headphone/2/j/l/-original-imah28h4mwkywgfu.jpeg?q=20&crop=false',
      'https://rukminim2.flixcart.com/image/480/640/l1dwknk0/headphone/8/m/r/wh-1000xm4-sony-original-imagcywfzfwjmvbr.jpeg?q=90'
    ],
    rating: 4.8,
    reviews: 456,
    colour: 'Silver',
    stock: 4,
    description: 'Premium noise-cancelling headphones at half price!',
    features: [
      "Industry-Leading Noise Cancellation",
      "30-Hour Battery",
      "Touch Controls",
      "Hi-Res Audio Support",
      "Carrying Case Included"
    ],
    sku: 'SONY-XM4-SLV'
  },
  
  // Shoes with Discounts
  {
    id: 105,
    name: 'Nike Air Max 270',
    brand: 'Nike',
    category: 'Shoes',
    productType: 'Sneakers',
    price: 6999,
    discount: 40,
    originalPrice: 11665,
    isSale: true,
    saleBadge: 'FLASH SALE',
    images: [
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/28210760/2024/3/13/4ea0d546-c3a5-48b1-890c-ce738af20b471710309101575NikeAirMax270MensShoes1.jpg',
      'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/10715844/2024/12/23/9f5a7475-62f7-458c-9091-57d36fa483621734933776742-Nike-Men-Black-Air-Max-270-Sneakers-3961734933776335-1.jpg'
    ],
    rating: 4.4,
    reviews: 189,
    colour: 'White/Blue',
    size: 'US 10',
    stock: 10,
    description: 'Popular Air Max sneakers with huge 40% discount.',
    features: [
      "Air Max Unit",
      "Breathable Mesh",
      "Rubber Outsole",
      "Padded Collar",
      "Signature Nike Comfort"
    ],
    sku: 'NIKE-AM270-WB-10'
  },
  {
    id: 106,
    name: 'Leather Formal Shoes',
    brand: 'Steve Madden',
    category: 'Shoes',
    productType: 'Formal Shoes',
    price: 2999,
    discount: 65,
    originalPrice: 8571,
    isSale: true,
    isLimited: true,
    saleBadge: 'END OF SEASON',
    images: [
      'https://m.media-amazon.com/images/I/51xsqYcAjCL._AC_UY1000_.jpg',
      'https://assets.ajio.com/medias/sys_master/root/20240207/rPcU/65c395708cdf1e0df5f3f088/-288Wx360H-410457620-217-MODEL.jpg'
    ],
    rating: 4.3,
    reviews: 78,
    colour: 'Brown',
    size: 'US 9',
    stock: 5,
    description: 'High-quality leather shoes at 65% off. Limited sizes!',
    features: [
      "Genuine Leather",
      "Cushioned Insole",
      "Leather Sole",
      "Classic Design",
      "Professional Finish"
    ],
    sku: 'MADDEN-BROWN-9'
  },
  
  // Watches & Accessories
  {
    id: 107,
    name: 'Fossil Smartwatch',
    brand: 'Fossil',
    category: 'Electronics',
    productType: 'Smartwatch',
    price: 11999,
    discount: 50,
    originalPrice: 23999,
    isSale: true,
    saleBadge: 'SMART DEAL',
    images: [
      'https://img.tatacliq.com/images/i8/658Wx734H/MP000000014437859_658Wx734H_202209131820411.jpeg',
      'https://img.tatacliq.com/images/i8/658Wx734H/MP000000014437872_658Wx734H_202209131821231.jpeg'
    ],
    rating: 4.5,
    reviews: 123,
    colour: 'Black',
    size: '44mm',
    stock: 15,
    description: 'Feature-packed smartwatch at half price.',
    features: [
      "Heart Rate Monitor",
      "GPS Tracking",
      "NFC Payments",
      "7-Day Battery",
      "Water Resistant"
    ],
    sku: 'FOSSIL-SMART-BLK'
  },
  {
    id: 108,
    name: 'Levi\'s Denim Jacket',
    brand: 'Levi\'s',
    category: 'Clothes',
    productType: 'Jacket',
    price: 3999,
    discount: 50,
    originalPrice: 7999,
    isSale: true,
    saleBadge: 'DENIM SALE',
    images: [
      'https://images-cdn.ubuy.co.in/66e59f3c5a1692263e5e74be-levi-39-s-men-39-s-denim-jacket.jpg',
      'https://levi.in/cdn/shop/files/248690135_01_Styleshot.jpg?v=1733252953'
    ],
    rating: 4.6,
    reviews: 89,
    colour: 'Blue',
    size: 'M',
    stock: 18,
    description: 'Classic denim jacket with 50% discount.',
    features: [
      "100% Cotton Denim",
      "Button Front",
      "Chest Pockets",
      "Classic Fit",
      "Machine Washable"
    ],
    sku: 'LEVI-JACKET-BLUE-M'
  },
  
  {
    id: 110,
    name: 'Designer Handbag',
    brand: 'H&M',
    category: 'Accessories',
    productType: 'Handbag',
    price: 1999,
    discount: 70,
    originalPrice: 6663,
    isSale: true,
    isLimited: true,
    saleBadge: 'CLEARANCE',
    images: [
      'https://image.hm.com/assets/hm/5a/bd/5abd22c40f866552fcd4f5801c1a706eb5d6dfbf.jpg?imwidth=768'
    ],
    rating: 4.4,
    reviews: 56,
    colour: 'Beige',
    stock: 7,
    description: 'Stylish handbag with massive 70% discount!',
    features: [
      "Genuine Leather",
      "Multiple Compartments",
      "Adjustable Strap",
      "Gold-tone Hardware",
      "Dust Bag Included"
    ],
    sku: 'HM-BAG-BEIGE'
  },
  
  // More Sale Items
  {
    id: 111,
    name: 'Casual Summer Dress',
    brand: 'ZARA',
    category: 'Clothes',
    productType: 'Dress',
    price: 1299,
    discount: 60,
    originalPrice: 3249,
    isSale: true,
    saleBadge: 'SUMMER SALE',
    images: [
      'https://static.zara.net/assets/public/9253/2344/fdf74608a417/2b885c929070/02284576400-p/02284576400-p.jpg?ts=1755185835429&w=352',
    ],
    rating: 4.5,
    reviews: 92,
    colour: 'Yellow',
    size: 'S',
    stock: 14,
    description: 'Perfect summer dress at 60% off.',
    features: [
      "Lightweight Fabric",
      "Floral Print",
      "Knee Length",
      "Machine Wash",
      "Breathable Material"
    ],
    sku: 'ZARA-DRESS-YEL-S'
  },
  {
    id: 112,
    name: 'Wireless Earbuds',
    brand: 'Boat',
    category: 'Electronics',
    productType: 'Earbuds',
    price: 1999,
    discount: 60,
    originalPrice: 4999,
    isSale: true,
    saleBadge: 'AUDIO SALE',
    images: [
      'https://www.boat-lifestyle.com/cdn/shop/products/c2386af9-4349-432f-8ba5-2b6aa06025c8_76178e65-cec1-436c-87e2-f834b18ffd42_600x.png?v=1658824214'
    ],
    rating: 4.3,
    reviews: 245,
    colour: 'Black',
    stock: 32,
    description: 'Premium wireless earbuds with ANC at 60% off.',
    features: [
      "Active Noise Cancellation",
      "30-Hour Battery",
      "IPX7 Waterproof",
      "Touch Controls",
      "Fast Charging"
    ],
    sku: 'BOAT-EARBUDS-BLK'
  },
  
  {
    id: 114,
    name: 'Leather Wallet',
    brand: 'Tommy Hilfiger',
    category: 'Accessories',
    productType: 'Wallet',
    price: 999,
    discount: 75,
    originalPrice: 3999,
    isSale: true,
    isLimited: true,
    saleBadge: 'MEGA DEAL',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnZHJGHbhcUvClR6dtGd9f-lS4li7IIaVaVA&s'
    ],
    rating: 4.6,
    reviews: 134,
    colour: 'Brown',
    stock: 20,
    description: 'Premium leather wallet at 75% discount!',
    features: [
      "Genuine Leather",
      "Multiple Card Slots",
      "Coin Pocket",
      "RFID Protection",
      "Slim Design"
    ],
    sku: 'TOMMY-WALLET-BRN'
  },
  
  // Clearance Items
  {
    id: 115,
    name: 'Yoga Mat Premium',
    brand: 'Nike',
    category: 'Sports',
    productType: 'Fitness Equipment',
    price: 1299,
    discount: 50,
    originalPrice: 2599,
    isSale: true,
    saleBadge: 'CLEARANCE',
    images: [
      'https://rukminim2.flixcart.com/image/480/640/xif0q/sport-mat/e/x/d/move-yoga-mat-mint-foam-ash-green-4-61-nike-15-original-imahfeh9swnm9dv9.jpeg?q=90'
    ],
    rating: 4.7,
    reviews: 89,
    colour: 'Purple',
    stock: 28,
    description: 'Non-slip yoga mat with alignment markers.',
    features: [
      "Eco-friendly Material",
      "Non-slip Surface",
      "Alignment Markers",
      "Carry Strap",
      "Easy to Clean"
    ],
    sku: 'NIKE-YOGAMAT-PUR'
  },
  {
    id: 116,
    name: 'Winter Sweater',
    brand: 'H&M',
    category: 'Clothes',
    productType: 'Sweater',
    price: 1499,
    discount: 60,
    originalPrice: 3749,
    isSale: true,
    isLimited: true,
    saleBadge: 'LIMITED STOCK',
    images: [
      'https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/NOVEMBER/20/Cg9zEt07_c8bbf0921b7b48cca7208230cc1b16fc.jpg'
    ],
    rating: 4.4,
    reviews: 67,
    colour: 'Grey',
    size: 'L',
    stock: 9,
    description: 'Warm winter sweater at 60% off.',
    features: [
      "Wool Blend",
      "Turtle Neck",
      "Ribbed Cuffs",
      "Machine Wash",
      "Winter Essential"
    ],
    sku: 'HM-SWEATER-GRY-L'
  }
];

// Export filter options generator function
export const getFilterOptions = (products) => {
  const brands = [...new Set(products.map(p => p.brand))];
  const categories = [...new Set(products.map(p => p.category))];
  const productTypes = [...new Set(products.map(p => p.productType))];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'US 8', 'US 9', 'US 10', 'US 11'];
  const colours = [...new Set(products.map(p => p.colour))];
  
  return {
    sort: ['Discount: High to Low', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Popularity', 'Customer Rating'],
    brand: brands.sort(),
    category: categories.sort(),
    productType: productTypes.sort(),
    size: sizeOptions.sort(),
    colour: colours.sort(),
    discount: ['30% and above', '40% and above', '50% and above', '60% and above', '70% and above'],
    priceRange: [
      'Under ₹1000',
      '₹1000 - ₹3000',
      '₹3000 - ₹5000',
      '₹5000 - ₹10000',
      '₹10000 - ₹20000',
      'Above ₹20000'
    ]
  };
};