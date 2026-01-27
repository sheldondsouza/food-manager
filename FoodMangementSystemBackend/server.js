const express = require('express');
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { calculateAnalytics } = require('./Services/AnalyticsServices');
const FoodItem = require('./Models/FoodItems'); const Chef = require('./Models/Chefs');
dotenv.config();
app.use(cors(
    {
        origin: 'http://localhost:3000',
        // origin: 'https://food-mangement-system-frontend.vercel.app', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true

    }
));
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Management System ');
});
cron.schedule('0 * * * *', async () => {
    console.log("Running hourly analytics update of the anlytics data...");
    await calculateAnalytics();
});
// Importing routes
const analyticsRoutes = require('./Routes/AnalyticsRoutes');
const tableRoutes = require('./Routes/TableRoutes');
const OrderRoutes = require('./Routes/OrderRoutes');
const customerRoutes = require('./Routes/CustomerRoutes');
app.use('/admin/analytics', analyticsRoutes);
app.use('/admin/tables', tableRoutes);
app.use('/admin/orders', OrderRoutes);
app.use('/custommers', customerRoutes)


mongoose.connect(process.env.MONGO_DB_URI).then(async () => {
    console.log("Connected with mongoDB Sucessfully");

    // Seed initial food items if collection is empty
    const count = await FoodItem.countDocuments();
    if (count === 0) {
        const mockFoodItems = [
            {
                FoodItemName: 'Margherita Pizza',
                FoodItemPrice: 250,
                FoodItemCategory: 'Pizza',
                FoodItemDescription: 'Classic margherita pizza with fresh mozzarella and basil',
                FoodItemImageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=400&fit=crop',
                isAvailable: true,
                preparationTime: 15
            },
            {
                FoodItemName: 'Pepperoni Pizza',
                FoodItemPrice: 280,
                FoodItemCategory: 'Pizza',
                FoodItemDescription: 'Delicious pepperoni pizza with extra cheese',
                FoodItemImageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07f4ee?w=400&h=400&fit=crop',
                isAvailable: true,
                preparationTime: 15
            },
            {
                FoodItemName: 'Cheeseburger',
                FoodItemPrice: 200,
                FoodItemCategory: 'Burger',
                FoodItemDescription: 'Juicy cheeseburger with lettuce and tomato',
                FoodItemImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
                isAvailable: true,
                preparationTime: 10
            },
            {
                FoodItemName: 'French Fries',
                FoodItemPrice: 80,
                FoodItemCategory: 'French Fries',
                FoodItemDescription: 'Crispy golden french fries',
                FoodItemImageUrl: 'https://images.unsplash.com/photo-1573080496104-febf75cf11ff?w=400&h=400&fit=crop',
                isAvailable: true,
                preparationTime: 5
            },
            {
                FoodItemName: 'Vegetable Salad',
                FoodItemPrice: 120,
                FoodItemCategory: 'Veggies',
                FoodItemDescription: 'Fresh mixed vegetable salad',
                FoodItemImageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop',
                isAvailable: true,
                preparationTime: 5
            },
            {
                FoodItemName: 'Coca Cola',
                FoodItemPrice: 50,
                FoodItemCategory: 'Drink',
                FoodItemDescription: 'Cold refreshing cola',
                FoodItemImageUrl: 'https://images.unsplash.com/photo-1554866585-ac2d58138bfa?w=400&h=400&fit=crop',
                isAvailable: true,
                preparationTime: 2
            }
        ];

        await FoodItem.insertMany(mockFoodItems);
        console.log("✅ Seeded initial food items");
    }

    // Seed initial chefs if collection is empty
    const chefCount = await Chef.countDocuments();
    if (chefCount === 0) {
        const mockChefs = [
            { chefName: 'Chef John', chefStatus: 'Free', chefTakenOrders: [], chefCurrentOrder: [] },
            { chefName: 'Chef Maria', chefStatus: 'Free', chefTakenOrders: [], chefCurrentOrder: [] },
            { chefName: 'Chef Ahmed', chefStatus: 'Free', chefTakenOrders: [], chefCurrentOrder: [] }
        ];

        await Chef.insertMany(mockChefs);
        console.log("✅ Seeded initial chefs");
    }
}).catch((err) => {
    console.log(err);
}
);

app.listen(PORT, () => {
    console.log(`App running on the port ${PORT}`)
})
