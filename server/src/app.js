const express = require('express')
const app = express()

app.use(express.json())

const notes = []

app.post('/notes', (req, res) => {
    console.log(req.body)
    notes.Push(req.body)
    res.status(201).json({ message: "Note added", note: req.body });
});

module.exports = app;