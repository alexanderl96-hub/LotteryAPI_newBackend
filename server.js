const express = require('express');
const app = express();
const PORT = process.env.PORT || 9001;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express now active!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
