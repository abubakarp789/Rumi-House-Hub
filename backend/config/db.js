const mongoose = require('mongoose');

const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/rumi_house_hub';

const resolveMongoUri = (env = process.env) => {
  const configuredUri = env.MONGODB_URI?.trim();
  if (configuredUri) return configuredUri;

  if (env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI is required in production.');
  }

  return LOCAL_MONGODB_URI;
};

const connectDB = async () => {
  const conn = await mongoose.connect(resolveMongoUri(), {
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE) || 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000
  });

  console.log('=================================================');
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  console.log('=================================================');

  return conn;
};

module.exports = connectDB;
module.exports.resolveMongoUri = resolveMongoUri;
