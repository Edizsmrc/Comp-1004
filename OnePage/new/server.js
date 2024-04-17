const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

// This get the files from the file called "public".
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Reading the data from the JASON file called userData.json.
app.get('/userData', (req, res) => {
    try {
        // Construct the file path relative to the server.js file. This makes it so the rest of the location doesnt matter for the compability for other devices that wants the run the app.
        const data = fs.readFileSync(path.join(__dirname, 'public', 'userData.json'));
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) { // This is for error checking on console.
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// This writes the data to the userData.json file.
app.post('/userData', (req, res) => {
    try {
        const userData = req.body;
        // This constructs the file path relative to the server.js file.
        const filePath = path.join(__dirname, 'public', 'userData.json');
        // Merge new data with existing data (if any)
        const existingData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : {};
        const updatedData = { ...existingData, ...userData };
        // Write updated data back to JSON file
        fs.writeFileSync(filePath, JSON.stringify(updatedData));
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// This starts the server on the port 3000 and gives feedback on console saying Server is running on "http://localhost:"and the port its running. 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
