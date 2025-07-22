const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const response = await axios.get(url, { maxRedirects: 5 });
    const $ = cheerio.load(response.data);

    const metadata = {
      resolvedUrl: response.request.res.responseUrl || url,
      title: $('title').text() || null,
      description: $('meta[name="description"]').attr('content') || null,
      keywords: $('meta[name="keywords"]').attr('content') || null,
      author: $('meta[name="author"]').attr('content') || null,
      ogTitle: $('meta[property="og:title"]').attr('content') || null,
      ogDescription: $('meta[property="og:description"]').attr('content') || null,
      ogImage: $('meta[property="og:image"]').attr('content') || null,
      twitterCard: $('meta[name="twitter:card"]').attr('content') || null,
      twitterTitle: $('meta[name="twitter:title"]').attr('content') || null,
      twitterDescription: $('meta[name="twitter:description"]').attr('content') || null,
      canonical: $('link[rel="canonical"]').attr('href') || null
    };

    res.status(200).json(metadata);
  } catch (error) {
    console.error('Error extracting metadata:', error);
    res.status(500).json({ error: 'Failed to extract metadata' });
  }
};
