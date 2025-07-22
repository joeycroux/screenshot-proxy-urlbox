const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const structure = {
      title: $('title').text(),
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length,
      images: $('img').length,
      links: $('a').length,
      paragraphs: $('p').length,
      forms: $('form').length,
      scripts: $('script').length,
      stylesheets: $('link[rel="stylesheet"]').length
    };

    res.json({ url, structure });
  } catch (error) {
    console.error('Error analyzing structure:', error.message);
    res.status(500).json({ error: 'Failed to analyze structure' });
  }
};
