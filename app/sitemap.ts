import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://evenisersnew.onrender.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Define Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/catering',
    '/contact',
    '/corporate',
    '/forgot-password',
    '/games',
    '/login',
    '/privacy',
    '/refund-policy',
    '/shop',
    '/signup',
    '/terms',
    '/vendor',
    '/why',
    '/platform-sitemap',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Fetch Dynamic Product Routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`);
    const products = await res.json();

    if (Array.isArray(products)) {
      productRoutes = products.map((product: any) => ({
        url: `${BASE_URL}/product/${product._id}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // 3. Category Routes (Standard from shop)
  const categories = [
    'birthday', 'wedding', 'haldi-mehandi', 'engagement', 'anniversary', 
    'festival', 'babyshower', 'babywelcome', 'namingceremony', 
    'annaprashan', 'agedtoperfection', 'housewarming', 'bridetobe', 'romantic'
  ];

  const categoryRoutes = categories.map((cat) => ({
    url: `${BASE_URL}/shop?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
