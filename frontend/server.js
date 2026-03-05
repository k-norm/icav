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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/recharts/2.10.3/Recharts.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/react.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/react-dom.production.min.js"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f5f5;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                margin-bottom: 10px;
                font-size: 2.5em;
            }
            p {
                color: #666;
                margin-bottom: 30px;
                font-size: 1.1em;
            }
            #chart {
                width: 100%;
                min-height: 660px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto;
            }
            .loading {
                font-size: 1.2em;
                color: #666;
            }
            .error {
                color: #d32f2f;
                font-weight: bold;
                padding: 15px;
                background-color: #ffebee;
                border-radius: 4px;
                margin: 20px 0;
            }
            .legend {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-top: 10px;
                flex-wrap: wrap;
                position: relative;
                top: -60px; /* lift legend closer to chart */
            }
            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .legend-color {
                width: 20px;
                height: 20px;
                border-radius: 3px;
            }
            .excellent { background-color: #8884d8; }
            .good { background-color: #82ca9d; }
            .fair { background-color: #ffc658; }
            .poor { background-color: #ff8042; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Facility Condition Distribution by Province</h1>
            <p>Stacked bar chart showing facility condition mix (Excellent, Good, Fair, Poor) across Canadian provinces and territories.</p>
            <div id="chart" class="loading">Loading chart data...</div>
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color excellent"></div>
                    <span>Excellent</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color good"></div>
                    <span>Good</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color fair"></div>
                    <span>Fair</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color poor"></div>
                    <span>Poor</span>
                </div>
            </div>
        </div>

        <script>
            // Fetch data from backend API and render SVG bar chart
            fetch('http://localhost:8080/api/facilities/condition')
                .then(res => res.json())
                .then(data => {
                    renderChart(data);
                })
                .catch(err => {
                    document.getElementById('chart').innerHTML = '<div class="error">Error loading data: ' + err.message + '</div>';
                });

            function renderChart(data) {
                const chartContainer = document.getElementById('chart');
                chartContainer.innerHTML = '';
                
                // SVG dimensions
                const margin = { top: 20, right: 20, bottom: 160, left: 60 };
                const width = chartContainer.clientWidth - margin.left - margin.right;
                const height = 500 - margin.top - margin.bottom;
                
                // Create SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', chartContainer.clientWidth);
                svg.setAttribute('height', 660);
                
                // Create group for chart area
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                
                // Colors for stacked bars
                const colors = {
                    excellent: '#8884d8',
                    good: '#82ca9d',
                    fair: '#ffc658',
                    poor: '#ff8042'
                };
                
                // Calculate max total for scaling
                const maxTotal = Math.max(...data.map(d => d.excellent + d.good + d.fair + d.poor));
                const scale = height / maxTotal;
                
                // Bar width and spacing
                const barWidth = width / data.length * 0.8;
                const barSpacing = width / data.length;
                
                // Draw bars
                data.forEach((d, i) => {
                    const x = i * barSpacing + (barSpacing - barWidth) / 2;
                    let y = height;
                    
                    // Draw stacked segments
                    const segments = [
                        { value: d.excellent, color: colors.excellent, label: 'Excellent' },
                        { value: d.good, color: colors.good, label: 'Good' },
                        { value: d.fair, color: colors.fair, label: 'Fair' },
                        { value: d.poor, color: colors.poor, label: 'Poor' }
                    ];
                    
                    segments.forEach(seg => {
                        const segHeight = seg.value * scale;
                        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        rect.setAttribute('x', x);
                        rect.setAttribute('y', y - segHeight);
                        rect.setAttribute('width', barWidth);
                        rect.setAttribute('height', segHeight);
                        rect.setAttribute('fill', seg.color);
                        rect.setAttribute('stroke', 'white');
                        rect.setAttribute('stroke-width', '1');
                        
                        // Add hover effect
                        rect.style.cursor = 'pointer';
                        rect.addEventListener('mouseover', function() {
                            this.setAttribute('opacity', '0.8');
                            showTooltip(event, seg.label + ': ' + seg.value);
                        });
                        rect.addEventListener('mouseout', function() {
                            this.setAttribute('opacity', '1');
                            hideTooltip();
                        });
                        
                        g.appendChild(rect);
                        y -= segHeight;
                    });
                    
                    // X-axis label (staggered to avoid overlap)
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', x + barWidth / 2);
                    // Stagger labels: even indices lower, odd indices higher
                    const labelY = height + (i % 2 === 0 ? 25 : 45);
                    text.setAttribute('y', labelY);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '11px');
                    text.setAttribute('fill', '#333');
                    text.textContent = d.province;
                    g.appendChild(text);
                    
                    // Add connector line from bar to label
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x + barWidth / 2);
                    line.setAttribute('y1', height);
                    line.setAttribute('x2', x + barWidth / 2);
                    const lineEndY = height + (i % 2 === 0 ? 18 : 38);
                    line.setAttribute('y2', lineEndY);
                    line.setAttribute('stroke', '#ccc');
                    line.setAttribute('stroke-width', '0.5');
                    line.setAttribute('stroke-dasharray', '2,2');
                    g.appendChild(line);
                });
                
                // Y-axis label
                const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                yLabel.setAttribute('x', -height / 2);
                yLabel.setAttribute('y', -45);
                yLabel.setAttribute('text-anchor', 'middle');
                yLabel.setAttribute('font-size', '12px');
                yLabel.setAttribute('fill', '#666');
                yLabel.setAttribute('transform', 'rotate(-90)');
                yLabel.textContent = 'Number of Facilities';
                g.appendChild(yLabel);
                
                // Y-axis gridlines and ticks
                const gridlines = 5;
                for (let i = 0; i <= gridlines; i++) {
                    const y = height - (height / gridlines) * i;
                    const value = Math.round((maxTotal / gridlines) * i);
                    
                    // Gridline
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', 0);
                    line.setAttribute('x2', width);
                    line.setAttribute('y1', y);
                    line.setAttribute('y2', y);
                    line.setAttribute('stroke', '#eee');
                    line.setAttribute('stroke-width', '1');
                    g.appendChild(line);
                    
                    // Y-axis tick label
                    const tickText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    tickText.setAttribute('x', -10);
                    tickText.setAttribute('y', y + 4);
                    tickText.setAttribute('text-anchor', 'end');
                    tickText.setAttribute('font-size', '11px');
                    tickText.setAttribute('fill', '#666');
                    tickText.textContent = value;
                    g.appendChild(tickText);
                }
                
                svg.appendChild(g);
                chartContainer.appendChild(svg);
            }
            
            function showTooltip(e, text) {
                // Tooltip functionality can be expanded
            }
            
            function hideTooltip() {
                // Hide tooltip
            }
        </script>
    </body>
    </html>
    `;
    res.send(chartHtml);
});

app.listen(port, () => console.log(`Frontend running on port ${port}`));

// export app for testing
module.exports = app;
