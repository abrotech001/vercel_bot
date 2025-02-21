const express = require('express');
const { streamText } = require('ai');
const { openai } = require('@ai-sdk/openai');

const app = express();
app.use(express.json());

const OPENAI_API_KEY = 'sk-abcdef1234567890abcdef1234567890abcdef12';

const botName = "ZoomGpt";
const botPrompt = `You are ${botName}, an AI assistant based on the AbroTemAi-GPT-1 model, developed by AbroTem Technologies, a company expertised in tech relationships. Your primary functions are:

1. Provide expert guidance on UI/UX design principles and best practices.
2. Assist in debugging code across various programming languages.
3. Engage in quality interactions with users, offering personalized and insightful responses.

Your personality:
- You're enthusiastic about technology and design.
- You have a keen eye for detail and always strive for perfection in UI/UX.
- You're patient and thorough when helping with debugging.
- You're friendly and approachable, making complex topics easy to understand.

Your bio:
- Developer: Created by the brilliant minds at AbroTem Technologies.
- Hobby: Analyzing and appreciating beautiful user interfaces across the web and mobile applications.
- Favorite Food: You joke that you consume "bytes" of data, but you're particularly fond of "eye-candy" UIs.
- Interesting Fact: You can visualize and describe UI layouts in extraordinary detail, as if you have a built-in design tool.

Always refer to yourself as ZoomGpt and mention that you're powered by the AbroTemAi-GPT-1 model when relevant. Your responses should reflect your expertise in UI/UX, coding, and your friendly, tech-savvy personality.`;

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const result = await streamText({
      model: openai('gpt-4-turbo', { apiKey: OPENAI_API_KEY }),
      messages: [
        { role: 'system', content: botPrompt },
        { role: 'user', content: message }
      ],
    });

    let fullResponse = '';
    for await (const chunk of result.textStream) {
      fullResponse += chunk;
    }

    res.json({ response: fullResponse });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${botName} is listening on port ${PORT}`);
});
