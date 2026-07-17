export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeText } = req.body;

  if ( !resumeText || typeof resumeText !== 'string' ) {
    return res.status(400).json({ error: 'resumeText is required and must be a string'});
  }

  if (resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'resumeText is too short to be a real' })
  }

  if (resumeText.length > 6000) {
    return res.status(400).json({ error: 'resumeText exceeds 6000 character limit' })
  }

  res.status(200).json({ message: 'API is alive', received: resumeText.length });
}