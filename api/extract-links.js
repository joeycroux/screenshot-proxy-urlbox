const axios = require('axios');
const { JSDOM } = require('jsdom');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const links = Array.from(document.querySelectorAll('a'))
      .map(link => ({
        text: link.textContent.trim(),
        href: link.href
      }))
      .filter(link => link.href && link.href.startsWith('http'));

    res.json({ links });
  } catch (error) {
    console.error('Error extracting links:', error.message);
    res.status(500).json({ error: 'Failed to extract links' });
  }
};
