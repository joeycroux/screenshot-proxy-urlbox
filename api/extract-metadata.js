const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GPT-Audit-Bot/1.0)'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Failed to fetch page', details: text });
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const getMeta = (name) =>
      doc.querySelector(`meta[name="${name}"]`)?.content ||
      doc.querySelector(`meta[property="${name}"]`)?.content ||
      null;

    const metadata = {
      title: doc.querySelector('title')?.textContent || null,
      description: getMeta('description'),
      robots: getMeta('robots'),
      canonical: doc.querySelector('link[rel="canonical"]')?.href || null,
      ogTitle: getMeta('og:title'),
      ogDescription: getMeta('og:description'),
      ogImage: getMeta('og:image'),
      twitterCard: getMeta('twitter:card'),
      twitterTitle: getMeta('twitter:title'),
      twitterDescription: getMeta('twitter:description'),
      favicon: doc.querySelector('link[rel="icon"]')?.href || null,
      charset: doc.characterSet || null
    };

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Error extracting metadata:', error);
    res.status(500).json({ error: 'Failed to extract metadata' });
  }
};
