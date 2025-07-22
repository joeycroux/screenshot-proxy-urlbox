const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const baseUrl = new URL(url);
    const links = [];

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();

      if (!href || href.startsWith('javascript:')) return;

      let isExternal = false;
      let absoluteUrl = href;

      try {
        const resolved = new URL(href, baseUrl);
        isExternal = resolved.hostname !== baseUrl.hostname;
        absoluteUrl = resolved.href;
      } catch {
        // Skip malformed URLs
        return;
      }

      links.push({
        href: absoluteUrl,
        text,
        type: isExternal ? 'external' : 'internal'
      });
    });

    res.json({
      url,
      total: links.length,
      links
    });
  } catch (error) {
    console.error('Error extracting links:', error.message);
    res.status(500).json({ error: 'Failed to extract links' });
  }
};
