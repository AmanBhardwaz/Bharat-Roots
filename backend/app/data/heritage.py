HERITAGE_SITES = [
    {
        "id": 1,
        "name": "Taj Mahal",
        "city": "Agra",
        "state": "Uttar Pradesh",
        "category": "Monument",
        "year": "17th Century",
        "verified": True,
        "description": "An iconic monument of India's Mughal heritage.",
    },

    {
        "id": 2,
        "name": "Hawa Mahal",
        "city": "Jaipur",
        "state": "Rajasthan",
        "category": "Monument",
        "year": "1799",
        "verified": True,
        "description": "One of Jaipur's most recognizable heritage monuments.",
    },

    {
        "id": 3,
        "name": "Qutub Minar",
        "city": "Delhi",
        "state": "Delhi",
        "category": "Monument",
        "year": "12th Century",
        "verified": True,
        "description": "A major historic monument of Delhi.",
    },

    {
        "id": 4,
        "name": "Konark Sun Temple",
        "city": "Konark",
        "state": "Odisha",
        "category": "Temple",
        "year": "13th Century",
        "verified": True,
        "description": "An important example of Odisha's temple heritage.",
    },
]


def find_heritage_site(name: str):

    name = name.lower().strip()

    for site in HERITAGE_SITES:
        if site["name"].lower() == name:
            return site

    return None