const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');
const { URL } = require('url');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const baseUrl = new URL(url);

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
    const document = dom.window.document;

    const anchors = Array.from(document.querySelectorAll('a'));

    const links = anchors.map(a => {
      const href = a.getAttribute('href') || '';
      const isInternal = href.startsWith('/') || href.includes(baseUrl.hostname);
      return {
        text: a.textContent.trim(),
        href,
        type: isInternal ? 'internal' : 'external'
      };
    });

    res.status(200).json({ url, links });
  } catch (error) {
    console.error('Error extracting links:', error);
    res.status(500).json({ error: 'Failed to extract links' });
  }
};
