const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const schemas = [];

    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        schemas.push(json);
      } catch (e) {
        // Invalid JSON, skip
      }
    });

    res.json({ url, schemas });
  } catch (error) {
    console.error('Error extracting schema:', error.message);
    res.status(500).json({ error: 'Failed to extract schema data' });
  }
};
