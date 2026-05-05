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