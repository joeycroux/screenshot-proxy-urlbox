const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    const summary = text.split('.').slice(0, 3).join('. ') + '.';

    res.json({
      url,
      summary
    });
  } catch (error) {
    console.error('Error summarizing page:', error.message);
    res.status(500).json({ error: 'Failed to summarize page' });
  }
};
