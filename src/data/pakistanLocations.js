// ---------- Pakistan: Country -> Provinces -> Cities -> Districts ----------
// Cities have coordinates (instant fetch); all 160+ districts are indexed
// by name and resolved through the geocoding API when selected.

export const PAKISTAN = {
  name: "Pakistan",
  ur: "پاکستان",
  lat: 30.3753,
  lon: 69.3451,
  provinces: [
    {
      name: "Punjab",
      ur: "پنجاب",
      lat: 31.0,
      lon: 72.5,
      cities: [
        { name: "Lahore", ur: "لاہور", lat: 31.5204, lon: 74.3587 },
        { name: "Faisalabad", ur: "فیصل آباد", lat: 31.4504, lon: 73.135 },
        { name: "Rawalpindi", ur: "راولپنڈی", lat: 33.6083, lon: 73.0695 },
        { name: "Gujranwala", ur: "گوجرانوالہ", lat: 32.1877, lon: 74.1719 },
        { name: "Multan", ur: "ملتان", lat: 30.1575, lon: 71.5249 },
        { name: "Bahawalpur", ur: "بہاولپور", lat: 29.3956, lon: 71.6722 },
        { name: "Sargodha", ur: "سرگودھا", lat: 32.0825, lon: 72.6714 },
        { name: "Sialkot", ur: "سیالکوٹ", lat: 32.4946, lon: 74.526 },
        { name: "Sahiwal", ur: "ساہیوال", lat: 30.6777, lon: 73.1063 },
        { name: "Gujrat", ur: "گجرات", lat: 32.5723, lon: 74.0779 },
        { name: "Jhang", ur: "جھنگ", lat: 31.3044, lon: 72.3165 },
        { name: "Dera Ghazi Khan", ur: "ڈیرہ غازی خان", lat: 30.0497, lon: 70.6439 },
        { name: "Muzaffargarh", ur: "مظفر گڑھ", lat: 30.0727, lon: 71.1897 },
      ],
      districts: [
        "Attock", "Bahawalnagar", "Bahawalpur", "Bhakkar", "Chakwal", "Chiniot",
        "Dera Ghazi Khan", "Faisalabad", "Gujranwala", "Gujrat", "Hafizabad",
        "Jhang", "Jhelum", "Kasur", "Khanewal", "Khushab", "Lahore", "Layyah",
        "Lodhran", "Mianwali", "Multan", "Muzaffargarh", "Nankana Sahib",
        "Narowal", "Okara", "Pakpattan", "Rahim Yar Khan", "Rajanpur",
        "Rawalpindi", "Sahiwal", "Sargodha", "Sheikhupura", "Sialkot",
        "Taunsa", "Toba Tek Singh", "Vehari",
      ],
    },
    {
      name: "Sindh",
      ur: "سندھ",
      lat: 25.5,
      lon: 68.5,
      cities: [
        { name: "Karachi", ur: "کراچی", lat: 24.8607, lon: 67.0011 },
        { name: "Hyderabad", ur: "حیدرآباد", lat: 25.3959, lon: 68.3578 },
        { name: "Sukkur", ur: "سکھر", lat: 27.7042, lon: 68.8613 },
        { name: "Larkana", ur: "لاڑکانہ", lat: 27.5598, lon: 68.2123 },
        { name: "Mirpur Khas", ur: "میرپورخاص", lat: 24.8597, lon: 69.1552 },
        { name: "Jacobabad", ur: "جیکب آباد", lat: 28.2831, lon: 68.4459 },
        { name: "Shikarpur", ur: "شکارپور", lat: 27.9869, lon: 68.6353 },
        { name: "Dadu", ur: "دادو", lat: 26.7309, lon: 67.7789 },
        { name: "Thatta", ur: "ٹهٹہ", lat: 24.7471, lon: 67.9239 },
        { name: "Khairpur", ur: "خیرپور", lat: 27.5298, lon: 68.7554 },
      ],
      districts: [
        "Badin", "Dadu", "Ghotki", "Hyderabad", "Jacobabad", "Karachi Central",
        "Karachi East", "Karachi South", "Karachi West", "Kashmore", "Khairpur",
        "Kambar Shahdadkot", "Korangi", "Larkana", "Malir", "Matiari",
        "Mirpur Khas", "Naushahro Feroze", "Sanghar", "Shaheed Benazirabad",
        "Shikarpur", "Sujawal", "Sukkur", "Tando Allahyar", "Tando Muhammad Khan",
        "Tharparkar", "Thatta", "Umerkot",
      ],
    },
    {
      name: "Khyber Pakhtunkhwa",
      ur: "خیبر پختونخوا",
      lat: 34.0,
      lon: 71.5,
      cities: [
        { name: "Peshawar", ur: "پشاور", lat: 34.0151, lon: 71.5249 },
        { name: "Abbottabad", ur: "ایبٹ آباد", lat: 34.1517, lon: 73.2244 },
        { name: "Mingora", ur: "منگورہ", lat: 34.7655, lon: 72.3645 },
        { name: "Mardan", ur: "مردان", lat: 34.2088, lon: 72.0429 },
        { name: "Dera Ismail Khan", ur: "ڈیرہ اسماعیل خان", lat: 31.8374, lon: 70.9056 },
        { name: "Kohat", ur: "کوہاٹ", lat: 33.5776, lon: 71.4595 },
        { name: "Chitral", ur: "چترال", lat: 35.8519, lon: 71.7864 },
        { name: "Swabi", ur: "صوابی", lat: 34.1266, lon: 72.4693 },
        { name: "Bannu", ur: "بنوں", lat: 32.9907, lon: 70.6011 },
        { name: "Mansehra", ur: "مانسہرہ", lat: 34.3929, lon: 73.2417 },
        { name: "Haripur", ur: "ہری پور", lat: 33.9936, lon: 72.9332 },
        { name: "Charsadda", ur: "چارسدہ", lat: 34.1497, lon: 71.7586 },
        { name: "Nowshera", ur: "نوشہرہ", lat: 34.0079, lon: 71.9829 },
        { name: "Hangu", ur: "ہنگو", lat: 33.4696, lon: 71.4458 },
        { name: "Tank", ur: "ٹانک", lat: 32.2162, lon: 70.5835 },
      ],
      districts: [
        "Abbottabad", "Bajaur", "Bannu", "Battagram", "Buner", "Charsadda",
        "Chitral", "Dera Ismail Khan", "Hangu", "Haripur", "Khyber", "Kohat",
        "Kolai-Palas", "Kurram", "Lakki Marwat", "Lower Dir", "Lower Kohistan",
        "Malakand", "Mansehra", "Mardan", "Mohmand", "North Waziristan",
        "Nowshera", "Orakzai", "Peshawar", "Shangla", "South Waziristan",
        "Swabi", "Swat", "Tank", "Torghar", "Upper Dir", "Upper Kohistan",
      ],
    },
    {
      name: "Balochistan",
      ur: "بلوچستان",
      lat: 29.5,
      lon: 66.5,
      cities: [
        { name: "Quetta", ur: "کوئٹہ", lat: 30.1798, lon: 66.975 },
        { name: "Gwadar", ur: "گوادر", lat: 25.1268, lon: 62.3387 },
        { name: "Sibi", ur: "سبی", lat: 29.7463, lon: 67.874 },
        { name: "Khuzdar", ur: "خضدار", lat: 27.7937, lon: 66.638 },
        { name: "Turbat", ur: "تربت", lat: 26.0064, lon: 63.0466 },
        { name: "Kalat", ur: "کلات", lat: 29.0298, lon: 66.5923 },
        { name: "Zhob", ur: "ژوب", lat: 31.3386, lon: 69.4462 },
        { name: "Chaman", ur: "چمن", lat: 31.0167, lon: 66.45 },
        { name: "Kharan", ur: "خران", lat: 28.5775, lon: 65.4167 },
        { name: "Panjgur", ur: "پنجگور", lat: 26.9756, lon: 64.1022 },
        { name: "Hub", ur: "حب", lat: 25.2833, lon: 66.9333 },
        { name: "Mastung", ur: "مستونگ", lat: 29.7997, lon: 66.8475 },
        { name: "Ziarat", ur: "زیارت", lat: 30.3667, lon: 66.9167 },
        { name: "Nushki", ur: "نوشکی", lat: 29.5556, lon: 66.0167 },
      ],
      districts: [
        "Awaran", "Barkhan", "Chagai", "Chaman", "Dera Bugti", "Duki", "Gwadar",
        "Harnai", "Hub", "Jafarabad", "Jhal Magsi", "Kech", "Kharan", "Khuzdar",
        "Killa Abdullah", "Killa Saifullah", "Kohlu", "Lasbela", "Loralai",
        "Mastung", "Musakhel", "Nasirabad", "Nushki", "Panjgur", "Pishin",
        "Quetta", "Sibi", "Sherani", "Sohbatpur", "Surab", "Usta Muhammad",
        "Washuk", "Zhob", "Ziarat", "Kalat",
      ],
    },
    {
      name: "Gilgit-Baltistan",
      ur: "گلگت بلتستان",
      lat: 35.7,
      lon: 75.0,
      cities: [
        { name: "Gilgit", ur: "گلگت", lat: 35.922, lon: 74.3111 },
        { name: "Skardu", ur: "سکردو", lat: 35.2996, lon: 75.6325 },
        { name: "Chilas", ur: "چلاس", lat: 35.6077, lon: 74.6548 },
        { name: "Astore", ur: "استور", lat: 35.5709, lon: 74.8515 },
        { name: "Aliabad", ur: "علی آباد", lat: 36.3167, lon: 74.7167 },
        { name: "Khaplu", ur: "کھپلو", lat: 35.1667, lon: 76.2333 },
        { name: "Shigar", ur: "شگر", lat: 35.4167, lon: 75.7833 },
        { name: "Nagar", ur: "نگر", lat: 36.1833, lon: 74.8333 },
      ],
      districts: [
        "Astore", "Chilas", "Darel", "Ghanche", "Gilgit", "Gupis-Yasin", "Ghizer",
        "Hunza", "Kharmang", "Nagar", "Roundu", "Shigar", "Skardu", "Tangir",
      ],
    },
    {
      name: "Azad Kashmir",
      ur: "آزاد کشمیر",
      lat: 34.0,
      lon: 73.7,
      cities: [
        { name: "Muzaffarabad", ur: "مظفرآباد", lat: 34.3578, lon: 73.4722 },
        { name: "Mirpur", ur: "میرپور", lat: 33.7446, lon: 73.7784 },
        { name: "Bagh", ur: "باغ", lat: 33.981, lon: 73.7758 },
        { name: "Kotli", ur: "کوٹلی", lat: 33.5167, lon: 73.8833 },
        { name: "Bhimber", ur: "بھمبر", lat: 33.0833, lon: 73.7833 },
        { name: "Rawalakot", ur: "راولاکوٹ", lat: 33.8533, lon: 73.7567 },
      ],
      districts: [
        "Bagh", "Bhimber", "Haveli", "Hattian Bala", "Kotli", "Mirpur",
        "Muzaffarabad", "Neelum", "Poonch", "Sudhanoti",
      ],
    },
    {
      name: "Islamabad Capital Territory",
      ur: "اسلام آباد دارالحکومت",
      lat: 33.6844,
      lon: 73.0479,
      cities: [
        { name: "Islamabad", ur: "اسلام آباد", lat: 33.6844, lon: 73.0479 },
      ],
      districts: ["Islamabad", "Rawat", "Tarnol", "Barakahu"],
    },
  ],
};

/**
 * Search the built-in Pakistan dataset.
 * Returns typed items: country / province / city / district
 */
export function searchLocal(q) {
  const query = q.toLowerCase().trim();
  if (!query) return [];
  const out = [];
  const seen = new Set();

  const push = (item) => {
    const key = `${item.type}:${item.name.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  };

  // Country
  if ("pakistan".includes(query) || PAKISTAN.ur.includes(query)) {
    push({
      id: "pk",
      name: PAKISTAN.name,
      nameUr: PAKISTAN.ur,
      type: "country",
      lat: PAKISTAN.lat,
      lon: PAKISTAN.lon,
    });
  }

  for (const prov of PAKISTAN.provinces) {
    if (prov.name.toLowerCase().includes(query) || prov.ur.includes(query)) {
      push({
        id: `prov-${prov.name}`,
        name: prov.name,
        nameUr: prov.ur,
        type: "province",
        lat: prov.lat,
        lon: prov.lon,
      });
    }

    for (const city of prov.cities) {
      if (city.name.toLowerCase().includes(query) || (city.ur ?? "").includes(query)) {
        push({
          id: `city-${city.name}`,
          name: city.name,
          nameUr: city.ur,
          type: "city",
          admin1: prov.name,
          lat: city.lat,
          lon: city.lon,
        });
      }
    }

    // All districts of the province (skip ones already listed as cities)
    const cityNames = new Set(prov.cities.map((c) => c.name.toLowerCase()));
    for (const d of prov.districts) {
      if (cityNames.has(d.toLowerCase())) continue;
      if (d.toLowerCase().includes(query)) {
        push({
          id: `dist-${d}-${prov.name}`,
          name: d,
          type: "district",
          admin1: prov.name,
          lat: null,
          lon: null,
        });
      }
    }
  }

  return out.slice(0, 30);
}
