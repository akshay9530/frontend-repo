// src/dummydata/homeData.js
// Create SVG placeholder function
export const createPlaceholder = (text = 'Image', width = 600, height = 400) => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" 
            font-size="18" fill="#9ca3af">${text}</text>
    </svg>
  `)}`;
};

// High-quality Unsplash images for slider (all same aspect ratio)
export const slidingImages = [
  {
    id: 1,
    image: 'https://img.freepik.com/free-psd/new-arrival-post-template-psd-fashion-shopping_53876-129197.jpg?semt=ais_hybrid&w=740&q=80',
    placeholder: createPlaceholder('New Arrivals', 1600, 900),
    title: 'New Arrivals',
    description: 'Discover the latest beauty trends for 2026',
    cta: 'Shop Now'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=900&q=80',
    placeholder: createPlaceholder('Best Sellers', 1600, 900),
    title: 'Best Sellers',
    description: 'Shop our most popular products of the season',
    cta: 'Explore'
  },
  {
    id: 3,
    image: 'https://m.media-amazon.com/images/I/712NHu4BSiL._AC_UF1000,1000_QL80_.jpg',
    placeholder: createPlaceholder('Limited Edition', 1600, 900),
    title: 'Limited Edition',
    description: 'Exclusive collections available for a limited time',
    cta: 'Discover'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=900&q=80',
    placeholder: createPlaceholder('Skincare Essentials', 1600, 900),
    title: 'Skincare Essentials',
    description: 'Complete your daily routine with our premium products',
    cta: 'Learn More'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&h=900&q=80',
    placeholder: createPlaceholder('Luxury Fragrances', 1600, 900),
    title: 'Luxury Fragrances',
    description: 'Indulge in our exclusive perfume collection',
    cta: 'Shop Fragrances'
  }
];

// Grid images
export const gridImages = [
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    placeholder: createPlaceholder('Makeup Collection'),
    title: 'Makeup Collection',
    description: 'Professional makeup for every occasion'
  },
  {
    id: 7,
    image: 'http://olamor.in/cdn/shop/collections/Post_34.26.jpg?v=1754394137&width=1100',
    placeholder: createPlaceholder('Hair Care'),
    title: 'Hair Care',
    description: 'Transform your hair routine'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    placeholder: createPlaceholder('Body Care'),
    title: 'Body Care',
    description: 'Pamper your skin from head to toe'
  },
  {
    id: 9,
    image: 'https://img.freepik.com/free-photo/bunch-wrapped-gifts-table_23-2148334964.jpg?semt=ais_hybrid&w=740&q=80',
    placeholder: createPlaceholder('Gift Sets'),
    title: 'Gift Sets',
    description: 'Perfect presents for beauty lovers'
  },
  {
    id: 10,
    image: 'https://jadeblue.com/cdn/shop/articles/mens_summer_wear.jpg?v=1714380887&width=1100',
    placeholder: createPlaceholder('Summer Collection'),
    title: 'Summer Collection',
    description: 'Fresh looks for sunny days'
  },
  {
    id: 11,
    image: 'https://img.freepik.com/free-psd/winter-season-poster-template_23-2150962430.jpg?semt=ais_hybrid&w=740&q=80',
    placeholder: createPlaceholder('Winter Collection'),
    title: 'Winter Collection',
    description: 'Cozy looks for cold days'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    placeholder: createPlaceholder('Organic Products'),
    title: 'Organic Products',
    description: 'Natural and eco-friendly beauty'
  },
  {
    id: 13,
    image: 'https://www.marq.com/wp-content/uploads/2022/12/0_iHzGFX15SmH2IgLF-768x576-1.webp',
    placeholder: createPlaceholder('Luxury Brands'),
    title: 'Luxury Brands',
    description: 'Premium beauty from top brands'
  }
];