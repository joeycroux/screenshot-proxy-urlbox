const fetch = require('node-fetch');
const ColorThief = require('colorthief');
const sharp = require('sharp');

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
    const image = await sharp(buffer).resize(300).toBuffer();

    const dominant = await ColorThief.getColor(image);
    const palette = await ColorThief.getPalette(image, 5);

    res.status(200).json({
      url,
      dominant,
      palette
    });
  } catch (error) {
    console.error('Color palette generation failed:', error);
    res.status(500).json({ error: 'Failed to generate color palette' });
  }
};
