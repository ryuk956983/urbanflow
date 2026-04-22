const mongoose = require("mogoose");
require('dotenv').config();


const connectDB = async () => {
  try {
      const conn = await mongoose.connect(process.env.MONGOOSE_CONNECTION);
    
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Error: ${error.message}`);
      process.exit(1);
  }
};

export default connectDB;