import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  keywords: string[];
  path?: string;
  imagePath?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

export default function Seo({
  title,
  description,
  keywords,
  path = '/',
  imagePath = '/images/hero-bg.png',
  noIndex = false,
  type = 'website',
}: SeoProps) {
  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = new URL(path, origin).toString();
    const imageUrl = new URL(imagePath, origin).toString();
    const robots = noIndex ? 'noindex, nofollow' : 'index, follow';

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords.join(', '));
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', 'Indraam');
    upsertMeta('name', 'theme-color', '#FAFAF7');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:site_name', 'Indraam Studio');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertLink('canonical', canonicalUrl);
  }, [description, imagePath, keywords, noIndex, path, title, type]);

  return null;
}
