import express, { Express } from 'express';
import cors from 'cors';
import routes from '@/routes';
import methodOverride from 'method-override';
import { IError } from '@/interfaces';
import { default as cookieParser } from 'cookie-parser';

const app: Express = express();
const port = process.env['PORT'] ?? 8080;

const METHODS_ALLOWED = 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS';

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: METHODS_ALLOWED,
    credentials: true,
  }),
);

app.get('/health-check', (_req, res) => {
  res.json({ message: 'All systems functioning as expected !!!' });
});

routes.attach(app);
app.use(methodOverride());

// app.use('*', (req: express.Request, res: express.Response) => {
//   res.status(404).send({
//     error: 'NotFound',
//     message: `Cannot ${req.method} ${req.baseUrl}`,
//   });
// });

app.use(
  (err: IError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(err.httpStatusCode || 500).send({
      error: err.message,
      details: err?.details,
    });
  },
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
