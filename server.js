const express = require('express');
const Airtable = require('airtable');
const app = express();

// AirTable configuration
const airtable = new Airtable({
    apiKey: 'patVfgWdPbTTcVq29.833a8a227a7bcb11dc850bfc252875c5d872d91622923cf834e448d93c785189'
});

app.use(express.json());

app.get('/view-user-data', async (req, res) => {
    const userId = req.query.userId; // Get the user ID from the query parameter

    try {
        const records = await airtable
            .base('appHx7TFH21tOdqm4') // Your AirTable base ID
            .table('PM Clients') // Your AirTable table name
            .select({
                filterByFormula: `{User ID} = '${userId}'` // Filter by User ID
                // Or use email if preferred: `{Email} = '${userId}'`
            })
            .all();

        // Format the data for the response
        const userData = records.map(record => ({
            userId: record.fields['User ID'],
            email: record.fields['Email'],
            name: record.fields['Name'], // Renamed for clarity
            phoneNumber: record.fields['Phone Number'] // Renamed for clarity
        }));

        res.json(userData);
    } catch (error) {
        console.error('Error fetching AirTable data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));