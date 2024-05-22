const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const net = require('net');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Hello, IoT Home Automation!' });
});

app.post('/iot_comm', (req, res) => {
    const message = req.body.message;
    const client = new net.Socket();

    client.connect(4554, '10.0.0.219', () => {
        console.log('Connected to IoT device');
        client.write(message);
    });

    client.on('data', (data) => {
        res.json({ response: data.toString() });
        client.destroy(); // kill client after server's response
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.error('Connection error:', err);
        res.status(500).json({ error: 'Failed to communicate with IoT device' });
    });
});

app.get('/devices', (_req, res) => {
    fs.readFile(path.join(__dirname, 'iot_device_list.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading device list:', err);
            res.status(500).json({ error: 'Failed to read device list' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
