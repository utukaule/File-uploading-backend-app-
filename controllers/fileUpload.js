const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
//localFileHandler -> handler function
// Client ke path se media fetch krke server ke ek specific path store krta he

exports.localFileUpload = async (req, res) => {
  try {
    // step 1) file fetch krli
    const file = req.files.file;
    console.log("file aagayi jee", file);

    // step 2) path where we want to store file
    //server ke kis path pe file ko store krna chahate ho
    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`; //server la path he
    console.log("PATH -> ", path);

    // mv is move method used to move file on that dedicated path
    file.mv(path, (err) => {
      console.log(err);
    });

    res.json({
      success: true,
      message: "local file uploaded successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// ***************************************************************************************
// step 1) file extenstion validation...
function isFileTypeSupported(type, supportTypes) {
  return supportTypes.includes(type);
}

// step 2) after file extention validation uploading file to cloudinary...
async function uploadFileToCloudinary(file, folder, quality) {
  const options = { folder };
  console.log("temp file path ", file.tempFilePath);
  
  if (quality) {
    option.quality = quality;
  }
  
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(
    file.tempFilePath,
    { timeout: 120000 },
    options
  );
}

// image upload ka handler
exports.imageUpload = async (req, res) => {
  try {
    // data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    // receive file
    const file = req.files.imageFile;
    console.log(file);

    // validation (checking file type)
    const supportTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("file type -> ", fileType);

    if (!isFileTypeSupported(fileType, supportTypes)) {
      return res.status(400).json({
        success: false,
        message: "File type is not supported...",
      });
    }

    // file format supported hai
    console.log("uploading to codehelp");
    const response = await uploadFileToCloudinary(file, "codehelp");
    console.log(response);

    // Db me entry save krni he...
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "image uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "somthing went wrong",
    });
  }
};

// ****************************************************************
// video upload

exports.videoUpload = async (req, res) => {
  try {
    // data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.files.videoFile;
    console.log(file);
    // validation
    const supportTypes = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("file type:", fileType);

    if (!isFileTypeSupported(fileType, supportTypes)) {
      res.status(400).json({
        success: false,
        message: "file format not supported",
      });
    }

    // file format supported hai
    console.log("uploading to codehple");
    const response = await uploadFileToCloudinary(file, "codehelp");
    console.log(response);

    // db me entry krni he
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "video uplopded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "something went wrong ",
    });
  }
};

// ****************************************************************
// image file reducer

exports.imageSizeReducer = async (req, res) => {
  try {
    // data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.files.imageFile;
    console.log(file);

    // validation
    const supportTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("file type is :", fileType);

    // add upper limit to 5MB
    if (!isFileTypeSupported(fileType, supportTypes)) {
      return res.status(400).json({
        success: false,
        message: "file format not supported",
      });
    }

    // file format supported hei
    console.log("uploading to codehepl");
    const response = await uploadFileToCloudinary(file, "codehelp", 30);
    console.log(response);

    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });
    res.json({
      success: true,
      message: "image successfully uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};
