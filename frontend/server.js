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

// Route for stacked bar chart - Facility Condition by Province
app.get('/chart/condition', (req, res) => {
    const chartHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Facility Condition Chart</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <h1>Facility Condition Distribution by Province</h1>
        <p>Showing facility condition mix (Excellent, Good, Fair, Poor) across provinces.</p>
        <div id="chart">Loading data...</div>
        <script>
            fetch('http://localhost:8080/api/facilities/condition')
                .then(res => res.json())
                .then(data => {
                    let html = '<table><tr><th>Province</th><th>Excellent</th><th>Good</th><th>Fair</th><th>Poor</th><th>Total</th></tr>';
                    data.forEach(d => {
                        const total = d.excellent + d.good + d.fair + d.poor;
                        html += '<tr><td>' + d.province + '</td><td>' + d.excellent + '</td><td>' + d.good + '</td><td>' + d.fair + '</td><td>' + d.poor + '</td><td>' + total + '</td></tr>';
                    });
                    html += '</table>';
                    document.getElementById('chart').innerHTML = html;
                })
                .catch(err => {
                    document.getElementById('chart').innerHTML = '<p style=\"color: red;\">Error loading data: ' + err.message + '</p>';
                });
        </script>
    </body>
    </html>
    `;
    res.send(chartHtml);
});

app.listen(port, () => console.log(`Frontend running on port ${port}`));

// export app for testing
module.exports = app;
