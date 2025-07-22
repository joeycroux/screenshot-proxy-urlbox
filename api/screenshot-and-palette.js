const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { getPaletteFromURL } = require('colorthief');

const SLUG = 'joeycroux'; // replace if needed
const SECRET_KEY = '5596a9a4310d4dafb0df45713d5e92df';

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  try {
    const encodedUrl = encodeURIComponent(url);
    const screenshotUrl = `https://api.urlbox.io/v1/${SLUG}/png?token=${SECRET_KEY}&url=${encodedUrl}`;

    // Download image temporarily
    const imageRes = await fetch(screenshotUrl);
    if (!imageRes.ok) {
      return res.status(400).json({ error: 'Failed to fetch screenshot' });
    }

    const buffer = await imageRes.buffer();
    const tempPath = path.join('/tmp', 'screenshot.png');
    fs.writeFileSync(tempPath, buffer);

    const palette = await getPaletteFromURL(tempPath);
    fs.unlinkSync(tempPath);

    res.status(200).json({
      imageUrl: screenshotUrl,
      palette: palette.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`)
    });
  } catch (err) {
    console.error('Screenshot + Palette error:', err);
    res.status(500).json({ error: 'Failed to complete screenshot and palette analysis' });
  }
};
