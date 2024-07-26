const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('./menuService');
const express = require('express');

const port = 8080;

const app = express();
app.use(express.json());

app.get('/', (req, res) => { res.send('Hello World!'); });

app.get('/menu', (req, res) => { getMenuItems(req, res); });

app.post('/menu', (req, res) => { createMenuItem(req, res); });

app.put('/menu', (req, res) => { updateMenuItem(req, res); });

app.delete('/menu', (req, res) => { deleteMenuItem(req, res); });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});