export default async function handler(req, res) {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'UNSPLASH_ACCESS_KEY not configured' });
  }

  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${apiKey}`);
    const data = await response.json();
    const imageUrl = data?.urls?.full || data?.urls?.regular || '';
    return res.status(200).json({ imageUrl });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch background image' });
  }
}
