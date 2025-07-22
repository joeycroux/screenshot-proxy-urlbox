const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GPT-Audit-Bot/1.0)',
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Failed to fetch HTML', details: text });
    }

    const html = await response.text();
    res.status(200).json({ html });
  } catch (error) {
    console.error('Error extracting HTML:', error);
    res.status(500).json({ error: 'Failed to extract HTML' });
  }
};
