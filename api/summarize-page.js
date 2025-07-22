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

    // Remove script and style tags
    document.querySelectorAll('script, style, noscript').forEach(el => el.remove());

    const rawText = document.body.textContent || '';
    const cleanText = rawText.replace(/\s+/g, ' ').trim();
    const trimmed = cleanText.length > 1200 ? cleanText.substring(0, 1200) + '...' : cleanText;

    res.status(200).json({
      url,
      wordCount: cleanText.split(/\s+/).length,
      summary: trimmed
    });
  } catch (error) {
    console.error('Error summarizing page:', error);
    res.status(500).json({ error: 'Failed to summarize page' });
  }
};
