import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL || 'portfolieo.vercel.app'}`
    : 'http://localhost:3000';

  // Get all users with portfolios
  let portfolioUrls: MetadataRoute.Sitemap = [];
  
  try {
    const users = await prisma.user.findMany({
      where: {
        projects: {
          some: {}
        }
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    portfolioUrls = users.map(user => ({
      url: `${baseUrl}/portfolio/${user.id}`,
      lastModified: user.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching users for sitemap:', error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...portfolioUrls,
  ]
}

