import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith("image/")) {
    return cb(null, true);
  }
  cb(new Error("Only image uploads are allowed"));
};

const upload = multer({ storage, fileFilter });

export { upload };
