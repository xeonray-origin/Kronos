import express from 'express';

const app = express();
const port = process.env['PORT'] ?? 8080;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Kronos API' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
