export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64, mimeType } = req.body || {};
  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing image data' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  const prompt = `You are an expert front-end developer and UI/UX engineer. Analyze the attached image of a website design and replicate it as closely as possible using HTML and CSS.

Strictly follow these rules:
1. Write the HTML and CSS combined in a single code block using <style> tags inside the HTML.
2. Do NOT add random or unrequested background colors, patterns, or elements that are not present in the reference image. Match the original design's background, colors, typography, and spacing precisely.
3. Output ONLY the code block containing the complete HTML and CSS. Do NOT include any introductory text, explanations, markdown outside the code block, or conversational filler.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: imageBase64
                }
              },
              { text: prompt }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ code: text });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate code' });
  }
}
