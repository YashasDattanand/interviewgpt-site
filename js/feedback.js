import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function feedback(req, res) {
  try {
    const { conversation } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an interview evaluator.
Give structured feedback:
- scores (communication, clarity, confidence out of 10)
- strengths
- weaknesses
- improvements
`
        },
        ...conversation
      ]
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Feedback generation failed" });
  }
}
