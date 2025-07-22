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
    const document = dom.window.document;

    const headings = [];
    for (let level = 1; level <= 6; level++) {
      const tag = `h${level}`;
      document.querySelectorAll(tag).forEach(el => {
        headings.push({
          tag,
          text: el.textContent.trim(),
        });
      });
    }

    res.status(200).json({ url, headings });
  } catch (error) {
    console.error('Error extracting headings:', error);
    res.status(500).json({ error: 'Failed to extract headings' });
  }
};
