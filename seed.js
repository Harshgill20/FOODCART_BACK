// Run once:  npm run seed   (fills the database with the menu)
require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

const foods = [
  { name: 'Cheese Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', prices: { Blinkit: 59, Swiggy: 69, Zomato: 75 } },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', prices: { Blinkit: 320, Swiggy: 349, Zomato: 339 } },
  { name: 'French Fries', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400', prices: { Blinkit: 89, Swiggy: 99, Zomato: 105 } },
  { name: 'Pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', prices: { Blinkit: 229, Swiggy: 249, Zomato: 259 } },
  { name: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', prices: { Blinkit: 129, Swiggy: 149, Zomato: 139 } },
  { name: 'Chocolate Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', prices: { Blinkit: 159, Swiggy: 179, Zomato: 169 } },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Food.deleteMany({});
    await Food.insertMany(foods);
    console.log(`Seeded ${foods.length} foods`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
