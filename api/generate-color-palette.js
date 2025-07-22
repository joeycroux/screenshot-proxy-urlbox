const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { getPaletteFromURL } = require('colorthief');

module.exports = async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing imageUrl parameter' });
  }

  try {
    // Download image temporarily to disk
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(400).json({ error: 'Failed to download image from URL' });
    }

    const buffer = await response.buffer();
    const tempPath = path.join('/tmp', 'temp-image.png');
    fs.writeFileSync(tempPath, buffer);

    const palette = await getPaletteFromURL(tempPath);

    // Clean up
    fs.unlinkSync(tempPath);

    res.status(200).json({
      imageUrl,
      palette: palette.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`)
    });
  } catch (error) {
    console.error('Palette generation error:', error);
    res.status(500).json({ error: 'Failed to generate color palette' });
  }
};
