const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectToMongoDB();

const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

const Visit = mongoose.model("Visit", visitSchema);

app.get("/visit", async (req, res) => {
  try {
    let visit = await Visit.findOne();
    if (!visit) {
      visit = new Visit({ count: 1 });
    } else {
      visit.count++;
    }
    await visit.save();
    res.json({ count: visit.count });
  } catch (error) {
    res.status(500).send("Error incrementing visit count");
  }
});

app.get("/visit-count", async (req, res) => {
  try {
    const visit = await Visit.findOne();
    if (visit) {
      res.json({ count: visit.count });
    } else {
      res.json({ count: 0 });
    }
  } catch (error) {
    res.status(500).send("Error fetching visit count");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
