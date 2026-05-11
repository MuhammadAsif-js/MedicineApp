import medicineRoutes from './routes/medicine.routes';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { sendResponse } from './utils/response';
import shopRoutes from './routes/shop.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount the shop routes
app.use('/api/shops', shopRoutes);

app.get('/ping', (req: Request, res: Response) => {
    return sendResponse(res, 200, true, null, "Server is operational and strictly typed.");
});

app.listen(PORT, () => {
    console.log(`🚀 Fortress initiated on port ${PORT}`);
});

// The "Front Door" of your API
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
      <h1>🚀 MedicineApp Fortress is Online</h1>
      <p>Database: Connected & Synced</p>
      <p>Cloud Environment: GitHub Codespaces</p>
    </div>
  `);
});

app.use('/api/medicines', medicineRoutes);

// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import dotenv from 'dotenv';
// import { sendResponse } from './utils/response';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8000;

// // Global Middlewares
// app.use(helmet());
// app.use(cors());
// app.use(express.json());

// // Health Check Route
// app.get('/ping', (req: Request, res: Response) => {
//     return sendResponse(res, 200, true, null, "Server is operational and strictly typed.");
// });

// app.listen(PORT, () => {
//     console.log(`🚀 Fortress initiated on port ${PORT}`);
// });