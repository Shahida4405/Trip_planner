// src/components/ItineraryPlanner.jsx
import { useState } from "react";
import axios from "axios";

const ItineraryPlanner = () => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const generateItinerary = async () => {
    if (!destination || !startDate || !endDate) {
      alert("Please enter destination and dates!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      alert("End date must be after start date!");
      return;
    }

    setLoading(true);
    setError("");
    setItinerary([]);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&appid=${API_KEY}&units=metric`
      );

      if (!res.data.list || res.data.list.length === 0) {
        setError("No weather data found for this city.");
        setLoading(false);
        return;
      }

      const forecastList = res.data.list;

      const plan = Array.from({ length: days }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const dayForecasts = forecastList.filter((item) =>
          item.dt_txt.startsWith(dateStr)
        );

        const morning = dayForecasts.find((f) => f.dt_txt.includes("09:00:00"));
        const afternoon = dayForecasts.find((f) => f.dt_txt.includes("15:00:00"));
        const evening = dayForecasts.find((f) => f.dt_txt.includes("21:00:00"));

        const makeActivity = (forecast, timeOfDay) => {
          if (!forecast) return `No forecast data for ${timeOfDay}.`;

          const weatherMain = forecast.weather[0].main.toLowerCase();
          const temp = forecast.main.temp;
          const description = forecast.weather[0].description;

          const activities = {
            clear: {
              morning: [
                "Outdoor sightseeing at landmarks",
                "Nature walk & photography",
                "Visit local gardens or parks",
              ],
              afternoon: [
                "Local street food tour",
                "Beach or lakeside relaxation",
                "Shopping in open markets",
              ],
              evening: ["Sunset viewpoint", "Open-air concert", "Rooftop dinner"],
            },
            rain: {
              morning: ["Indoor museum visit", "Art gallery exploration", "Cooking class indoors"],
              afternoon: ["Cozy cafe hopping", "Indoor shopping mall", "Aquarium visit"],
              evening: ["Theatre show", "Live music indoors", "Movie night"],
            },
            cloud: {
              morning: ["City guided walking tour", "Local temple or heritage site", "Historical monument visit"],
              afternoon: ["Local market shopping", "Cultural workshops", "Indoor craft stores"],
              evening: ["Rooftop dinner", "Scenic night walk", "Food market evening tour"],
            },
            snow: {
              morning: ["Snow activities like sledding", "Ski or snowboard (if available)", "Cozy cafe with hot drinks"],
              afternoon: ["Visit winter markets", "Indoor spa or hot springs", "Local winter museum"],
              evening: ["Hot chocolate at local cafe", "Indoor entertainment show", "Cozy dinner near fireplace"],
            },
            default: {
              morning: ["General city exploration"],
              afternoon: ["Local dining & shopping"],
              evening: ["Dinner & relaxation"],
            },
          };

          let pool = activities.default;
          if (weatherMain.includes("rain")) pool = activities.rain;
          else if (weatherMain.includes("clear")) pool = activities.clear;
          else if (weatherMain.includes("cloud")) pool = activities.cloud;
          else if (weatherMain.includes("snow")) pool = activities.snow;

          const options = pool[timeOfDay] || activities.default[timeOfDay];
          const activity = options[Math.floor(Math.random() * options.length)];

          return `${activity} (Weather: ${description}, Temp: ${temp}°C)`;
        };

        return {
          day: i + 1,
          date: dateStr,
          morning: makeActivity(morning, "morning"),
          afternoon: makeActivity(afternoon, "afternoon"),
          evening: makeActivity(evening, "evening"),
        };
      });

      setItinerary(plan);
    } catch (err) {
      console.error(err);
      setError("Could not fetch forecast. Check city name or API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-10 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4 text-center">
        🧳 Smart Itinerary Generator
      </h2>

      {/* Input Fields */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Enter Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="px-4 py-2 rounded-lg border shadow-md w-full md:w-1/4 focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 rounded-lg border shadow-md w-full md:w-1/4 focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 rounded-lg border shadow-md w-full md:w-1/4 focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={generateItinerary}
          disabled={loading}
          className={`${
            loading ? "bg-yellow-300" : "bg-yellow-500 hover:bg-yellow-600"
          } text-white px-6 py-2 rounded-lg shadow-lg`}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
      )}

      {/* Itinerary Output */}
      {itinerary.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md mt-4">
          <h3 className="text-xl font-semibold mb-3 text-center">📅 Your Itinerary</h3>
          <ul className="space-y-4">
            {itinerary.map((dayPlan) => (
              <li
                key={dayPlan.day}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <p className="font-bold text-yellow-700">
                  Day {dayPlan.day} - {dayPlan.date}
                </p>
                <p>🌅 Morning: {dayPlan.morning}</p>
                <p>🌞 Afternoon: {dayPlan.afternoon}</p>
                <p>🌙 Evening: {dayPlan.evening}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ItineraryPlanner;
