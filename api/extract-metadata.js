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
    console.log('Fetched HTML length:', html.length);

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const metadata = {
      url,
      title: document.querySelector('title')?.textContent || null,
      description: document.querySelector('meta[name="description"]')?.content || null,
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      ogTitle: document.querySelector('meta[property="og:title"]')?.content || null,
      ogDescription: document.querySelector('meta[property="og:description"]')?.content || null,
      ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
      ogUrl: document.querySelector('meta[property="og:url"]')?.content || null,
      twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content || null,
      twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content || null,
      twitterImage: document.querySelector('meta[name="twitter:image"]')?.content || null
    };

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Metadata extraction error:', error);
    res.status(500).json({ error: 'Failed to extract metadata' });
  }
};
