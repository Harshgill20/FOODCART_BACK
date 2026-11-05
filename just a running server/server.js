const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/',(req, res) => {
    res.send("hello world")
});

app.get('/api/hello',(_req,res) => {
    res.send("backend")
});

app.listen(3000, () => {
    console.log(`server is running on port http://localhost:3000`)
});