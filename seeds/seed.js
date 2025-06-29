const mongoose = require('mongoose');
const Yacht = require('../models/yacht');

mongoose.connect('mongodb://localhost:27017/charterworks-clone')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Connection error:', err));

const seedYachts = async () => {
  try {
    await Yacht.deleteMany({});
    console.log('🗑️ Cleared old yachts');

    const yachts = [
      { name: 'Ocean Breeze', description: 'Luxury yacht for ocean adventure.' },
      { name: 'Sea Pearl', description: 'Perfect for private parties.' },
      { name: 'Wave Rider', description: 'Speed and style combined.' }
    ];

    await Yacht.insertMany(yachts);
    console.log('✅ Yacht database seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

seedYachts();
