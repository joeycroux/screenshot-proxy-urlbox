const fetch = require('node-fetch');
const { parse } = require('robots-parser');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const robotsUrl = new URL('/robots.txt', url).href;
    const response = await fetch(robotsUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'robots.txt not found' });
    }

    const content = await response.text();
    const robots = parse(robotsUrl, content);

    const userAgents = ['*', 'googlebot', 'GPTBot'];
    const results = userAgents.map(agent => ({
      agent,
      isAllowed: robots.isAllowed(url, agent),
      disallowedPaths: robots.getDisallowedPaths(agent)
    }));

    res.status(200).json({
      url,
      robotsUrl,
      results
    });
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    res.status(500).json({ error: 'Failed to check robots.txt' });
  }
};
