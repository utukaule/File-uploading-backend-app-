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
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality) {
  const options = {folder};
  console.log("temp file path", file.tempFilePath);

  if(quality) {
      options.quality = quality;
  }

  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// image upload ka handler
exports.imageUpload = async (req, res) => {
  try{
      //data fetch
      const { name, tags, email} = req.body;
      console.log(name,tags,email);

      const file = req.files.imageFile;
      console.log(file);

      //Validation
      const supportedTypes = ["jpg", "jpeg", "png"];
      const fileType = file.name.split('.')[1].toLowerCase();
      console.log("File Type:", fileType);

      if(!isFileTypeSupported(fileType, supportedTypes)) {
          return res.status(400).json({
              success:false,
              message:'File format not supported',
          })
      }

      //file format supported hai
      console.log("Uploading to codehelp");
      const response = await uploadFileToCloudinary(file, "codehelp");
      console.log(response);

      //db me entry save krni h
      const fileData = await File.create({
          name,
          tags,
          email,
          imageUrl:response.secure_url,
      });

      res.json({
          success:true,
          imageUrl:response.secure_url,
          message:'Image Successfully Uploaded',
      })
  }
  catch(error) {
      console.error(error);
      res.status(400).json({
          success:false,
          message:'Something went wrong',
      });

  }
}

// ****************************************************************
// video upload

exports.videoUpload = async (req,res) => {
  try{
      //data fetch
      const { name, tags, email} = req.body;
      console.log(name,tags,email);
      
      const file = req.files.videoFile;

       //Validation
       const supportedTypes = ["mp4", "mov"];
       const fileType = file.name.split('.')[1].toLowerCase();
       console.log("File Type:", fileType);

       //TODO: add a upper limit of 5MB for Video
       if(!isFileTypeSupported(fileType, supportedTypes)) {
           return res.status(400).json({
               success:false,
               message:'File format not supported',
           })
       }

        //file format supported hai
      console.log("Uploading to codehelp");
      const response = await uploadFileToCloudinary(file, "codehelp");
      console.log(response);

      //db me entry save krni h
      const fileData = await File.create({
          name,
          tags,
          email,
          imageUrl:response.secure_url,
      });

      res.json({
          success:true,
          imageUrl:response.secure_url,
          message:'Video Successfully Uploaded',
      })

  }
  catch(error) {
      console.error(error);
      res.status(400).json({
          success:false,
          message:'Something went wrong',
      })
  }
}


// ****************************************************************
// image file reducer

exports.imageSizeReducer = async (req,res) => {
  try{
      //data fetch
      const { name, tags, email} = req.body;
      console.log(name,tags,email);

      const file = req.files.imageFile;
      console.log(file);

      //Validation
      const supportedTypes = ["jpg", "jpeg", "png"];
      const fileType = file.name.split('.')[1].toLowerCase();
      console.log("File Type:", fileType);

      //TODO: add a upper limit of 5MB for Video
      if(!isFileTypeSupported(fileType, supportedTypes)) {
          return res.status(400).json({
              success:false,
              message:'File format not supported',
          })
      }

      //file format supported hai
      console.log("Uploading to codehelp");
      //TODO: height attribute-> COMPRESS
      const response = await uploadFileToCloudinary(file, "codehelp", 90);
      console.log(response);

      //db me entry save krni h
      const fileData = await File.create({
          name,
          tags,
          email,
          imageUrl:response.secure_url,
      });

      res.json({
          success:true,
          imageUrl:response.secure_url,
          message:'Image Successfully Uploaded',
      })
  }
  catch(error) {
      console.error(error);
      res.status(400).json({
          success:false,
          message:'Something went wrong',
      })
  }
}