const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Prefer content inside <main>, <article>, or largest <div>
    let content =
      $('main').text() ||
      $('article').text() ||
      $('body').text();

    const cleanedText = content.replace(/\s+/g, ' ').trim();
    const sentences = cleanedText.split(/(?<=[.?!])\s+/).filter(Boolean);

    const summary = sentences.slice(0, 5).join(' ');

    res.json({
      url,
      summary: summary || 'No meaningful content found to summarize.'
    });
  } catch (error) {
    console.error('Error summarizing page:', error.message);
    res.status(500).json({ error: 'Failed to summarize page' });
  }
};
