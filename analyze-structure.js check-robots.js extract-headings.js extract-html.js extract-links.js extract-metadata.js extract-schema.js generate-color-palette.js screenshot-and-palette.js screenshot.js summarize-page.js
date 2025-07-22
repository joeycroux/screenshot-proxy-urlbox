const axios = require("axios");
const xml2js = require("xml2js");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    const sitemapUrl = url.endsWith("/") ? `${url}sitemap.xml` : `${url}/sitemap.xml`;
    const response = await axios.get(sitemapUrl, {
      headers: { "Accept": "application/xml" }
    });

    const xml = response.data;
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    const urls = result.urlset?.url?.map(entry => entry.loc[0]) || [];

    res.status(200).json({
      sitemapUrl,
      found: true,
      totalUrls: urls.length,
      sampleUrls: urls.slice(0, 10)
    });
  } catch (err) {
    res.status(404).json({
      sitemapUrl: url,
      found: false,
      error: err.message
    });
  }
};
