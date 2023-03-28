const { Router } = require("express");
const multer = require("multer");
const nanoid = require('nanoid')
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

router.post("/create_blog", upload.single("image"), (req, res) => {
  const id = req.query.edit_id;
  const { title, date, comment } = req.body;
  const image = req?.file?.filename;

  if (title && date && comment) {
    fs.readFile("./database/blogs.json", (err, blogs) => {
      if (err) throw err;
      const hasanBlogs = JSON.parse(blogs);
      const singleBlog = hasanBlogs.find((blog) => blog.id == id);
      hasanBlogs.unshift({
        ...req.body,
        id: nanoid.nanoid(),
        image: image ? image : singleBlog.image,
      });
      let newHasanBlogs;
      if (id) {
        newHasanBlogs = JSON.stringify(
          BlogsFunc(hasanBlogs.filter((blog) => blog.id != id))
        );
      } else {
        newHasanBlogs = JSON.stringify(BlogsFunc(hasanBlogs));
      }
      fs.writeFile("./database/blogs.json", newHasanBlogs, (err) => {
        if (err) throw err;
        res.render("create_blog", { success: true });
      });
    });
  } else {
    res.render("create_blog", {
      title,
      date,
      comment,
    });
  }
});

const BlogsFunc = (blogs) => {
  const newBlogs = blogs.map((current) => {
    if (typeof current?.date == "string") {
      const splitedDate = current.date?.split("-");
      const monthNumberToName = (monthNum) => {
        switch (monthNum) {
          case "01":
            return "January";
          case "02":
            return "February";
          case "03":
            return "March";
          case "04":
            return "April";
          case "05":
            return "May";
          case "06":
            return "June";
          case "07":
            return "July";
          case "08":
            return "August";
          case "09":
            return "September";
          case "10":
            return "October";
          case "11":
            return "November";
          case "12":
            return "December";
          default:
            return "";
        }
      };
      current.date = {
        year: splitedDate[0],
        month: monthNumberToName(splitedDate[1]),
        day: splitedDate[2],
      };
    }
    return current;
  });
  return newBlogs;
};

router.get("/create_blog", (req, res) => {
  const id = req.query.edit_id;
  if (id) {
    fs.readFile("./database/blogs.json", (err, blogs) => {
      if (err) throw err;
      const hasanBlogs = JSON.parse(blogs);
      const editableBlog = hasanBlogs.find((blog) => blog.id == id);
      res.render("create_blog", {
        title: editableBlog.title,
        date: `${editableBlog.date.year}-${monthNameToNumber(
          editableBlog.date.month
        )}-${editableBlog.date.day}`,
        comment: editableBlog.comment,
        edit_id: id,
      });
    });
  } else {
    res.render("create_blog");
  }
});

const monthNameToNumber = (monthName) => {
  switch (monthName) {
    case "January":
      return "01";
    case "February":
      return "02";
    case "March":
      return "03";
    case "April":
      return "04";
    case "May":
      return "05";
    case "June":
      return "06";
    case "July":
      return "07";
    case "August":
      return "08";
    case "September":
      return "09";
    case "October":
      return "10";
    case "November":
      return "11";
    case "December":
      return "12";
    default:
      return "";
  }
};


module.exports = router;
