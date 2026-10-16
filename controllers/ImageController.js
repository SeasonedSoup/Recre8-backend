const { supabase } = require('../lib/supabase');

const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const MAX_FILE_SIZE = 1024 * 1024 * 50

const validateFiles = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  for (const file of req.files) {
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "A File Exceeds the 50MB limit" });
    }
  }
  next();
}

const validateProfilePicture = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (file.size > MAX_FILE_SIZE) {
    return res.status(400).json({ error: "A File Exceeds the 50MB limit" });
  }

  next();
}



const uploadImage = [upload.array('photos', 3), validateFiles, async (req, res, next) => {
  //post with no image
  if (!req.files || req.files.length === 0) {
    req.supabaseUrls = [];
    return next();
  }

  //Main Logic

  try {
    const uploadPromise = req.files.map(async (file) => {
      const fileName = `${file.originalname.replace(/\s+/g, '-')}_${Date.now()}`;
      const { error } = await supabase.storage.from("Post_Images").upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

      if (error) throw new Error(`Error uploading file: ${file.originalname}`);

      const { data: urlData } = supabase.storage.from("Post_Images").getPublicUrl(fileName);

      return urlData.publicUrl;
    });

    req.supabaseUrls = await Promise.all(uploadPromise);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.message || "Error uploading" });
  }
}]

const uploadProfilePic = [upload.single("profilePic"), validateProfilePicture, async (req, res, next) => {
  if (!req.file) {
    req.supabaseUrl = null
    return next();
  }

  try {
    const fileName = `${req.file.originalname.replace(/\s+/g, '-')}_${Date.now()}`;
    const { error } = await supabase.storage.from("Profile_Picture").upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: true
    })
    if (error) throw new Error("Error uploading file");

    const { data } = supabase.storage.from("Profile_Picture").getPublicUrl(fileName);
    req.supabaseUrl = data.publicUrl;

    next();
  } catch (err) {
    return res.status(400).json({ error: err.message || "Error uploading" });
  }
}]

module.exports = {
  uploadImage,
  uploadProfilePic
}
