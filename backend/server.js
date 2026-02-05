require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Imports the index.js from the models folder
const userRoutes = require('./routes/userRoutes'); // <--- Import this
const billRoutes = require('./routes/billRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const statsRoutes = require('./routes/statsRoutes'); // <--- Import

const app = express();
const PORT = process.env.PORT || 5000;


// 1. MIDDLEWARE
// CORS allows your React frontend (on port 5173/3000) to talk to this backend
app.use(cors());
// Built-in middleware to parse JSON bodies from incoming requests
app.use(express.json());

// 2. TEST ROUTE
// A simple "Heartbeat" route to check if the server is alive
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Society Management API is running...' });
});

// 3. ROUTES (We will add these next)
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes); // <--- Add this
app.use('/api/complaints', complaintRoutes);
app.use('/api/stats', statsRoutes); // <--- Use
app.use('/api/notices', require('./routes/noticeRoutes'));

// 4. DATABASE SYNC & SERVER START
/**
 * db.sequelize.sync({ alter: true }) 
 * 'alter: true' checks the current state of the database and performs 
 * the necessary changes to make it match the models.
 */
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`🚀 Server is flying on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect/sync to the database:', err);
    process.exit(1); // Stop the server if the DB fails
  });