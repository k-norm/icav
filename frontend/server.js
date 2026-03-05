const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ICAV - Infrastructure Condition & Accessibility Visualization</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 600px;
            padding: 40px;
            text-align: center;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 3em;
            margin-bottom: 40px;
            color: #333;
        }
        .buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            font-size: 1.1em;
            transition: background-color 0.3s ease;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .btn-secondary {
            background-color: #28a745;
        }
        .btn-secondary:hover {
            background-color: #1e7e34;
        }
        .btn-tertiary {
            background-color: #ff9800;
        }
        .btn-tertiary:hover {
            background-color: #e68900;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ICAV</h1>

        <div class="buttons">
            <a href="/chart/condition" class="btn">View Chart</a>
            <a href="/table/condition" class="btn btn-secondary">View Table</a>
            <a href="/stats/condition" class="btn btn-tertiary">View Statistics</a>
        </div>
    </div>
</body>
</html>`);
});

// Route for facility condition data table
app.get('/table/condition', (req, res) => {
    const tableHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Facility Condition Data Table - ICAV</title>
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
                text-align: center;
            }
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 1.1em;
                text-align: center;
            }
            .nav-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 30px;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            .btn:hover {
                background: #5a67d8;
                transform: translateY(-1px);
            }
            .btn-secondary {
                background: #4CAF50;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 0.9em;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #4CAF50;
                color: white;
                font-weight: 600;
                position: sticky;
                top: 0;
            }
            tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            tr:hover {
                background-color: #e3f2fd;
            }
            .condition-cell {
                text-align: center;
                font-weight: 500;
            }
            /* removed condition colors for cleaner table */
            .total-cell {
                font-weight: bold;
            }
            .loading {
                text-align: center;
                padding: 50px;
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
                text-align: center;
            }
            .summary {
                margin-top: 30px;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #4CAF50;
            }
            .summary h3 {
                margin-bottom: 10px;
                color: #333;
            }
            .summary p {
                color: #666;
                line-height: 1.6;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Facility Condition Data Table</h1>
            <div class="subtitle">Detailed breakdown of facility conditions across Canadian provinces and territories</div>

            <div class="nav-buttons">
                <a href="/" class="btn">Home</a>
                <a href="/chart/condition" class="btn btn-secondary">View Chart</a>
            </div>

            <div id="table-container" class="loading">Loading data...</div>

            <div class="summary">
                <h3>Data Source</h3>
                <p>This table displays facility condition data from Statistics Canada (Table 34-10-0180-01).
                The data represents the physical condition ratings of publicly owned culture, recreation, and sport facilities across Canada.</p>
            </div>
        </div>

        <script>
            // Fetch data from backend API and render table
            fetch('http://localhost:8080/api/facilities/condition')
                .then(res => res.json())
                .then(data => {
                    renderTable(data);
                })
                .catch(err => {
                    document.getElementById('table-container').innerHTML = '<div class="error">Error loading data: ' + err.message + '</div>';
                });

            function renderTable(data) {
                const container = document.getElementById('table-container');

                let html = '<table>';
                html += '<thead>';
                html += '<tr>';
                html += '<th>Province/Territory</th>';
                html += '<th class="condition-cell excellent">Excellent</th>';
                html += '<th class="condition-cell good">Good</th>';
                html += '<th class="condition-cell fair">Fair</th>';
                html += '<th class="condition-cell poor">Poor</th>';
                html += '<th class="condition-cell total-cell">Total Facilities</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';

                data.forEach(d => {
                    const total = d.excellent + d.good + d.fair + d.poor;
                    html += '<tr>';
                    html += '<td><strong>' + d.province + '</strong></td>';
                    html += '<td class="condition-cell">' + d.excellent.toLocaleString() + '</td>';
                    html += '<td class="condition-cell">' + d.good.toLocaleString() + '</td>';
                    html += '<td class="condition-cell">' + d.fair.toLocaleString() + '</td>';
                    html += '<td class="condition-cell">' + d.poor.toLocaleString() + '</td>';
                    html += '<td class="condition-cell total-cell">' + total.toLocaleString() + '</td>';
                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';

                container.innerHTML = html;
            }
        </script>
    </body>
    </html>
    `;
    res.send(tableHtml);
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
            .nav-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 20px;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            .btn:hover {
                background: #5a67d8;
                transform: translateY(-1px);
            }
            .btn-secondary {
                background: #4CAF50;
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

            <div class="nav-buttons">
                <a href="/" class="btn">Home</a>
                <a href="/table/condition" class="btn btn-secondary">View Table</a>
            </div>

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

// Route for facility condition statistics
app.get('/stats/condition', (req, res) => {
    const statsHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Facility Condition Statistics - ICAV</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f5f5;
                padding: 20px;
            }
            .container {
                max-width: 1400px;
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
                text-align: center;
            }
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 1.1em;
                text-align: center;
            }
            .nav-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            .btn:hover {
                background: #5a67d8;
            }
            .btn-secondary {
                background: #4CAF50;
            }
            .btn-secondary:hover {
                background: #45a049;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 0.9em;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: center;
            }
            th {
                background-color: #f8f9fa;
                color: #333;
                font-weight: 600;
                position: sticky;
                top: 0;
            }
            tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            tr:hover {
                background-color: #e3f2fd;
            }
            .province-cell {
                text-align: left;
                font-weight: 600;
            }
            .loading {
                text-align: center;
                padding: 50px;
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
                text-align: center;
            }
            .summary-table {
                width: 100%;
                margin-top: 40px;
                border-collapse: collapse;
            }
            .summary-table th {
                background-color: #f8f9fa;
                color: #333;
                font-weight: 600;
                border: 1px solid #ddd;
                padding: 12px;
                text-align: center;
            }
            .summary-table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: center;
            }
            .summary-label {
                text-align: left;
                font-weight: 600;
            }
            .summary-section {
                margin-top: 40px;
            }
            .summary-section h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 1.3em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Facility Condition Statistics</h1>
            <div class="subtitle">Detailed province-by-province breakdown with percentage distribution</div>

            <div class="nav-buttons">
                <a href="/" class="btn">Home</a>
                <a href="/chart/condition" class="btn btn-secondary">View Chart</a>
                <a href="/table/condition" class="btn btn-secondary">View Table</a>
            </div>

            <div id="stats-container" class="loading">Loading statistics...</div>

            <div id="summary-container"></div>
        </div>

        <script>
            // Fetch statistics from backend API and render as table
            fetch('http://localhost:8080/api/facilities/stats')
                .then(res => res.json())
                .then(data => {
                    renderStats(data);
                    renderSummary(data);
                })
                .catch(err => {
                    document.getElementById('stats-container').innerHTML = '<div class="error">Error loading statistics: ' + err.message + '</div>';
                });

            function renderStats(data) {
                const container = document.getElementById('stats-container');
                let html = '<table>';
                html += '<thead>';
                html += '<tr>';
                html += '<th class="province-cell">Province</th>';
                html += '<th>Excellent (Count)</th>';
                html += '<th>Excellent (%)</th>';
                html += '<th>Good (Count)</th>';
                html += '<th>Good (%)</th>';
                html += '<th>Fair (Count)</th>';
                html += '<th>Fair (%)</th>';
                html += '<th>Poor (Count)</th>';
                html += '<th>Poor (%)</th>';
                html += '<th>Total</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';

                data.forEach(d => {
                    html += '<tr>';
                    html += '<td class="province-cell">' + d.province + '</td>';
                    html += '<td>' + d.excellent.toLocaleString() + '</td>';
                    html += '<td>' + d.excellent_percent.toFixed(2) + '%</td>';
                    html += '<td>' + d.good.toLocaleString() + '</td>';
                    html += '<td>' + d.good_percent.toFixed(2) + '%</td>';
                    html += '<td>' + d.fair.toLocaleString() + '</td>';
                    html += '<td>' + d.fair_percent.toFixed(2) + '%</td>';
                    html += '<td>' + d.poor.toLocaleString() + '</td>';
                    html += '<td>' + d.poor_percent.toFixed(2) + '%</td>';
                    html += '<td><strong>' + d.total_facilities.toLocaleString() + '</strong></td>';
                    html += '</tr>';
                });

                html += '</tbody>';
                html += '</table>';
                container.innerHTML = html;
            }

            function renderSummary(data) {
                const container = document.getElementById('summary-container');
                
                let totalFacilities = 0;
                let totalExcellent = 0, totalGood = 0, totalFair = 0, totalPoor = 0;

                data.forEach(d => {
                    totalFacilities += d.total_facilities;
                    totalExcellent += d.excellent;
                    totalGood += d.good;
                    totalFair += d.fair;
                    totalPoor += d.poor;
                });

                const excellentPct = (totalExcellent / totalFacilities * 100).toFixed(2);
                const goodPct = (totalGood / totalFacilities * 100).toFixed(2);
                const fairPct = (totalFair / totalFacilities * 100).toFixed(2);
                const poorPct = (totalPoor / totalFacilities * 100).toFixed(2);

                let html = '<div class="summary-section">';
                html += '<h3>Overall Summary (All Provinces & Territories)</h3>';
                html += '<table class="summary-table">';
                html += '<thead>';
                html += '<tr>';
                html += '<th class="summary-label">Metric</th>';
                html += '<th>Excellent</th>';
                html += '<th>Good</th>';
                html += '<th>Fair</th>';
                html += '<th>Poor</th>';
                html += '<th>Total</th>';
                html += '</tr>';
                html += '</thead>';
                html += '<tbody>';
                html += '<tr>';
                html += '<td class="summary-label">Count</td>';
                html += '<td>' + totalExcellent.toLocaleString() + '</td>';
                html += '<td>' + totalGood.toLocaleString() + '</td>';
                html += '<td>' + totalFair.toLocaleString() + '</td>';
                html += '<td>' + totalPoor.toLocaleString() + '</td>';
                html += '<td><strong>' + totalFacilities.toLocaleString() + '</strong></td>';
                html += '</tr>';
                html += '<tr>';
                html += '<td class="summary-label">Percentage</td>';
                html += '<td>' + excellentPct + '%</td>';
                html += '<td>' + goodPct + '%</td>';
                html += '<td>' + fairPct + '%</td>';
                html += '<td>' + poorPct + '%</td>';
                html += '<td><strong>100%</strong></td>';
                html += '</tr>';
                html += '</tbody>';
                html += '</table>';
                html += '</div>';
                container.innerHTML = html;
            }
        </script>
    </body>
    </html>
    `;
    res.send(statsHtml);
});

app.listen(port, () => console.log(`Frontend running on port ${port}`));

// export app for testing
module.exports = app;
