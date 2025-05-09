// Load environment variables
require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI, {

}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    favoriteColor: String,
});

const User = mongoose.model('User', userSchema);

app.post('/addUser', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send('User details saved successfully');
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).send('Error saving user details');
    }
});


app.put('/updateUser/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const updatedData = req.body;
        await User.findOneAndUpdate({ email }, updatedData);
        res.status(200).send('User details updated successfully');
    } catch (error) {
        res.status(500).send('Error updating user details');
    }
});


app.delete('/deleteUser/:email', async (req, res) => {
    try {
        const email = req.params.email;
        await User.findOneAndDelete({ email });
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting user');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});