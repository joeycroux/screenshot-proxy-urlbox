const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const base = new URL(url).origin;
    const sitemapUrl = `${base}/sitemap.xml`;
    const { data: xml } = await axios.get(sitemapUrl);

    const parsed = await xml2js.parseStringPromise(xml, { trim: true });

    const urls = parsed.urlset?.url?.map(u => ({
      loc: u.loc?.[0] || null,
      lastmod: u.lastmod?.[0] || null,
      priority: u.priority?.[0] || null,
      changefreq: u.changefreq?.[0] || null
    })) || [];

    res.json({
      url,
      sitemapUrl,
      count: urls.length,
      pages: urls
    });
  } catch (error) {
    console.error('Error extracting sitemap:', error.message);
    res.status(500).json({ error: 'Failed to extract sitemap' });
  }
};
