const { getContext } = require('./context');
const { fetchPrayerTimes } = require('./prayers');
const { getDailyObjective } = require('./objectives');
const { showPrayerTimes } = require('./display');

async function main() {
  const { city, country } = getContext();

  console.log(`\nFetching prayer times for ${city}, ${country}...`);

  let prayerData;
  try {
    prayerData = await fetchPrayerTimes(city, country);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { hijriDay, hijriMonth } = prayerData;

  // Ramadan is month 9 in the Hijri calendar
  let ramadanDay = hijriMonth === 9 ? hijriDay : 1;

  const objective = getDailyObjective(ramadanDay);
  showPrayerTimes(prayerData, objective, city, country);
}

main();
