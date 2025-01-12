import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controllers/user-controller';
import { FeedbackController } from './controllers/feedback-controller';
import { VoteController } from './controllers/vote-controller';
import { VoteRepository } from './repositories/vote-repository';

const app = createExpressServer({
    routePrefix: '/api',
    controllers: [UserController, FeedbackController, VoteController]
});

app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


export const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
