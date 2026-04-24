const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// 🔹 MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// 🔹 SERVE FRONTEND
// =======================
app.use(express.static(path.join(__dirname, '../public')));

// =======================
// 🔹 API ROUTES
// =======================
app.use('/api/products', require('./routes/products'));

// Example login route (for testing SonarQube issues)
app.get('/api/login', (req, res) => {
    const user = req.query.user;

    // Intentional bad practice (for SonarQube demo)
    if (user == "admin") {   // ❌ weak comparison
        return res.json({ status: "success", message: "Welcome Admin 🎉" });
    }

    return res.json({ status: "fail", message: "Invalid User ❌" });
});

// =======================
// 🔹 HEALTH CHECK (DOCKER)
// =======================
app.get('/health', (req, res) => {
    res.send("OK");
});

// =======================
// 🔹 FALLBACK ROUTE
// =======================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// =======================
// 🔹 START SERVER
// =======================
app.listen(PORT, () => {
    console.log(`🚀 ShopKart server running on port ${PORT}`);
});

module.exports = app;