import { MetadataRoute } from 'next'
import { DECKS } from '@/data/decks'
import { HS_CLASSES } from '@/data/classes'

const BASE_URL = 'https://hstopdecks.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/decks`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cards`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/meta`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/synergies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/decks/import`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mechanics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const deckPages: MetadataRoute.Sitemap = DECKS.map((deck) => ({
    url: `${BASE_URL}/decks/${deck.id}`,
    lastModified: new Date(deck.dateUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const classPages: MetadataRoute.Sitemap = HS_CLASSES.map((hsClass) => ({
    url: `${BASE_URL}/classes/${hsClass.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...deckPages, ...classPages]
}
