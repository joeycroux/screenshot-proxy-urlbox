const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { url } = req.query;
  const API_KEY = process.env.URLBOX_API_KEY;
  const SLUG = process.env.URLBOX_SLUG;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

 const endpoint = `https://api.urlbox.io/v1/${SLUG}/png?api_key=${API_KEY}&url=${encodeURIComponent(url)}`;

  console.log(`Calling URLbox: ${endpoint}`);

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log('URLbox Response:', data);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching screenshot:', error);
    return res.status(500).json({ error: 'Failed to retrieve screenshot' });
  }
};
