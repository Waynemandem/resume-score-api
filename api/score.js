import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeText } = req.body;

  if ( !resumeText || typeof resumeText !== 'string' ) {
    return res.status(400).json({ error: 'resumeText is required and must be a string'});
  }

  if (resumeText.trim().length < 50) {
    return res.status(400).json({ error: 'resumeText is too short to be a real resume' })
  }

  if (resumeText.length > 6000) {
    return res.status(400).json({ error: 'resumeText exceeds 6000 character limit' })
  }

  try {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a resume reviewer.  Respond ONLY with valid JSON, no markdown, no preamble. Format: {"score": number 0-100, "strengths": string[], "improvements": string[]}'
    },
          { role: 'user', content: resumeText }
        ],
        response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(result);
}  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to score resume' });
}
}