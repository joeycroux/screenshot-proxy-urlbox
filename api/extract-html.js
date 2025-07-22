const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'SEO-Agent-Bot' }
    });

    return res.status(200).json({ html: response.data });
  } catch (error) {
    console.error('Error fetching HTML:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve HTML content' });
  }
};
