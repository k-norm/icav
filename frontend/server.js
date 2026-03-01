const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`<html><head><title>ICAV</title></head><body><h1>ICAV Project</h1><p>This is the placeholder splash page showing the product pitch.</p></body></html>`);
});

app.listen(port, () => console.log(`Frontend running on port ${port}`));
