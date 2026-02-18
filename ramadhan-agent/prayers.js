async function fetchPrayerTimes(city, country) {
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;

  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error(`Network error fetching prayer times: ${err.message}`);
  }

  if (!res.ok) {
    throw new Error(`Aladhan API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.code !== 200 || !json.data) {
    throw new Error(`Aladhan API returned unexpected response: ${JSON.stringify(json)}`);
  }

  const { timings, date } = json.data;
  const hijri = date.hijri;

  return {
    fajr: timings.Fajr,
    dhuhr: timings.Dhuhr,
    asr: timings.Asr,
    maghrib: timings.Maghrib,
    isha: timings.Isha,
    hijriDay: parseInt(hijri.day, 10),
    hijriMonth: parseInt(hijri.month.number, 10),
    hijriYear: parseInt(hijri.year, 10),
    hijriMonthName: hijri.month.en,
  };
}

module.exports = { fetchPrayerTimes };
