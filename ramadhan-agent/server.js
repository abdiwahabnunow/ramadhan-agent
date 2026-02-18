const http = require('http');
const { URL } = require('url');
const { fetchPrayerTimes } = require('./prayers');
const { getDailyObjective } = require('./objectives');
const { runAgent } = require('./agent');

const PORT = 3000;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPage({ city, country, data, error } = {}) {
  const cityVal = escapeHtml(city || '');
  const countryVal = escapeHtml(country || '');

  let resultsHtml = '';

  if (error) {
    resultsHtml = `<div class="error">${escapeHtml(error)}</div>`;
  } else if (data) {
    const { fajr, dhuhr, asr, maghrib, isha, hijriDay, hijriMonth, hijriMonthName, hijriYear } = data;
    const isRamadan = hijriMonth === 9;
    const ramadanDay = isRamadan ? hijriDay : 1;
    const objective = getDailyObjective(ramadanDay);

    const hijriLabel = `${hijriDay} ${hijriMonthName} ${hijriYear} AH`;
    const ramadanLabel = isRamadan
      ? `Ramadan Day ${ramadanDay}`
      : `Not currently Ramadan (${hijriMonthName})`;

    resultsHtml = `
      <div class="results">
        <div class="location-header">
          <h2>${escapeHtml(city)}, ${escapeHtml(country)}</h2>
          <p class="hijri">${escapeHtml(hijriLabel)} &mdash; ${escapeHtml(ramadanLabel)}</p>
        </div>

        <div class="highlight-cards">
          <div class="card suhur">
            <div class="card-label">Suhur ends</div>
            <div class="card-time">${escapeHtml(fajr)}</div>
            <div class="card-sub">Fajr prayer</div>
          </div>
          <div class="card iftar">
            <div class="card-label">Iftar begins</div>
            <div class="card-time">${escapeHtml(maghrib)}</div>
            <div class="card-sub">Maghrib prayer</div>
          </div>
        </div>

        <table class="prayer-table">
          <thead>
            <tr><th>Prayer</th><th>Time</th></tr>
          </thead>
          <tbody>
            <tr><td>Fajr</td><td>${escapeHtml(fajr)}</td></tr>
            <tr><td>Dhuhr</td><td>${escapeHtml(dhuhr)}</td></tr>
            <tr><td>Asr</td><td>${escapeHtml(asr)}</td></tr>
            <tr><td>Maghrib</td><td>${escapeHtml(maghrib)}</td></tr>
            <tr><td>Isha</td><td>${escapeHtml(isha)}</td></tr>
          </tbody>
        </table>

        <div class="objective">
          <div class="objective-label">Daily Objective</div>
          <p>${escapeHtml(objective)}</p>
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ramadan Agent</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #0d1117;
      color: #e6d9b8;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    header {
      text-align: center;
      margin-bottom: 2rem;
    }

    header h1 {
      font-size: 2rem;
      color: #d4a017;
      letter-spacing: 0.05em;
    }

    header p {
      color: #7ea87e;
      margin-top: 0.4rem;
      font-size: 0.95rem;
    }

    .form-card {
      background: #161b22;
      border: 1px solid #2a3040;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      width: 100%;
      max-width: 480px;
      margin-bottom: 2rem;
    }

    .form-card form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: flex;
      gap: 0.75rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.35rem;
    }

    label {
      font-size: 0.8rem;
      color: #7ea87e;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input[type="text"] {
      background: #0d1117;
      border: 1px solid #2a3040;
      border-radius: 8px;
      padding: 0.6rem 0.8rem;
      color: #e6d9b8;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }

    input[type="text"]:focus {
      border-color: #d4a017;
    }

    input[type="text"]::placeholder {
      color: #4a5568;
    }

    button[type="submit"] {
      background: #d4a017;
      color: #0d1117;
      border: none;
      border-radius: 8px;
      padding: 0.7rem 1.2rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }

    button[type="submit"]:hover {
      background: #e6b52a;
    }

    .error {
      background: #2a1515;
      border: 1px solid #7a2020;
      border-radius: 10px;
      color: #e07070;
      padding: 1rem 1.5rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
    }

    .results {
      width: 100%;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .location-header {
      text-align: center;
    }

    .location-header h2 {
      font-size: 1.5rem;
      color: #d4a017;
    }

    .hijri {
      color: #7ea87e;
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }

    .highlight-cards {
      display: flex;
      gap: 1rem;
    }

    .card {
      flex: 1;
      border-radius: 12px;
      padding: 1.2rem;
      text-align: center;
    }

    .card.suhur {
      background: #1a1f2e;
      border: 1px solid #2a3a5a;
    }

    .card.iftar {
      background: #1e1a10;
      border: 1px solid #5a4a10;
    }

    .card-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #7ea87e;
      margin-bottom: 0.5rem;
    }

    .card.iftar .card-label {
      color: #c8a84b;
    }

    .card-time {
      font-size: 2rem;
      font-weight: 700;
      color: #e6d9b8;
      letter-spacing: 0.03em;
    }

    .card-sub {
      font-size: 0.8rem;
      color: #4a5568;
      margin-top: 0.3rem;
    }

    .prayer-table {
      width: 100%;
      border-collapse: collapse;
      background: #161b22;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #2a3040;
    }

    .prayer-table th {
      background: #1e2430;
      color: #d4a017;
      text-transform: uppercase;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      padding: 0.7rem 1.2rem;
      text-align: left;
    }

    .prayer-table td {
      padding: 0.7rem 1.2rem;
      border-top: 1px solid #1e2430;
      font-size: 1rem;
    }

    .prayer-table tr:hover td {
      background: #1a2030;
    }

    .objective {
      background: #161b22;
      border: 1px solid #2a3040;
      border-left: 3px solid #7ea87e;
      border-radius: 10px;
      padding: 1.2rem 1.4rem;
    }

    .objective-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #7ea87e;
      margin-bottom: 0.6rem;
    }

    .objective p {
      line-height: 1.6;
      color: #c8bfa0;
    }

    /* ── Chat Agent ── */
    .chat-section {
      width: 100%;
      max-width: 520px;
      margin-top: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .chat-section h3 {
      color: #d4a017;
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .chat-section h3 span {
      color: #7ea87e;
      font-size: 0.8rem;
      text-transform: none;
      letter-spacing: 0;
      margin-left: 0.5rem;
    }

    #chat-history {
      background: #161b22;
      border: 1px solid #2a3040;
      border-radius: 10px;
      padding: 1rem;
      min-height: 120px;
      max-height: 360px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .chat-empty {
      color: #4a5568;
      font-size: 0.9rem;
      text-align: center;
      margin: auto;
    }

    .chat-msg {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      max-width: 90%;
    }

    .chat-msg.user { align-self: flex-end; }
    .chat-msg.assistant { align-self: flex-start; }

    .chat-msg .bubble {
      padding: 0.6rem 0.9rem;
      border-radius: 10px;
      line-height: 1.55;
      font-size: 0.95rem;
    }

    .chat-msg.user .bubble {
      background: #1e2a3a;
      border: 1px solid #2a4060;
      color: #c8d8e8;
    }

    .chat-msg.assistant .bubble {
      background: #1a2010;
      border: 1px solid #3a4a20;
      color: #d8e8c8;
    }

    .chat-msg.error .bubble {
      background: #2a1515;
      border: 1px solid #7a2020;
      color: #e07070;
    }

    .chat-input-row {
      display: flex;
      gap: 0.5rem;
    }

    #chat-input {
      flex: 1;
      background: #0d1117;
      border: 1px solid #2a3040;
      border-radius: 8px;
      padding: 0.65rem 0.9rem;
      color: #e6d9b8;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }

    #chat-input:focus { border-color: #d4a017; }
    #chat-input::placeholder { color: #4a5568; }

    #chat-send {
      background: #7ea87e;
      color: #0d1117;
      border: none;
      border-radius: 8px;
      padding: 0.65rem 1.1rem;
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }

    #chat-send:hover { background: #95c295; }
    #chat-send:disabled { background: #3a5a3a; cursor: not-allowed; }
  </style>
</head>
<body>
  <header>
    <h1>&#9728; Ramadan Agent</h1>
    <p>Prayer times, Suhur &amp; Iftar, and daily objectives</p>
  </header>

  <div class="form-card">
    <form method="GET" action="/">
      <div class="form-row">
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" id="city" name="city" value="${cityVal}" placeholder="London" required>
        </div>
        <div class="form-group">
          <label for="country">Country</label>
          <input type="text" id="country" name="country" value="${countryVal}" placeholder="UK" required>
        </div>
      </div>
      <button type="submit">Get Prayer Times</button>
    </form>
  </div>

  ${resultsHtml}

  <div class="chat-section">
    <h3>Ask the Agent <span>powered by Claude</span></h3>
    <div id="chat-history">
      <p class="chat-empty">Ask me anything — e.g. "When is Iftar in Cairo today?" or "What's the Day 10 Ramadan objective?"</p>
    </div>
    <div class="chat-input-row">
      <input type="text" id="chat-input" placeholder="Type your question..." autocomplete="off">
      <button id="chat-send">Send</button>
    </div>
  </div>

  <script>
    const history = document.getElementById('chat-history');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    let firstMessage = true;

    function addMessage(role, text) {
      if (firstMessage) {
        history.innerHTML = '';
        firstMessage = false;
      }
      const div = document.createElement('div');
      div.className = 'chat-msg ' + role;
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text;
      div.appendChild(bubble);
      history.appendChild(div);
      history.scrollTop = history.scrollHeight;
    }

    async function sendMessage() {
      const msg = input.value.trim();
      if (!msg) return;
      input.value = '';
      sendBtn.disabled = true;
      addMessage('user', msg);

      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg }),
        });
        const data = await res.json();
        if (data.error) {
          addMessage('error', 'Error: ' + data.error);
        } else {
          addMessage('assistant', data.response);
        }
      } catch (err) {
        addMessage('error', 'Network error: ' + err.message);
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  </script>
</body>
</html>`;
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const base = `http://${req.headers.host}`;
  const url = new URL(req.url, base);

  // POST /chat — agent endpoint
  if (req.method === 'POST' && url.pathname === '/chat') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
      const body = await readBody(req);
      const { message } = JSON.parse(body);
      if (!message || typeof message !== 'string') {
        res.end(JSON.stringify({ error: 'message field required' }));
        return;
      }
      const response = await runAgent(message);
      res.end(JSON.stringify({ response }));
    } catch (err) {
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (url.pathname !== '/') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  const city = url.searchParams.get('city') || '';
  const country = url.searchParams.get('country') || '';

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  if (!city || !country) {
    res.end(renderPage());
    return;
  }

  try {
    const data = await fetchPrayerTimes(city, country);
    res.end(renderPage({ city, country, data }));
  } catch (err) {
    res.end(renderPage({ city, country, error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Ramadan Agent running at http://localhost:${PORT}`);
});
