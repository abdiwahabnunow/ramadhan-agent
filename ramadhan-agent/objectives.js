const objectives = [
  'Day 1: Set your Ramadan intention (niyyah). Write down 3 goals for this month.',
  'Day 2: Read Surah Al-Fatiha with its tafsir — reflect on what it means to ask Allah for guidance.',
  'Day 3: Make 100 tasbeeh (SubhanAllah, Alhamdulillah, Allahu Akbar) after every prayer.',
  'Day 4: Give any amount of sadaqah today — even a smile is charity.',
  'Day 5: Learn one new name of Allah (Al-Asma Al-Husna) and ponder its meaning.',
  'Day 6: Read 1 juz of the Quran. Stay consistent — this is a daily habit to build.',
  'Day 7: Call or message a family member you haven\'t spoken to in a while.',
  'Day 8: Make dua for the Muslim Ummah around the world — especially those in hardship.',
  'Day 9: Avoid backbiting and gossip today. Reflect in the evening on how it went.',
  'Day 10: The first 10 days are mercy. Ask Allah for His mercy in everything you do today.',
  'Day 11: Perform 2 extra raka\'at of Duha prayer between sunrise and noon.',
  'Day 12: Memorize a short ayah or dua — even just one line is progress.',
  'Day 13: Fast with your eyes, ears, and tongue — be intentional about what you consume today.',
  'Day 14: Cook or share food with someone breaking their fast today.',
  'Day 15: The middle of Ramadan. Reflect: have you grown since Day 1?',
  'Day 16: Read Surah Al-Kahf today — it is a Sunnah of Friday, but full of wisdom any day.',
  'Day 17: Make istighfar (seek forgiveness) 100 times today — "Astaghfirullah".',
  'Day 18: Volunteer or donate to a local food bank or mosque.',
  'Day 19: Write a heartfelt dua list — be specific about what you want from Allah.',
  'Day 20: The last 10 nights begin soon. Prepare: sleep early, plan extra ibadah.',
  'Day 21: The last 10 nights are forgiveness. Increase your night prayers and dua.',
  'Day 22: Make I\'tikaf in your heart if not physically — dedicate today to worship only.',
  'Day 23: Recite Surah Al-Ikhlas 3 times — it equals reciting the whole Quran.',
  'Day 24: Write a letter to yourself for next Ramadan. Who do you want to become?',
  'Day 25: Seek Laylatul Qadr — pray Tarawih, make long sujood, and recite dua.',
  'Day 26: "Allahumma innaka \'afuwwun tuhibbul \'afwa fa\'fu \'anni" — say this 100 times tonight.',
  'Day 27: Give your best sadaqah of Ramadan today — make it significant.',
  'Day 28: Call your parents and ask for their forgiveness and dua.',
  'Day 29: Prepare for Eid. Plan how to keep your Ramadan habits alive after the month.',
  'Day 30: Final day. Make shukr (gratitude). List 10 blessings from this Ramadan.',
];

function getDailyObjective(ramadanDay) {
  const index = Math.min(Math.max(ramadanDay - 1, 0), objectives.length - 1);
  return objectives[index];
}

module.exports = { objectives, getDailyObjective };
