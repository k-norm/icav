const React = require('react');

const StackedBarChart = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('/api/facilities/condition')
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

const COLOURS = {
  excellent: '#8884d8',
  good:      '#82ca9d',
  fair:      '#ffc658',
  poor:      '#ff8042',
};

function getTotal(d) {
  return d.excellent + d.good + d.fair + d.poor;
}

function getMaxTotal(data) {
  return Math.max(...data.map(getTotal));
}

function getScale(data, height) {
  return height / getMaxTotal(data);
}

function getSegments(d) {
  return [
    { value: d.excellent, color: COLOURS.excellent, label: 'Excellent' },
    { value: d.good,      color: COLOURS.good,      label: 'Good'      },
    { value: d.fair,      color: COLOURS.fair,      label: 'Fair'      },
    { value: d.poor,      color: COLOURS.poor,      label: 'Poor'      },
  ];
}

function getBarHeights(d, scale) {
  return getSegments(d).map(seg => ({ ...seg, height: seg.value * scale }));
}

module.exports = { StackedBarChart, COLOURS, getTotal, getMaxTotal, getScale, getSegments, getBarHeights };
