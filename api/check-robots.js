const axios = require('axios');
const robotsParser = require('robots-parser');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const base = new URL(url).origin;
    const robotsUrl = `${base}/robots.txt`;

    const { data } = await axios.get(robotsUrl);
    const robots = robotsParser(robotsUrl, data);

    res.json({
      url,
      robotsUrl,
      isAllowed: robots.isAllowed(url),
      isDisallowed: robots.isDisallowed(url),
      sitemap: robots.getSitemaps(),
      rules: data
    });
  } catch (error) {
    console.error('Error checking robots.txt:', error.message);
    res.status(500).json({ error: 'Failed to fetch robots.txt' });
  }
};
