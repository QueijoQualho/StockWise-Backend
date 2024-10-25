import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    file.originalname = file.originalname.replace(/\s+/g, "_");
    callback(null, true);
  },
});

export default upload;
