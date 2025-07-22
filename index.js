const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;
const URLBOX_KEY = process.env.URLBOX_API_KEY;
const SLUG = process.env.URLBOX_SLUG;

app.get('/screenshot', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  const endpoint = `https://api.urlbox.io/v1/${SLUG}/url?api_key=${URLBOX_KEY}&url=${encodeURIComponent(url)}`;
  console.log(`Calling URLbox: ${endpoint}`);

  try {
    const resp = await fetch(endpoint);
    const data = await resp.json();
    console.log('URLbox Response:', data);
    return res.json(data);
  } catch (err) {
    console.error('Error calling URLbox:', err);
    return res.status(500).json({ error: 'Failed to fetch screenshot' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
