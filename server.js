const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();  // โหลดตัวแปรจากไฟล์ .env

const app = express();
const port = process.env.PORT || 8000;

// ใช้ CORS เพื่อให้ frontend ติดต่อกับ backend
app.use(cors());
app.use(express.json());  // รับข้อมูลแบบ JSON

// เชื่อมต่อกับ MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

// เรียกฟังก์ชันที่เชื่อมต่อ MongoDB
connectToMongoDB();

// สร้าง Schema สำหรับเก็บข้อมูลจำนวนผู้เข้าชม
const visitSchema = new mongoose.Schema({
    count: { type: Number, default: 0 },
});

const Visit = mongoose.model('Visit', visitSchema);

// API สำหรับเพิ่มจำนวนผู้เข้าชม
app.get('/visit', async (req, res) => {
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
        res.status(500).send('Error incrementing visit count');
    }
});

// API สำหรับดึงจำนวนผู้เข้าชม
app.get('/visit-count', async (req, res) => {
    try {
        const visit = await Visit.findOne();
        if (visit) {
            res.json({ count: visit.count });
        } else {
            res.json({ count: 0 });
        }
    } catch (error) {
        res.status(500).send('Error fetching visit count');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
