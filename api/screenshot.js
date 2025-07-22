const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url, ...options } = req.query;
  const SECRET_KEY = process.env.URLBOX_SECRET;
  const SLUG = process.env.URLBOX_SLUG;

  if (!url || !SECRET_KEY || !SLUG) {
    return res.status(400).json({ error: 'Missing url or URLbox credentials (slug/secret)' });
  }

  const queryParams = new URLSearchParams({
    url,
    ...options
  });

  const endpoint = `https://api.urlbox.io/v1/${SLUG}/png?${queryParams.toString()}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('URLbox API Error:', errorText);
      return res.status(response.status).json({ error: 'URLbox API failed', details: errorText });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

