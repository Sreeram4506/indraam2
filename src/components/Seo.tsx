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

function upsertJsonLd(id: string, jsonLd: unknown) {
  const existing = document.getElementById(id);
  const elementId = id;

  if (existing) {
    existing.textContent = JSON.stringify(jsonLd);
    return;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = elementId;
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);
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

    const organization = {
      '@type': 'Organization',
      name: 'Indraam Studio',
      url: 'https://www.indraam.com',
      logo: 'https://www.indraam.com/logo.png',
      sameAs: ['https://linkedin.com/company/indraam', 'https://github.com/indraam'],
    } as const;

    const website = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://www.indraam.com',
      name: 'Indraam Studio',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.indraam.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    } as const;

    // These are SPA-safe defaults for the homepage; callers can change `path`/title/description via props.
    const webPage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: canonicalUrl,
      description,
    } as const;

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.indraam.com/' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.indraam.com/#services' },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'AI Automation',
          item: 'https://www.indraam.com/ai-automation',
        },
      ],
    } as const;

    const services = [
      {
        '@type': 'Service',
        name: 'AI Automation',
        serviceType: 'AI Automation',
        areaServed: 'US',
        url: 'https://www.indraam.com/ai-automation',
      },
      {
        '@type': 'Service',
        name: 'Web Development',
        serviceType: 'Web Development',
        areaServed: 'US',
        url: 'https://www.indraam.com/web-development',
      },
      {
        '@type': 'Service',
        name: 'Mobile Apps',
        serviceType: 'Mobile Apps',
        areaServed: 'US',
        url: 'https://www.indraam.com/mobile-app-development',
      },
      {
        '@type': 'Service',
        name: 'AI Agents',
        serviceType: 'AI Agents',
        areaServed: 'US',
        url: 'https://www.indraam.com/ai-agents',
      },
      {
        '@type': 'Service',
        name: 'Workflow Automation',
        serviceType: 'Workflow Automation',
        areaServed: 'US',
        url: 'https://www.indraam.com/workflow-automation',
      },
      {
        '@type': 'Service',
        name: 'SaaS Development',
        serviceType: 'SaaS Development',
        areaServed: 'US',
        url: 'https://www.indraam.com/saas-development',
      },
      {
        '@type': 'Service',
        name: 'UI UX Design',
        serviceType: 'UI UX Design',
        areaServed: 'US',
        url: 'https://www.indraam.com/ui-ux-design',
      },
    ] as const;

    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What services does Indraam offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Indraam Studio builds AI automation, web development, mobile apps, AI agents, workflow automation, SaaS development, and UI/UX design.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does development take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Timelines depend on scope, but we define a clear plan up front and deliver in iterative milestones.',
          },
        },
        {
          '@type': 'Question',
          name: 'What industries do you serve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We support a wide range of industries and tailor solutions to your data, workflows, and operational needs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you build AI Agents?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We design and implement agentic AI systems that can reason, plan, and execute tasks with your tools and processes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you work internationally?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. We collaborate with clients internationally and deliver remotely across time zones.',
          },
        },
      ],
    } as const;

    const organizationJsonLd = {
      '@context': 'https://schema.org',
      ...organization,
    };

    upsertJsonLd('schema-organization', organizationJsonLd);
    upsertJsonLd('schema-website', website);
    upsertJsonLd('schema-webpage', webPage);
    upsertJsonLd('schema-breadcrumb', breadcrumb);
    upsertJsonLd(
      'schema-services',
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: services.map((s, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: s,
        })),
      } as const
    );
    upsertJsonLd('schema-faq', faq);

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'keywords', keywords.join(', '));
    upsertMeta('name', 'robots', robots);
    upsertMeta('name', 'author', 'Indraam');
    upsertMeta('name', 'theme-color', '#FAFAF7');

    // Open Graph
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:site_name', 'Indraam Studio');

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);

    // Prefer property variants too (some scrapers are more consistent)
    upsertMeta('property', 'twitter:title', title);
    upsertMeta('property', 'twitter:description', description);
    upsertMeta('property', 'twitter:image', imageUrl);

    upsertLink('canonical', canonicalUrl);
  }, [description, imagePath, keywords, noIndex, path, title, type]);

  return null;
}
