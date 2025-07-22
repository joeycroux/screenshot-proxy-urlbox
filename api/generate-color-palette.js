const fetch = require('node-fetch');
const getColors = require('get-image-colors');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const screenshotUrl = `https://api.urlbox.io/v1/${process.env.URLBOX_API_KEY}/png?url=${encodeURIComponent(url)}&full_page=true&width=1200&height=900`;

    const response = await fetch(screenshotUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch screenshot' });
    }

    const buffer = await response.buffer();

    const colors = await getColors(buffer, 'image/png');

    const palette = colors.map(color => ({
      hex: color.hex(),
      rgb: color.rgb()
    }));

    res.status(200).json({ url, palette });
  } catch (error) {
    console.error('Error generating color palette:', error);
    res.status(500).json({ error: 'Failed to generate color palette' });
  }
};
