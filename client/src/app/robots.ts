import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/api/',
            },
        ],
        sitemap: 'https://resu-craft-smoky.vercel.app/sitemap.xml',
    };
}
