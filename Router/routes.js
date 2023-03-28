const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = new Router();


// configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

let upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }

    cb(undefined, true);
  },
  storage: storage,
});


// render home page
router.get("/", (req, res) => {
  res.render("home");
});


module.exports = router;
