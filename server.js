const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { extname } = require("path");

app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public"));

app.use(express.json());

app.get("/images", (req, res) => {
    console.log("/images route has been hit");
    db.getImages()
        .then((result) => {
            const images = result.rows;
            console.log("results are ", result.rows);
            res.json(images);
        })
        .catch((err) => {
            console.log("error is ", err);
        });
});

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            //keep the original file extention

            // use extname method to be found on the core path library
            callback(null, `${randomString}${path.extname(file.originalname)}`);
        });
    },
});
const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    console.log("In upload");
    console.log("file", req.file);
    console.log("req.body is ", req.body);
    console.log("our image can be found at url?", "concacanate url here");
    // if (!req.body.title) {
    //     res.json({ error: "Missing field title!" });
    //     return;
    // }
    // res.json({ success: true });
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;

    console.log("url is ", url);
    db.uploadImage(url, req.body.user, req.body.title, req.body.description)
        .then((result) => {
            console.log("result is ", result.rows[0]);

            res.json({
                sucess: true,
                payload: result.rows[0],
            });
        })
        .catch((err) => {
            console.log("error is ", err);
        });

    //now its time to store the url, and all the other data in the database
    //return the values to the server
    //and have the server send the newly add image data back to the clientside
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
