function showPrayerTimes(prayerData, objective, city, country) {
  const { fajr, dhuhr, asr, maghrib, isha, hijriDay, hijriMonthName, hijriYear } = prayerData;

  const line = '─'.repeat(50);
  const doubleLine = '═'.repeat(50);

  console.log('\n' + doubleLine);
  console.log('  ☪   RAMADAN PRAYER TIMES');
  console.log(`  ${city}, ${country}`);
  console.log(`  ${hijriMonthName} ${hijriDay}, ${hijriYear} AH`);
  console.log(doubleLine);

  console.log('\n  *** SUHUR ends at (Fajr): ' + fajr + ' ***');
  console.log('\n' + line);
  console.log('  Daily Prayers:');
  console.log(line);
  console.log(`  Fajr    (Dawn)      :  ${fajr}`);
  console.log(`  Dhuhr   (Midday)    :  ${dhuhr}`);
  console.log(`  Asr     (Afternoon) :  ${asr}`);
  console.log(`  Maghrib (Sunset)    :  ${maghrib}`);
  console.log(`  Isha    (Night)     :  ${isha}`);
  console.log(line);

  console.log('\n  *** IFTAR at (Maghrib): ' + maghrib + ' ***');

  console.log('\n' + doubleLine);
  console.log('  RAMADAN DAY ' + hijriDay + ' — DAILY OBJECTIVE');
  console.log(doubleLine);
  console.log('\n  ' + objective);
  console.log('\n' + doubleLine + '\n');
}

module.exports = { showPrayerTimes };
