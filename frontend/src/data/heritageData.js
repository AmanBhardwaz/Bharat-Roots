import konarkImage from "../assets/konark.jpg";
import redFortImage from "../assets/red_fort.jpeg";
import ajantaImage from "../assets/ajanta.jpg";
import meenakshiImage from "../assets/meenakshi_temple.jpeg";
import goldenTempleImage from "../assets/golden temple.jpeg";
import sanchiStupaImage from "../assets/sachi_stupa.webp";

export const heritageSites = [
  {
    id: 1,
    name: "Taj Mahal",
    city: "Agra",
    state: "Uttar Pradesh",
    category: "Monument",
    year: "1632-1653 AD",
    latitude: 27.1751,
    longitude: 78.0421,
    description:
      "An iconic white marble mausoleum built by Emperor Shah Jahan in memory of Mumtaz Mahal. Recognized globally as a masterpiece of Mughal architecture.",
    history:
      "Construction began in 1632 and was completed in 1653 by over 20,000 artisans. It represents the pinnacle of Mughal art and architecture in India.",
    significance:
      "A UNESCO World Heritage Site and one of the New 7 Wonders of the World, symbolising romance, art, and architectural perfection.",
    facts: [
      "Appears to change color depending on the sun and moonlight.",
      "The four minarets lean outward slightly to protect the main tomb from earthquakes.",
      "Over 20,000 artisans worked on its construction across 20 years.",
      "Features intricate Pietra Dura stone inlay craftsmanship.",
      "Rests on a special timber foundation kept moist by the Yamuna River.",
    ],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: 2,
    name: "Hawa Mahal",
    city: "Jaipur",
    state: "Rajasthan",
    category: "Palace",
    year: "1799 AD",
    latitude: 26.9239,
    longitude: 75.8267,
    description:
      "One of Jaipur's most recognizable heritage monuments, renowned for its red-and-pink sandstone façade featuring 953 jharokhas (windows).",
    history:
      "Built in 1799 by Maharaja Sawai Pratap Singh so royal women could observe city festivals without being seen.",
    significance:
      "A landmark fusion of Rajput and Mughal architecture designed to resemble Lord Krishna's crown.",
    facts: [
      "Features 953 small carved windows providing natural air conditioning.",
      "Built without a traditional deep foundation.",
      "Designed in the shape of Lord Krishna's crown.",
      "Ramps were used inside instead of stairs to move palanquins.",
      "The front facade actually functions as the rear wall of the City Palace complex.",
    ],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: 3,
    name: "Qutub Minar",
    city: "Delhi",
    state: "Delhi",
    category: "Monument",
    year: "1192 AD",
    latitude: 28.5245,
    longitude: 77.1855,
    description:
      "A 73-meter tall red sandstone victory tower and UNESCO World Heritage monument located in Mehrauli, Delhi.",
    history:
      "Commissioned by Qutb-ud-din Aibak in 1192 and completed by his successors. It marks the start of the Delhi Sultanate era.",
    significance:
      "The world's tallest brick minaret, surrounded by ancient ruins including the 1,600-year-old rust-free Iron Pillar.",
    facts: [
      "Stands at 72.5 meters with 379 spiral steps inside.",
      "Contains a 1,600-year-old iron pillar that has never rusted.",
      "Five storeys with distinct balconies and Quranic inscriptions.",
      "Built using materials from historic early Mehrauli structures.",
      "Declared a UNESCO World Heritage site in 1993.",
    ],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: 4,
    name: "Konark Sun Temple",
    city: "Konark",
    state: "Odisha",
    category: "Temple",
    year: "1250 AD",
    latitude: 19.8876,
    longitude: 86.0945,
    description:
      "A monumental 13th-century Sun Temple built like a grand stone chariot with 24 carved wheels pulled by seven horses.",
    history:
      "Constructed by King Narasimhadeva I of the Eastern Ganga Dynasty around 1250 AD. Known historically as the 'Black Pagoda'.",
    significance:
      "A UNESCO World Heritage Site celebrating Kalinga architecture and solar astronomy.",
    facts: [
      "The stone wheels work as accurate sundials.",
      "Built to align with the first rays of the rising sun.",
      "Shaped as a colossal 12-wheeled chariot pulled by 7 stone horses.",
      "Took 1,200 craftsmen 12 years to construct.",
      "Famous for intricate stone relief sculptures.",
    ],
    verified: true,
    image: konarkImage,
  },

  {
    id: 5,
    name: "Red Fort",
    city: "Delhi",
    state: "Delhi",
    category: "Fort",
    year: "1638-1648 AD",
    latitude: 28.6562,
    longitude: 77.2410,
    description:
      "An impressive red sandstone fortress in Old Delhi that served as the main seat of Mughal power for over two centuries.",
    history:
      "Built by Emperor Shah Jahan when shifting his capital to Delhi. It became the backdrop for India's Independence celebrations in 1947.",
    significance:
      "A UNESCO World Heritage Site and national symbol where India's Prime Minister hoists the national flag on Independence Day.",
    facts: [
      "Originally painted white before lime coating wore away.",
      "Housed the Peacock Throne and Koh-i-Noor diamond.",
      "Features the iconic Lahori Gate and Diwan-i-Khas.",
      "Covers over 250 acres along the Yamuna River bank.",
      "Hosts annual Independence Day national celebrations.",
    ],
    verified: true,
    image: redFortImage,
  },

  {
    id: 6,
    name: "Ajanta & Ellora Caves",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    category: "Cave Temple",
    year: "2nd Century BCE - 10th Century CE",
    latitude: 20.5519,
    longitude: 75.7033,
    description:
      "World-famous rock-cut cave temples carved directly into solid mountain cliffs, containing ancient murals and monolithic sculptures.",
    history:
      "Ajanta features 30 Buddhist caves dating back to 2nd century BCE, while Ellora features 34 Hindu, Buddhist, and Jain caves carved between 6th and 10th century CE.",
    significance:
      "UNESCO World Heritage sites exemplifying ancient Indian rock-cut engineering and religious harmony.",
    facts: [
      "Ellora's Kailasa Temple is the world's largest single monolithic rock excavation.",
      "200,000 tons of rock were excavated top-down over 18 years.",
      "Ajanta murals used natural mineral colors lasting over 1,500 years.",
      "Rediscovered by a British officer during a hunting trip in 1819.",
      "Showcases Buddhist, Hindu, and Jain caves standing together.",
    ],
    verified: true,
    image: ajantaImage,
  },

  {
    id: 7,
    name: "Gateway of India",
    city: "Mumbai",
    state: "Maharashtra",
    category: "Monument",
    year: "1924 AD",
    latitude: 18.9220,
    longitude: 72.8347,
    description:
      "A grand 26-meter basalt arch standing at Apollo Bunder in Mumbai overlooking the Arabian Sea.",
    history:
      "Erected to commemorate the visit of King George V in 1911. Completed in 1924, it later marked the exit of British troops in 1948.",
    significance:
      "Mumbai's signature landmark blending Indo-Saracenic design with Hindu and Muslim decorative arches.",
    facts: [
      "Last British battalion marched through this arch upon leaving India in 1948.",
      "Built using yellow basalt and reinforced concrete.",
      "Stands 26 meters tall with a central 15-meter dome.",
      "Serves as the departure point for ferry boats to Elephanta Caves.",
      "Designed by Scottish architect George Wittet.",
    ],
    verified: true,
    image:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: 8,
    name: "Meenakshi Temple",
    city: "Madurai",
    state: "Tamil Nadu",
    category: "Temple",
    year: "6th Century CE / 16th Century",
    latitude: 9.9195,
    longitude: 78.1193,
    description:
      "A vibrant Dravidian temple complex featuring 14 towering gopurams decorated with over 33,000 colorful stone sculptures.",
    history:
      "Ancient temple mentioned in early Tamil texts, expanded to its current splendour under the Nayak rulers of Madurai.",
    significance:
      "A primary pilgrimage site and architectural marvel of South India dedicated to Goddess Meenakshi and Lord Sundareswarar.",
    facts: [
      "Contains 14 entrance towers (gopurams) up to 52 meters tall.",
      "Adorned with over 33,000 colorful stone statues and relief figures.",
      "Features a famous Hall of 1,000 Pillars made of solid granite.",
      "Welcomes over 15,000 visitors every day.",
      "Houses the sacred Golden Lotus Tank at its core.",
    ],
    verified: true,
    image: meenakshiImage,
  },

  {
    id: 9,
    name: "Golden Temple",
    city: "Amritsar",
    state: "Punjab",
    category: "Shrine",
    year: "1577 AD",
    latitude: 31.6200,
    longitude: 74.8765,
    description:
      "Sri Harmandir Sahib, the spiritual center of Sikhism, famous for its gilded gold sanctuary floating in the Amrit Sarovar lake.",
    history:
      "Founded by Guru Ram Das in 1577. Maharaja Ranjit Singh gilded the upper structure in 750 kg of pure gold leaf in 1830.",
    significance:
      "A universal emblem of equality, compassion, and peace where thousands of pilgrims dine free at the community kitchen daily.",
    facts: [
      "Operates a free community kitchen (Langar) serving up to 100,000 people daily.",
      "Gilded with 750 kg of pure 24-karat gold.",
      "Has 4 open doors welcoming people of all backgrounds and faiths.",
      "Surrounded by the sacred Amrit Sarovar water tank.",
      "Foundation stone was laid by Sufi saint Mian Mir.",
    ],
    verified: true,
    image: goldenTempleImage,
  },

  {
    id: 10,
    name: "Sanchi Stupa",
    city: "Sanchi",
    state: "Madhya Pradesh",
    category: "Buddhist Stupa",
    year: "3rd Century BCE",
    latitude: 23.4793,
    longitude: 77.7397,
    description:
      "One of India's oldest stone monuments, featuring a massive hemispherical dome and four intricately carved Torana gateways.",
    history:
      "Commissioned by Mauryan Emperor Ashoka in 3rd century BCE to enshrine relics of Lord Buddha.",
    significance:
      "A UNESCO World Heritage Site regarded as a masterpiece of early Buddhist artistic expression.",
    facts: [
      "Four stone gateways depict stories from the life of Buddha (Jataka tales).",
      "Buddha is represented by symbols like wheels, lotus flowers, and footprints.",
      "Featured on the reverse side of the 200 Indian Rupee currency note.",
      "Commissioned by Emperor Ashoka the Great.",
      "Surrounded by ancient monastic ruins atop a quiet hill.",
    ],
    verified: true,
    image: sanchiStupaImage,
  },
];