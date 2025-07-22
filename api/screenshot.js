const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url } = req.query;
  const API_KEY = process.env.URLBOX_API_KEY;
  const SLUG = process.env.URLBOX_SLUG;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const endpoint = `https://api.urlbox.io/v1/${SLUG}/png?api_key=${API_KEY}&url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'URLbox error', details: text });
    }

    // Pass through the image content
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error fetching screenshot:', error);
    res.status(500).json({ error: 'Failed to retrieve screenshot' });
  }
};
