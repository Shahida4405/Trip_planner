import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads", // folder inside backend
  filename: (req, file, cb) => {
    // Make filename unique
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default upload;
