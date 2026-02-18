const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const { fetchPrayerTimes } = require('./prayers');
const { getDailyObjective } = require('./objectives');

// Create the MCP server — this is what Claude Desktop (or any MCP client) connects to
const server = new McpServer({
  name: 'ramadan-agent',
  version: '1.0.0',
});

// Tool 1: fetch_prayer_times
// Claude Desktop can call this when a user asks about prayer times
server.tool(
  'fetch_prayer_times',
  'Fetch Islamic prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) for a given city and country for today. Also returns Hijri date and whether it is Ramadan.',
  {
    city: z.string().describe('The city name, e.g. "London" or "Nairobi"'),
    country: z.string().describe('The country name or code, e.g. "UK" or "Kenya"'),
  },
  async ({ city, country }) => {
    try {
      const data = await fetchPrayerTimes(city, country);
      const isRamadan = data.hijriMonth === 9;
      const text = [
        `Prayer times for ${city}, ${country}`,
        `Date: ${data.hijriDay} ${data.hijriMonthName} ${data.hijriYear} AH`,
        isRamadan ? `Ramadan Day ${data.hijriDay}` : `Not currently Ramadan (${data.hijriMonthName})`,
        '',
        `Fajr (Suhur ends):  ${data.fajr}`,
        `Dhuhr:              ${data.dhuhr}`,
        `Asr:                ${data.asr}`,
        `Maghrib (Iftar):    ${data.maghrib}`,
        `Isha:               ${data.isha}`,
      ].join('\n');
      return { content: [{ type: 'text', text }] };
    } catch (err) {
      return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
    }
  }
);

// Tool 2: get_daily_objective
// Claude Desktop can call this when a user asks about Ramadan goals/objectives
server.tool(
  'get_daily_objective',
  'Get the Ramadan spiritual objective and daily task for a specific day of Ramadan (day 1 to 30).',
  {
    day: z.number().int().min(1).max(30).describe('The day of Ramadan, between 1 and 30'),
  },
  async ({ day }) => {
    const objective = getDailyObjective(day);
    return { content: [{ type: 'text', text: objective }] };
  }
);

// Start the server using stdio transport (standard for Claude Desktop integration)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Note: do not use console.log here — stdio is used for MCP protocol messages
  process.stderr.write('Ramadan Agent MCP server running\n');
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err.message}\n`);
  process.exit(1);
});
