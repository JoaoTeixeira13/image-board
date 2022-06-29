const express = require("express");
const app = express();
const db = require("./db");

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

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
