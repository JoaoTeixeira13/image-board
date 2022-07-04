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
            res.json(images);
        })
        .catch((err) => {
            console.log("error is ", err);
        });
});

app.get("/getImages/:image", (req, res) => {
    db.getSpecificImage(req.params.image).then((result) => {
        res.json(result.rows[0]);
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
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;

    if (url && req.body.user && req.body.title) {
        db.uploadImage(url, req.body.user, req.body.title, req.body.description)
            .then((result) => {
                res.json({
                    sucess: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    } else {
        console.log("insuficient information provided");
    }

    //now its time to store the url, and all the other data in the database
    //return the values to the server
    //and have the server send the newly add image data back to the clientside
});

app.get("/comments/:imageId", (req, res) => {
    db.getImageComments(req.params.imageId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error is ", err);
        });
});

app.post("/comment", (req, res) => {
    if (req.body.comment && req.body.username) {
        db.uploadComment(req.body.comment, req.body.username, req.body.image_id)
            .then((result) => {
                
                res.json({
                    sucess: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    }
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
