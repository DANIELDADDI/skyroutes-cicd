// ─── Static reference data ────────────────────────────────────────────────────

export const AIRPORTS = [
      { code: "KWI", city: "Kuwait City", country: "Kuwait", name: "Kuwait International Airport" },
      { code: "DXB", city: "Dubai", country: "UAE", name: "Dubai International Airport" },
      { code: "AUH", city: "Abu Dhabi", country: "UAE", name: "Zayed International Airport" },
      { code: "JFK", city: "New York", country: "USA", name: "John F. Kennedy International" },
      { code: "LHR", city: "London", country: "UK", name: "Heathrow Airport" },
      { code: "CDG", city: "Paris", country: "France", name: "Charles de Gaulle Airport" },
      { code: "IST", city: "Istanbul", country: "Turkey", name: "Istanbul Airport" },
      { code: "AMS", city: "Amsterdam", country: "Netherlands", name: "Amsterdam Schiphol" },
      { code: "FRA", city: "Frankfurt", country: "Germany", name: "Frankfurt Airport" },
      { code: "BEY", city: "Beirut", country: "Lebanon", name: "Rafic Hariri International" },
      { code: "CAI", city: "Cairo", country: "Egypt", name: "Cairo International Airport" },
      { code: "RUH", city: "Riyadh", country: "Saudi Arabia", name: "King Khalid International" },
      { code: "JED", city: "Jeddah", country: "Saudi Arabia", name: "King Abdulaziz International" },
      { code: "BAH", city: "Bahrain", country: "Bahrain", name: "Bahrain International Airport" },
      { code: "DOH", city: "Doha", country: "Qatar", name: "Hamad International Airport" },
      { code: "MCT", city: "Muscat", country: "Oman", name: "Muscat International Airport" },
];

export const CURRENCIES = [
      { code: "KWD", symbol: "KD", label: "Kuwaiti Dinar" },
      { code: "USD", symbol: "$", label: "US Dollar" },
      { code: "EUR", symbol: "€", label: "Euro" },
];

export const TODAY = new Date().toISOString().split("T")[0];

export const TRIP_TYPES = [
      { value: "oneway", label: "One Way" },
      { value: "round", label: "Round Trip" },
      { value: "multicity", label: "Multi-City" },
];
