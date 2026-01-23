const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/Users");


dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await User.deleteMany();


    await User.create({
      name: "Super Admin",
      email: "admin@evenisers.com",
      password: "Admin@123",
      role: "admin",
      isVerified: true,
    });

    console.log("✅Admin inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
