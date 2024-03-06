// app create
const express = require("express");
const app = express();

// port find krna he
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// middleware add krna he
app.use(express.json());
const fileupload = require("express-fileupload"); //this middleware is used to upload files on server
app.use(
  fileupload(
    {
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }
  )
);

// db se connect krna he
const db = require("./config/database");
db.connect();

// cloud se connect krna he
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// api route mount krnah he
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

// activate server
app.listen(PORT, () => {
  console.log(`app is running at ${PORT}`);
});
