import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://resu-craft-smoky.vercel.app';

    const templates = [
        'tech',
        'finance',
        'healthcare',
        'creative',
        'general',
        'legal',
        'education',
    ] as const;

    const builderPages: MetadataRoute.Sitemap = templates.map((slug) => ({
        url: `${baseUrl}/builder/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/templates`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...builderPages,
    ];
}
