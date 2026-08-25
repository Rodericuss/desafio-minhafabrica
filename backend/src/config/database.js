import mongoose from "mongoose";

async function connectToDatabase(mongodbUri) {
  await mongoose.connect(mongodbUri, {
    serverSelectionTimeoutMS: 10_000,
  });

  console.log("MongoDB connected");
}

async function disconnectFromDatabase() {
  await mongoose.disconnect();
}

export { connectToDatabase, disconnectFromDatabase };
