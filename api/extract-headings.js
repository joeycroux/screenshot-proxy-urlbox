const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'SEO-Agent-Bot' }
    });
    const $ = cheerio.load(response.data);

    const headings = {};
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
      headings[tag] = [];
      $(tag).each((_, el) => {
        headings[tag].push($(el).text().trim());
      });
    });

    res.status(200).json({ headings });
  } catch (error) {
    console.error('Error extracting headings:', error.message);
    res.status(500).json({ error: 'Failed to extract headings' });
  }
};
