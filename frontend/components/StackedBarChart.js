const React = require('react');

const StackedBarChart = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('http://localhost:8080/api/facilities/condition')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return '<div>Loading facility condition data...</div>';
  if (error) return `<div>Error loading chart: ${error}</div>`;

  return (
    React.createElement('div', { style: { padding: '20px' } },
      React.createElement('h2', null, 'Facility Condition by Province'),
      React.createElement('p', null, 'Showing facility condition mix (Excellent, Good, Fair, Poor) across provinces.'),
      React.createElement('table', { border: 1, cellPadding: 10, cellSpacing: 0, style: { width: '100%' } },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', null, 'Province'),
            React.createElement('th', null, 'Excellent'),
            React.createElement('th', null, 'Good'),
            React.createElement('th', null, 'Fair'),
            React.createElement('th', null, 'Poor')
          )
        ),
        React.createElement('tbody', null,
          data.map(d => React.createElement('tr', { key: d.province },
            React.createElement('td', null, d.province),
            React.createElement('td', null, d.excellent),
            React.createElement('td', null, d.good),
            React.createElement('td', null, d.fair),
            React.createElement('td', null, d.poor)
          ))
        )
      )
    )
  );
};

module.exports = StackedBarChart;
