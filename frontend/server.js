const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`<html><head><title>ICAV</title></head><body><h1>ICAV Project</h1><p>Project Pitch

Problem
Every year, billions of dollars are allocated towards public infrastructure. In 2025 alone, this amount reached $30.4 billion. Despite this investment, funding is frequently mismanaged and misaligned with actual community needs — in large part because the underlying datasets are complicated, voluminous, and nearly impossible for non-specialists to read and interpret.

Solution
ICAV acts as a bridge between complex data and accessible insight. Using data from Statistics Canada on publicly owned culture, recreation, and sport facilities, ICAV generates clear, interactive visualizations representing facility physical conditions and accessibility rankings across Canada.
This tool enables regional planners, public economists, operations analysts, and policy makers to present evidence in a digestible format — creating stronger alignment between community needs and funding decisions.</p></body></html>`);
});

app.listen(port, () => console.log(`Frontend running on port ${port}`));

// export app for testing
module.exports = app;
