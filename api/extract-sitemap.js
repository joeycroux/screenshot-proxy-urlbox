const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const { data: xml } = await axios.get(url);
    xml2js.parseString(xml, { trim: true }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to parse sitemap XML' });
      }

      const urls = [];
      const entries = result.urlset?.url || [];

      for (const entry of entries) {
        if (entry.loc && entry.loc[0]) {
          urls.push(entry.loc[0]);
        }
      }

      res.json({ url, count: urls.length, urls });
    });
  } catch (error) {
    console.error('Error extracting sitemap:', error.message);
    res.status(500).json({ error: 'Failed to retrieve or parse sitemap' });
  }
};
