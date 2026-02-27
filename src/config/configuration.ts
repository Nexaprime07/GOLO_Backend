import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  environment: process.env.NODE_ENV || 'development',
  service: {
    name: process.env.SERVICE_NAME || 'ads-service',
    port: parseInt(process.env.PORT, 10) || 3001,
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID || 'ads-service',
    groupId: process.env.KAFKA_GROUP_ID || 'ads-consumer-group',
  },
}));