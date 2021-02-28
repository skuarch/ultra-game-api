import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = new MongoMemoryServer();
      const mongoUri = await mongod.getUri();
      return { uri: mongoUri, ...options };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) {
    await mongod.stop();
    mongoose.disconnect();
    mongoose.connection.close();
    mongod = undefined;
  }
};
