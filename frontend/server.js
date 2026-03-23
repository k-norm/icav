const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const basePath = (process.env.BASE_PATH || '') .replace(/\/$/, '');
const backendApi = process.env.BACKEND_PROXY || 'http://backend:8080';
const apiPrefix = basePath ? `${basePath}/api` : '/api';

// Serve static files from the frontend directory
app.use(express.static(__dirname));

// Proxy API requests to backend through this express instance.
app.use(apiPrefix, async (req, res) => {
    const targetPath = `${req.originalUrl.replace(basePath, '')}`;
    const target = `${backendApi}${targetPath}`;

    try {
        const backendResponse = await fetch(target, {
            method: req.method,
            headers: {
                ...req.headers,
                host: new URL(backendApi).host,
            },
            body: ['GET','HEAD'].includes(req.method) ? undefined : req.body,
        });

        const body = await backendResponse.text();
        res.status(backendResponse.status);
        backendResponse.headers.forEach((value, key) => {
            if (key.toLowerCase() !== 'content-length') {
                res.setHeader(key, value);
            }
        });
        res.send(body);
    } catch (error) {
        res.status(502).send({ message: 'Bad gateway', error: error.message });
    }
});

const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
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
        .btn-quaternary {
            background-color: #9c27b0;
        }
        .btn-quaternary:hover {
            background-color: #7b1fa2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ICAV</h1>

        <div class="buttons">
            <a href="${basePath}/chart/scatter" class="btn">Scatter Plot</a>
            <a href="${basePath}/chart/condition" class="btn btn-secondary">Condition Chart</a>
            <a href="${basePath}/chart/heatmap" class="btn btn-secondary">Heatmap</a>
            <a href="${basePath}/table/condition" class="btn btn-tertiary">View Table</a>
            <a href="${basePath}/stats/condition" class="btn btn-quaternary">View Statistics</a>
        </div>
    </div>
</body>
</html>`);
});

// Route for facility condition data table
mainRouter.get('/table/condition', (req, res) => {
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
                <a href="${basePath}/" class="btn">Home</a>
                <a href="${basePath}/chart/scatter" class="btn btn-secondary">Scatter Plot</a>
                <a href="${basePath}/chart/condition" class="btn btn-tertiary">Condition Chart</a>
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
            fetch('${basePath}/api/facilities/condition')
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
mainRouter.get('/chart/condition', (req, res) => {
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
                margin-top: -40px;
                flex-wrap: wrap;
                position: relative;
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
            .legend-section {
                background-color: #e8f4f8;
                border-left: 4px solid #0288d1;
                padding: 20px;
                margin-top: 40px;
                border-radius: 4px;
            }
            .legend-section h3 {
                color: #01579b;
                margin-bottom: 15px;
                font-size: 1.1em;
            }
            .legend-definitions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }
            .definition-item {
                margin-bottom: 0;
            }
            .definition-item-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
            }
            .definition-item-desc {
                color: #555;
                font-size: 0.9em;
                line-height: 1.4;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Facility Condition Distribution by Province</h1>
            <p>Stacked bar chart showing facility condition mix (Excellent, Good, Fair, Poor) across Canadian provinces and territories.</p>

            <div class="nav-buttons">
                <a href="${basePath}/" class="btn">Home</a>
                <a href="${basePath}/chart/scatter" class="btn btn-secondary">Scatter Plot</a>
                <a href="${basePath}/chart/heatmap" class="btn btn-secondary">Heatmap</a>
                <a href="${basePath}/table/condition" class="btn btn-tertiary">View Table</a>
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

            <div class="legend-section">
                <h3>Facility Condition Categories</h3>
                <div class="legend-definitions">
                    <div class="definition-item">
                        <div class="definition-item-title">Excellent</div>
                        <div class="definition-item-desc">Well-maintained facilities in top condition with minimal defects or repairs needed.</div>
                    </div>
                    <div class="definition-item">
                        <div class="definition-item-title">Good</div>
                        <div class="definition-item-desc">Properly maintained facilities with minor wear and tear. Generally functioning well with infrequent repairs.</div>
                    </div>
                    <div class="definition-item">
                        <div class="definition-item-title">Fair</div>
                        <div class="definition-item-desc">Facilities showing signs of aging with moderate maintenance needs. Regular repairs required but still operational.</div>
                    </div>
                    <div class="definition-item">
                        <div class="definition-item-title">Poor</div>
                        <div class="definition-item-desc">Facilities in critical condition requiring urgent repairs or rehabilitation. Significant deterioration or structural concerns.</div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // Fetch data from backend API and render SVG bar chart
            fetch('${basePath}/api/facilities/condition')
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
                svg.setAttribute('height', margin.top + height + margin.bottom);
                
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

// Route for scatter plot - Accessibility vs Poor Condition
mainRouter.get('/chart/scatter', (req, res) => {
    const chartHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Facility Accessibility vs Condition Scatter Plot</title>
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
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
            .btn:hover {
                background-color: #0056b3;
            }
            .btn-secondary {
                background-color: #6c757d;
            }
            .btn-secondary:hover {
                background-color: #545b62;
            }
            #chart {
                width: 100%;
                height: 600px;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .loading {
                font-size: 1.2em;
                color: #666;
            }
            .error {
                color: #dc3545;
                font-size: 1.1em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Facility Accessibility vs Condition Analysis</h1>
            <p class="subtitle">Scatter plot showing  accessible versus poor condition, with bubble size representing total facilities per province.</p>
            
            <div class="nav-buttons">
                <a href="${basePath}/" class="btn">Home</a>
                <a href="${basePath}/chart/condition" class="btn btn-secondary">Condition Chart</a>
                <a href="${basePath}/chart/heatmap" class="btn btn-secondary">Heatmap</a>
                <a href="${basePath}/stats/condition" class="btn btn-secondary">Statistics</a>
            </div>
            
            <div id="chart" class="loading">Loading scatter plot data...</div>
        </div>
        
        <script>
            // Fetch data from backend API and render scatter plot
            fetch('${basePath}/api/facilities/scatter')
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
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
                const margin = { top: 20, right: 120, bottom: 80, left: 80 };
                const width = 1000 - margin.left - margin.right;
                const height = 600 - margin.top - margin.bottom;
                
                // Create SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', width + margin.left + margin.right);
                svg.setAttribute('height', height + margin.top + margin.bottom);
                
                // Create group for chart area
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('transform', 'translate(' + margin.left + ',' + margin.top + ')');
                
                // Calculate scales with padding
                const xValues = data.map(d => d.accessible_percent);
                const yValues = data.map(d => d.poor_condition_percent);
                const sizes = data.map(d => d.total_facilities);
                
                const xMin = Math.min(...xValues);
                const xMax = Math.max(...xValues);
                const yMin = Math.min(...yValues);
                const yMax = Math.max(...yValues);
                const sizeMin = Math.min(...sizes);
                const sizeMax = Math.max(...sizes);
                
                // Add padding to prevent points from being cut off
                const xPadding = (xMax - xMin) * 0.1; // 10% padding
                const yPadding = (yMax - yMin) * 0.1; // 10% padding
                const xScaleMin = Math.max(0, xMin - xPadding); // Don't go below 0%
                const xScaleMax = Math.min(100, xMax + xPadding); // Don't go above 100%
                const yScaleMin = Math.max(0, yMin - yPadding); // Don't go below 0%
                const yScaleMax = Math.min(100, yMax + yPadding); // Don't go above 100%
                
                // Scale functions
                const xScale = (value) => (value - xScaleMin) / (xScaleMax - xScaleMin) * width;
                const yScale = (value) => height - (value - yScaleMin) / (yScaleMax - yScaleMin) * height;
                const sizeScale = (value) => 10 + (value - sizeMin) / (sizeMax - sizeMin) * 40; // Min 10px, max 50px
                
                // Draw bubbles
                data.forEach(d => {
                    const cx = xScale(d.accessible_percent);
                    const cy = yScale(d.poor_condition_percent);
                    const r = sizeScale(d.total_facilities);
                    
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', cx);
                    circle.setAttribute('cy', cy);
                    circle.setAttribute('r', r);
                    circle.setAttribute('fill', '#8884d8');
                    circle.setAttribute('fill-opacity', '0.6');
                    circle.setAttribute('stroke', '#666');
                    circle.setAttribute('stroke-width', '2');
                    
                    // Add hover effect
                    circle.style.cursor = 'pointer';
                    circle.addEventListener('mouseover', function() {
                        this.setAttribute('fill-opacity', '1');
                        showTooltip(event, d);
                    });
                    circle.addEventListener('mouseout', function() {
                        this.setAttribute('fill-opacity', '0.6');
                        hideTooltip();
                    });
                    
                    g.appendChild(circle);
                    
                    // Add province label
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', cx);
                    text.setAttribute('y', cy - r - 5);
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-size', '12px');
                    text.setAttribute('fill', '#333');
                    text.textContent = d.province;
                    g.appendChild(text);
                });
                
                // X-axis
                const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                xAxis.setAttribute('transform', 'translate(0,' + height + ')');
                
                // X-axis line
                const xLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                xLine.setAttribute('x1', 0);
                xLine.setAttribute('x2', width);
                xLine.setAttribute('y1', 0);
                xLine.setAttribute('y2', 0);
                xLine.setAttribute('stroke', '#333');
                xLine.setAttribute('stroke-width', '2');
                xAxis.appendChild(xLine);
                
                // X-axis ticks and labels
                const xTicks = 5;
                for (let i = 0; i <= xTicks; i++) {
                    const value = xScaleMin + (xScaleMax - xScaleMin) / xTicks * i;
                    const x = (value - xScaleMin) / (xScaleMax - xScaleMin) * width;
                    
                    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    tick.setAttribute('x1', x);
                    tick.setAttribute('x2', x);
                    tick.setAttribute('y1', 0);
                    tick.setAttribute('y2', 5);
                    tick.setAttribute('stroke', '#333');
                    xAxis.appendChild(tick);
                    
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', x);
                    label.setAttribute('y', 20);
                    label.setAttribute('text-anchor', 'middle');
                    label.setAttribute('font-size', '12px');
                    label.setAttribute('fill', '#666');
                    label.textContent = value.toFixed(1) + '%';
                    xAxis.appendChild(label);
                }
                
                g.appendChild(xAxis);
                
                // Y-axis
                const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                
                // Y-axis line
                const yLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                yLine.setAttribute('x1', 0);
                yLine.setAttribute('x2', 0);
                yLine.setAttribute('y1', 0);
                yLine.setAttribute('y2', height);
                yLine.setAttribute('stroke', '#333');
                yLine.setAttribute('stroke-width', '2');
                yAxis.appendChild(yLine);
                
                // Y-axis ticks and labels
                const yTicks = 5;
                for (let i = 0; i <= yTicks; i++) {
                    const value = yScaleMin + (yScaleMax - yScaleMin) / yTicks * i;
                    const y = height - (value - yScaleMin) / (yScaleMax - yScaleMin) * height;
                    
                    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    tick.setAttribute('x1', 0);
                    tick.setAttribute('x2', -5);
                    tick.setAttribute('y1', y);
                    tick.setAttribute('y2', y);
                    tick.setAttribute('stroke', '#333');
                    yAxis.appendChild(tick);
                    
                    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    label.setAttribute('x', -10);
                    label.setAttribute('y', y + 4);
                    label.setAttribute('text-anchor', 'end');
                    label.setAttribute('font-size', '12px');
                    label.setAttribute('fill', '#666');
                    label.textContent = value.toFixed(1) + '%';
                    yAxis.appendChild(label);
                }
                
                g.appendChild(yAxis);
                
                // Axis labels
                const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                xLabel.setAttribute('x', width / 2);
                xLabel.setAttribute('y', height + 50);
                xLabel.setAttribute('text-anchor', 'middle');
                xLabel.setAttribute('font-size', '14px');
                xLabel.setAttribute('fill', '#333');
                xLabel.textContent = '% Accessible Facilities';
                g.appendChild(xLabel);
                
                const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                yLabel.setAttribute('x', -height / 2);
                yLabel.setAttribute('y', -50);
                yLabel.setAttribute('text-anchor', 'middle');
                yLabel.setAttribute('font-size', '14px');
                yLabel.setAttribute('fill', '#333');
                yLabel.setAttribute('transform', 'rotate(-90)');
                yLabel.textContent = '% Facilities in Poor Condition';
                g.appendChild(yLabel);
                
                // Legend for bubble size
                const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                legend.setAttribute('transform', 'translate(' + (width + 20) + ', 50)');
                
                const legendTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                legendTitle.setAttribute('x', 0);
                legendTitle.setAttribute('y', 0);
                legendTitle.setAttribute('font-size', '12px');
                legendTitle.setAttribute('fill', '#333');
                legendTitle.setAttribute('font-weight', 'bold');
                legendTitle.textContent = 'Total Facilities';
                legend.appendChild(legendTitle);
                
                // Legend circles
                const legendSizes = [sizeMin, (sizeMin + sizeMax) / 2, sizeMax];
                legendSizes.forEach((size, i) => {
                    const cy = 20 + i * 40;
                    const r = sizeScale(size);
                    
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', r);
                    circle.setAttribute('cy', cy);
                    circle.setAttribute('r', r);
                    circle.setAttribute('fill', '#8884d8');
                    circle.setAttribute('fill-opacity', '0.6');
                    circle.setAttribute('stroke', '#666');
                    circle.setAttribute('stroke-width', '1');
                    legend.appendChild(circle);
                    
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', r * 2 + 10);
                    text.setAttribute('y', cy + 4);
                    text.setAttribute('font-size', '11px');
                    text.setAttribute('fill', '#666');
                    text.textContent = Math.round(size);
                    legend.appendChild(text);
                });
                
                g.appendChild(legend);
                
                svg.appendChild(g);
                chartContainer.appendChild(svg);
            }
            
            function showTooltip(e, d) {
                // Create tooltip
                let tooltip = document.getElementById('tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'tooltip';
                    tooltip.style.position = 'absolute';
                    tooltip.style.background = 'rgba(0,0,0,0.8)';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '8px';
                    tooltip.style.borderRadius = '4px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.pointerEvents = 'none';
                    tooltip.style.zIndex = '1000';
                    document.body.appendChild(tooltip);
                }
                
                tooltip.innerHTML = \`
                    <strong>\${d.province}</strong><br>
                    Accessible: \${d.accessible_percent.toFixed(1)}%<br>
                    Poor Condition: \${d.poor_condition_percent.toFixed(1)}%<br>
                    Total Facilities: \${d.total_facilities}
                \`;
                
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY - 10) + 'px';
                tooltip.style.display = 'block';
            }
            
            function hideTooltip() {
                const tooltip = document.getElementById('tooltip');
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            }
        </script>
    </body>
    </html>
    `;
    res.send(chartHtml);
});

// Route for facility heatmap - Facility condition by province
// Data is represented by poor/excellent color intensity.
mainRouter.get('/chart/heatmap', (req, res) => {
    const heatmapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Canada Facility Condition Heatmap</title>
        <script src="https://d3js.org/d3.v7.min.js"></script>
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
                margin-bottom: 20px;
                font-size: 1.1em;
                text-align: center;
            }
            .controls {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                margin-bottom: 30px;
                flex-wrap: wrap;
            }
            .filter-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .filter-group label {
                font-weight: 600;
                color: #333;
            }
            .filter-group select {
                padding: 10px 15px;
                border: 2px solid #667eea;
                border-radius: 5px;
                font-size: 1rem;
                cursor: pointer;
                background: white;
                transition: all 0.3s ease;
            }
            .filter-group select:hover {
                border-color: #5a67d8;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
            }
            .filter-group select:focus {
                outline: none;
                border-color: #5a67d8;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            .nav-buttons {
                display: flex;
                justify-content: center;
                gap: 20px;
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
                border: none;
                cursor: pointer;
            }
            .btn:hover {
                background: #5a67d8;
            }
            #map-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 30px 0;
                padding: 20px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 12px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
            }
            svg {
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                width: 100%;
                max-width: 1000px;
                height: auto;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            path[data-province] {
                stroke: #fff;
                stroke-width: 1.5;
                cursor: pointer;
                transition: all 0.3s ease;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
            }
            path[data-province]:hover {
                stroke-width: 2.5;
                stroke: #333;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)) brightness(1.1);
                transform: scale(1.02);
            }
            path[data-province].hidden {
                fill: #e0e0e0 !important;
                opacity: 0.3;
                cursor: not-allowed;
            }
            .tooltip {
                position: absolute;
                background: rgba(33, 33, 33, 0.95);
                color: white;
                padding: 15px 18px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                pointer-events: none;
                z-index: 1000;
                display: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
                max-width: 250px;
                line-height: 1.4;
            }
            .legend {
                margin-top: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
            }
            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.95rem;
                color: #333;
            }
            .legend-color {
                width: 32px;
                height: 32px;
                border-radius: 4px;
                border: 1px solid rgba(0,0,0,0.3);
            }
            .loading {
                text-align: center;
                padding: 80px;
                font-size: 1.3em;
                color: #666;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }
            .loading::after {
                content: '';
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
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
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Canada Facility Condition Heatmap</h1>
            <p class="subtitle">Geographic distribution of facility conditions by province</p>
            
            <div class="controls">
                <div class="filter-group">
                    <label for="filterSelect">Filter by Condition:</label>
                    <select id="filterSelect">
                        <option value="all">All Conditions</option>
                        <option value="excellent">Excellent (≥42%)</option>
                        <option value="very-good">Very Good (40-41.9%)</option>
                        <option value="good">Good (38-39.9%)</option>
                        <option value="fair">Fair (36-37.9%)</option>
                        <option value="poor">Poor (<36%)</option>
                    </select>
                </div>
                <div class="nav-buttons">
                    <a href="${basePath}/" class="btn">Home</a>
                    <a href="${basePath}/chart/condition" class="btn">Condition Chart</a>
                    <a href="${basePath}/chart/scatter" class="btn">Scatter Plot</a>
                    <a href="${basePath}/stats/condition" class="btn">Statistics</a>
                </div>
            </div>

            <div id="map-container">
                <div id="heatmap" class="loading">Loading Canada map...</div>
            </div>
            <div class="legend" id="heatmapLegend"></div>
            <div class="tooltip" id="tooltip"></div>
        </div>

        <script>
            let provincesData = {};
            
            function getConditionCategory(excellentPercent) {
                if (excellentPercent >= 42) return 'excellent';
                else if (excellentPercent >= 40) return 'very-good';
                else if (excellentPercent >= 38) return 'good';
                else if (excellentPercent >= 36) return 'fair';
                else return 'poor';
            }

            function excellentToColor(excellentPercent) {
                if (excellentPercent >= 42) {
                    return '#2e7d32'; // Dark green - excellent
                } else if (excellentPercent >= 40) {
                    return '#4caf50'; // Green - very good
                } else if (excellentPercent >= 38) {
                    return '#8bc34a'; // Light green - good
                } else if (excellentPercent >= 36) {
                    return '#ffc107'; // Yellow - fair
                } else {
                    return '#ff9800'; // Orange - poor
                }
            }

            // Map province names to abbreviations
            const codeToName = {
                'BC': 'British Columbia',
                'AB': 'Alberta',
                'SK': 'Saskatchewan',
                'MB': 'Manitoba',
                'ON': 'Ontario',
                'QC': 'Quebec',
                'NB': 'New Brunswick',
                'PE': 'Prince Edward Island',
                'NS': 'Nova Scotia',
                'NL': 'Newfoundland and Labrador',
                'YT': 'Yukon',
                'NT': 'Northwest Territories',
                'NU': 'Nunavut'
            };

            function applyFilter(filterValue) {
                document.querySelectorAll('path[data-province], text[data-province]').forEach(element => {
                    const code = element.getAttribute('data-province');
                    const data = provincesData[code];
                    
                    if (!data || filterValue === 'all') {
                        if (element.tagName === 'path') {
                            element.classList.remove('hidden');
                        } else if (element.tagName === 'text') {
                            element.style.opacity = '1';
                        }
                    } else {
                        const category = getConditionCategory(data.excellent_percent);
                        if (category === filterValue) {
                            if (element.tagName === 'path') {
                                element.classList.remove('hidden');
                            } else if (element.tagName === 'text') {
                                element.style.opacity = '1';
                            }
                        } else {
                            if (element.tagName === 'path') {
                                element.classList.add('hidden');
                            } else if (element.tagName === 'text') {
                                element.style.opacity = '0.3';
                            }
                        }
                    }
                });
            }

            fetch('${basePath}/api/facilities/heatmap')
                .then(res => {
                    if (!res.ok) throw new Error('Failed to load heatmap API');
                    return res.json();
                })
                .then(apiData => {
                    const data = Array.isArray(apiData) ? apiData : apiData.value || [];
                    
                    // Create data map for quick lookup by province name
                    const dataMap = {};
                    data.forEach(item => {
                        dataMap[item.province] = item;
                    });

                    const container = document.getElementById('heatmap');
                    container.classList.remove('loading');
                    container.innerHTML = '';

                    // Fetch and insert the external SVG
                    fetch('${basePath}/CanadaMap.svg')
                        .then(svgRes => svgRes.text())
                        .then(svgText => {
                            container.innerHTML = svgText;

                            // The SVG now has proper province groups with IDs
                            // Add data-province attributes to province groups
                            document.querySelectorAll('g[id]').forEach(group => {
                                const provinceCode = group.id;
                                if (['BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU'].includes(provinceCode)) {
                                    group.setAttribute('data-province', provinceCode);
                                    // Add data-province to all paths within the group
                                    group.querySelectorAll('path').forEach(path => {
                                        path.setAttribute('data-province', provinceCode);
                                    });
                                }
                            });

                            // Add province name labels
                            const provinceCenters = {
                                'AB': [-12000, -8000],
                                'BC': [-18000, -6000], 
                                'MB': [-6000, -4000],
                                'NB': [8000, -2000],
                                'NL': [12000, 2000],
                                'NS': [9000, -4000],
                                'NT': [-8000, 8000],
                                'NU': [2000, 12000],
                                'ON': [1000, -2000],
                                'PE': [9500, -3000],
                                'QC': [4000, 1000],
                                'SK': [-9000, -6000],
                                'YT': [-20000, 6000]
                            };

                            document.querySelectorAll('g[data-province]').forEach(group => {
                                const code = group.getAttribute('data-province');
                                const center = provinceCenters[code];
                                if (center) {
                                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                                    text.setAttribute('x', center[0]);
                                    text.setAttribute('y', center[1]);
                                    text.setAttribute('text-anchor', 'middle');
                                    text.setAttribute('dominant-baseline', 'middle');
                                    text.setAttribute('font-size', '16px');
                                    text.setAttribute('fill', 'white');
                                    text.setAttribute('stroke', 'black');
                                    text.setAttribute('stroke-width', '1px');
                                    text.setAttribute('font-weight', 'bold');
                                    text.setAttribute('data-province', code);
                                    text.textContent = code;
                                    group.appendChild(text);
                                }
                            });

                            // Add event handlers to province paths and text elements
                            document.querySelectorAll('path[data-province], text[data-province]').forEach(element => {
                                const code = element.getAttribute('data-province');
                                const provinceName = codeToName[code];
                                const item = dataMap[provinceName] || { 
                                    excellent_percent: 0,
                                    poor_percent: 0,
                                    total_facilities: 0,
                                    province: provinceName || code
                                };
                                
                                provincesData[code] = item;

                                // Update color based on data - for paths
                                if (element.tagName === 'path') {
                                    const color = excellentToColor(item.excellent_percent);
                                    element.style.fill = color;
                                    element.classList.add('province');
                                } else if (element.tagName === 'text') {
                                    // For text elements, we can add a background or border to indicate interactivity
                                    element.style.cursor = 'pointer';
                                }

                                // Add hover events
                                element.addEventListener('mouseover', function(e) {
                                    const tooltip = document.getElementById('tooltip');
                                    const condition = getConditionCategory(item.excellent_percent);
                                    const conditionText = condition.charAt(0).toUpperCase() + condition.slice(1).replace('-', ' ');
                                    tooltip.style.display = 'block';
                                    tooltip.innerHTML = '<strong>' + (item.province || code) + '</strong><br>' +
                                        'Condition: ' + conditionText + '<br>' +
                                        'Excellent: ' + item.excellent_percent.toFixed(1) + '%<br>' +
                                        'Poor: ' + item.poor_percent.toFixed(1) + '%<br>' +
                                        'Total Facilities: ' + item.total_facilities.toLocaleString();
                                });

                                element.addEventListener('mousemove', function(e) {
                                    const tooltip = document.getElementById('tooltip');
                                    tooltip.style.left = (e.pageX + 10) + 'px';
                                    tooltip.style.top = (e.pageY + 10) + 'px';
                                });

                                element.addEventListener('mouseout', function() {
                                    document.getElementById('tooltip').style.display = 'none';
                                });
                            });

                            // Create legend
                            const legend = document.getElementById('heatmapLegend');
                            legend.innerHTML =
                                '<div class="legend-item"><span class="legend-color" style="background:#2e7d32"></span>Excellent (≥42%)</div>' +
                                '<div class="legend-item"><span class="legend-color" style="background:#4caf50"></span>Very Good (40-41.9%)</div>' +
                                '<div class="legend-item"><span class="legend-color" style="background:#8bc34a"></span>Good (38-39.9%)</div>' +
                                '<div class="legend-item"><span class="legend-color" style="background:#ffc107"></span>Fair (36-37.9%)</div>' +
                                '<div class="legend-item"><span class="legend-color" style="background:#ff9800"></span>Poor (<36%)</div>' +
                                '<div class="legend-item"><span class="legend-color" style="background:#e0e0e0"></span>Filtered Out</div>';

                            // Setup filter listener
                            document.getElementById('filterSelect').addEventListener('change', function(e) {
                                applyFilter(e.target.value);
                            });
                        })
                        .catch(err => {
                            console.error('Error loading SVG:', err);
                            container.innerHTML = '<div class="error">Error loading map SVG: ' + err.message + '</div>';
                        });
                })
                .catch(err => {
                    console.error('Error:', err);
                    document.getElementById('heatmap').innerHTML = '<div class="error">Error loading data: ' + err.message + '</div>';
                });
        </script>
    </body>
    </html>
    `;

    res.send(heatmapHtml);
});

// Route for facility condition statistics
mainRouter.get('/stats/condition', (req, res) => {
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
            .legend-section {
                background-color: #e8f4f8;
                border-left: 4px solid #0288d1;
                padding: 20px;
                margin-bottom: 30px;
                border-radius: 4px;
            }
            .legend-section h3 {
                color: #01579b;
                margin-bottom: 15px;
                font-size: 1.1em;
            }
            .legend-items {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 15px;
            }
            .legend-item {
                margin-bottom: 0;
            }
            .legend-item-title {
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
            }
            .legend-item-desc {
                color: #555;
                font-size: 0.9em;
                line-height: 1.4;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Facility Condition Statistics</h1>
            <div class="subtitle">Detailed province-by-province breakdown with percentage distribution</div>

            <div class="legend-section">
                <h3>Facility Condition Categories</h3>
                <div class="legend-items">
                    <div class="legend-item">
                        <div class="legend-item-title">Excellent</div>
                        <div class="legend-item-desc">Well-maintained facilities in top condition with minimal defects or repairs needed.</div>
                    </div>
                    <div class="legend-item">
                        <div class="legend-item-title">Good</div>
                        <div class="legend-item-desc">Properly maintained facilities with minor wear and tear. Generally functioning well with infrequent repairs.</div>
                    </div>
                    <div class="legend-item">
                        <div class="legend-item-title">Fair</div>
                        <div class="legend-item-desc">Facilities showing signs of aging with moderate maintenance needs. Regular repairs required but still operational.</div>
                    </div>
                    <div class="legend-item">
                        <div class="legend-item-title">Poor</div>
                        <div class="legend-item-desc">Facilities in critical condition requiring urgent repairs or rehabilitation. Significant deterioration or structural concerns.</div>
                    </div>
                </div>
            </div>

            <div class="nav-buttons">
                <a href="${basePath}/" class="btn">Home</a>
                <a href="${basePath}/chart/scatter" class="btn btn-secondary">Scatter Plot</a>
                <a href="${basePath}/chart/condition" class="btn btn-tertiary">Condition Chart</a>
                <a href="${basePath}/table/condition" class="btn btn-quaternary">View Table</a>
            </div>

            <div id="stats-container" class="loading">Loading statistics...</div>

            <div id="summary-container"></div>
        </div>

        <script>
            // Fetch statistics from backend API and render as table
            fetch('${basePath}/api/facilities/stats')
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

app.use(mainRouter);
if (basePath) {
  app.use(basePath, mainRouter);
}

if (require.main === module) {
  app.listen(port, () => console.log(`Frontend running on port ${port}`));
}

// export app for testing
module.exports = app;
