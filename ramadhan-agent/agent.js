const Anthropic = require('@anthropic-ai/sdk');
const { fetchPrayerTimes } = require('./prayers');
const { getDailyObjective } = require('./objectives');

const anthropic = new Anthropic();

// Tools Claude is allowed to call
const tools = [
  {
    name: 'fetch_prayer_times',
    description: 'Fetch Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for a given city and country for today. Also returns the Hijri date.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'The city name, e.g. "London"' },
        country: { type: 'string', description: 'The country name or code, e.g. "UK" or "United Kingdom"' },
      },
      required: ['city', 'country'],
    },
  },
  {
    name: 'get_daily_objective',
    description: 'Get the Ramadan daily spiritual objective for a given day of Ramadan (1 to 30).',
    input_schema: {
      type: 'object',
      properties: {
        day: { type: 'number', description: 'The day of Ramadan, between 1 and 30' },
      },
      required: ['day'],
    },
  },
];

async function callTool(name, input) {
  if (name === 'fetch_prayer_times') {
    const data = await fetchPrayerTimes(input.city, input.country);
    return JSON.stringify(data, null, 2);
  }
  if (name === 'get_daily_objective') {
    return getDailyObjective(input.day);
  }
  throw new Error(`Unknown tool: ${name}`);
}

// The agentic loop:
// 1. Send user message + tools to Claude
// 2. If Claude responds with tool_use → run the tool → send result back
// 3. Repeat until Claude gives a final text answer (stop_reason = 'end_turn')
async function runAgent(userMessage) {
  const messages = [{ role: 'user', content: userMessage }];

  const system = `You are a friendly and knowledgeable Ramadan assistant. You help Muslims with:
- Prayer times for any city in the world (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Suhur (pre-dawn meal) and Iftar (breaking fast) times
- Daily Ramadan spiritual objectives and reminders
- General Ramadan questions and Islamic guidance

Use the tools available to you to look up real data. When mentioning times, always clarify which prayer they belong to.
Keep your responses warm, concise, and helpful.`;

  while (true) {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system,
      messages,
      tools,
    });

    // Add Claude's response to message history
    messages.push({ role: 'assistant', content: response.content });

    // Claude is done — return the final text
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find((b) => b.type === 'text');
      return textBlock ? textBlock.text : 'No response generated.';
    }

    // Claude wants to use one or more tools
    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use');
      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        let content;
        try {
          content = await callTool(toolUse.name, toolUse.input);
        } catch (err) {
          content = `Error: ${err.message}`;
        }
        toolResults.push({ type: 'tool_result', tool_use_id: toolUse.id, content });
      }

      // Send tool results back to Claude
      messages.push({ role: 'user', content: toolResults });
    }
  }
}

module.exports = { runAgent };
