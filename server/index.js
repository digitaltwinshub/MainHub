import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const openai = OPENAI_API_KEY
  ? new OpenAI({ apiKey: OPENAI_API_KEY })
  : null;

app.post('/api/chat', async (req, res) => {
  try {
    const { question, projects } = req.body || {};
    if (!question) {
      return res.status(400).json({ error: 'Missing question' });
    }

    const slicedProjects = (projects || []).slice(0, 20);

    const contextText =
      slicedProjects
        .map((p, i) => {
          const title = p.title || 'Untitled Project';
          const category = p.category || 'General';
          const goal = (p.goal || '').split('\n')[0];
          const summary = goal.length > 200 ? `${goal.slice(0, 197)}...` : goal;

          return (
            `- [${i + 1}] ${title} (${category})\n` +
            (summary ? `  • Goal: ${summary}` : '')
          ).trimEnd();
        })
        .join('\n') || 'No projects yet.';

    // If no OpenAI key is configured, fall back to a simple conversational reply
    if (!OPENAI_API_KEY || !openai) {
      const q = String(question || '').toLowerCase();

      let fallbackAnswer;
      if (q.includes('what is this website') || q.includes('what this website') || q.includes('what is this about') || (q.includes('what is this') && q.includes('about'))) {
        fallbackAnswer =
          'This website is a Digital Twins Projects Hub where you can explore student and research projects, tutorials, and example twins, and get ideas for building your own digital twins.';
      } else if (q.includes('digital twin')) {
        fallbackAnswer =
          'A digital twin is a virtual model of a real-world system (like a building, campus, or city) that stays linked to real data so you can monitor, simulate, and test ideas safely before changing the physical system.';
      } else if (q.includes('idea') || q.includes('project')) {
        fallbackAnswer =
          'You can use this hub to get ideas for digital twin projects, like energy-efficient buildings, campus mobility twins, or environmental monitoring twins that use real sensor and GIS data.';
      } else if (q === 'hi' || q === 'hello' || q.includes('how is it going') || q.includes('how are you')) {
        fallbackAnswer = 'Hi! Everything is going well on my side. How can I help you with Digital Twins or this website?';
      } else {
        fallbackAnswer =
          'Hi! I am in local mode right now, but I can still help with simple questions about digital twins or this website. What would you like to know or build?';
      }

      return res.json({ answer: fallbackAnswer, meta: { usedFallback: true, externalModelUsed: false, provider: 'local' } });
    }

    // Call OpenAI chat model
    const prompt =
      'You are a friendly, concise assistant for a Digital Twins Projects Hub. Answer in a short, conversational way, as if chatting with the user (for example: "Hi! Everything is going well. How can I help you?"). Use the project context only to inspire your answer, but do not dump long lists or raw data.\n\n' +
      'Context projects and tutorials (may be truncated):\n' +
      contextText +
      '\n\nUser question:\n' +
      question;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const baseAnswer =
      completion?.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a detailed answer right now. Try rephrasing your question or narrowing the topic.';

    res.json({ answer: baseAnswer, meta: { usedFallback: false, externalModelUsed: true, provider: 'openai' } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Chat error:', err);

    // Graceful fallback: respond 200 with an explanatory message so the frontend does not break
    const message =
      'The Digital Twins assistant encountered an unexpected error while contacting the OpenAI model. ' +
      'Please verify your OPENAI_API_KEY and network connection, then try again.\n\nRaw error: ' +
      (err && err.message ? err.message : String(err));

    res.json({
      answer: message,
      meta: { error: true, externalModelUsed: false, provider: 'openai' },
    });
  }
});

const port = process.env.PORT || process.env.CHAT_PORT || 5001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Chat server running on http://localhost:${port}`);
});
