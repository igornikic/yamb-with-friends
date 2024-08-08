import mongoose from "mongoose";

mongoose.set("strict", false);

const connectDatabase = () => {
  const dbUri = process.env.DB_LOCAL_URI || "mongodb://localhost:27017";
  mongoose
    .connect(dbUri)
    .then((con) => {
      console.log(
        `MongoDB database connected with HOST: ${con.connection.host}`
      );
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
};

export default connectDatabase;
