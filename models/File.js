const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();
const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});

// post middleware
fileSchema.post("save", async function (doc) {
  try {
    console.log("DOC: ", doc);
    // transporter
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });
    // send mail
    let info = await transporter.sendMail({

        from:"utuchann - by hihihhahaha",
        to:doc.email,
        subject:'new file uploaded on cloudinary',
        html:`<h1>Hello ji</h1><p>file uploaded</p>view here <a href="${doc.imageUrl}">${doc.imageUrl}</a>`

    })
    console.log("Info: ",info)
  } catch (error) {
    console.log(error);
  }
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
