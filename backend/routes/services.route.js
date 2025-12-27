import express from "express";
import axios from "axios";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";


const router = express.Router();

// ================== 🔹 CRUD ==================
router.post("/", createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

// ================== 🔹 External APIs ==================

// ✅ Weather API
router.get("/external/weather/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Weather API key missing" });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    res.json(response.data);
  } catch (err) {
    console.error("Weather API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// ✅ Events API
router.get("/external/events/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.EVENTS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Events API key missing" });
    }

    const response = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}`
    );

    res.json(response.data._embedded?.events || []);
  } catch (err) {
    console.error("Events API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// ✅ Flights API (Demo)
router.get("/external/flights/:from/:to", async (req, res) => {
  try {
    const { from, to } = req.params;

    res.json({
      from,
      to,
      price: "₹15,000",
      duration: "3h 20m",
      airline: "Demo Airlines",
    });
  } catch (err) {
    console.error("Flights API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

// ✅ Custom Package Builder
router.post("/external/custom", (req, res) => {
  try {
    const { destination, budget, days } = req.body;

    if (!destination || !budget || !days) {
      return res.status(400).json({ error: "Destination, budget and days required" });
    }

    res.json({
      destination,
      budget,
      days,
      package: `Custom package for ${destination} for ${days} days under ₹${budget}`,
    });
  } catch (err) {
    console.error("Custom Package Error:", err.message);
    res.status(500).json({ error: "Failed to build custom package" });
  }
});

export default router;
