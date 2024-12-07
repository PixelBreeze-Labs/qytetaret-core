import './src/boilerplate.polyfill';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { UserSubscriber } from './src/entity-subscribers/user-subscriber';
import { UserEntity } from './src/modules/user/user.entity'; // Add this import
import { Report } from './src/modules/report/entities/report.entity';

import { SnakeNamingStrategy } from './src/snake-naming.strategy';

dotenv.config();

export const dataSource = new DataSource({
  type: 'mongodb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  url: process.env.DATABASE_URL,
  useNewUrlParser: true,
  name: process.env.DB_DATABASE,
  useUnifiedTopology: true,
  synchronize: true, // be careful with this in production
  logging: true,
  subscribers: [UserSubscriber],
  entities: [UserEntity, Report],
  migrations: ['src/database/migrations/*{.ts,.js}'],
});