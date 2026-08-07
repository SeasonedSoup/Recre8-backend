const {prisma} = require('../lib/prisma');
const {supabase} = require('../lib/supabase');

const {body, validationResult, matchedData} = require("express-validator");

const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const MAX_FILE_SIZE = 1024 * 1024 * 50

const validateFiles = [
    body("files")
    .custom((_, {req}) => {
        if (!req.files || req.files.length == 0) {
            throw new Error("No Files Found");
        }

        for (const file of req.files) {
             if (file.size > MAX_FILE_SIZE) {
                throw new Error("A File Exceeds the 50MB limit");
            }
        }
        return true;
    })
]


const uploadImage = [upload.array('photos', 3), validateFiles, async(req, res, next) => {
    //validateFiles 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    //Main Logic
    const urlLinks = [];

    for (const file of req.files) {
        const fileName = `${file.originalname.replace(/\s+/g, '-')}_${Date.now()}`;
        const {_, error} = await supabase.from("Post_Images").upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });

        if (error) return res.status(500).json({error: "Error uploading a file"});

        
        const {data: urlData} = await supabase.from("Post_Images").getPublicUrl(fileName);

        urlLinks.push(urlData.publicUrl);

        req.supabaseUrls = urlLinks
        next();
    }
}]

module.exports = {
    uploadImage
}