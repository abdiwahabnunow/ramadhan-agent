function getContext() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 && args[i + 1] ? args[i + 1] : null;
  };

  const city = get('--city');
  const country = get('--country');

  if (!city || !country) {
    console.error('Usage: node index.js --city "London" --country "UK"');
    process.exit(1);
  }

  return { city, country, date: new Date() };
}

module.exports = { getContext };
