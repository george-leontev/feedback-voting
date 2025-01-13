import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controllers/user-controller';
import { FeedbackController } from './controllers/feedback-controller';
import { VoteController } from './controllers/vote-controller';
import { AuthController } from './controllers/auth-controller';
import { RootController } from './controllers/root-controller';

const app = createExpressServer({
    controllers: [RootController, AuthController, UserController, FeedbackController, VoteController]
});

app.use(express.json());

// app.use(cors({
//   origin: 'http://your-swagger-ui-domain.com',
//   allowedHeaders: ['Authorization', 'Content-Type'],
// }));

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


export const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
