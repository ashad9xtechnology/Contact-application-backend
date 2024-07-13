const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://ashadashraf10:PhhFUEIksePCQ0Ae@cluster0.agqoc6b.mongodb.net/contactDB";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        res.status(201).json({ message: 'Contact form submitted successfully', contactId: newContact._id });
    } catch (error) {
        console.error("Error inserting contact:", error);
        res.status(500).json({ error: 'An error occurred while saving the contact' });
    }
});

app.get('/api/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: 'An error occurred while fetching contacts' });
    }
  });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});