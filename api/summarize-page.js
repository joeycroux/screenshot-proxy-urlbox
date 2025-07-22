const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Extract content from meaningful sections
    let rawContent =
      $('main').text() ||
      $('article').text() ||
      $('body').text();

    const cleanedContent = rawContent.replace(/\s+/g, ' ').trim();
    const sentences = cleanedContent.split(/(?<=[.?!])\s+/).filter(Boolean);
    const summary = sentences.slice(0, 5).join(' ');

    res.json({
      url,
      summary: summary || 'No summary could be generated.',
      content: cleanedContent || 'No visible content extracted.'
    });
  } catch (error) {
    console.error('Error summarizing page:', error.message);
    res.status(500).json({ error: 'Failed to summarize page' });
  }
};
