const spicedPg = require("spiced-pg");
//below we have information that we need for our db connection
//which db do we talk to?
const database = "imageboard";

//which user is running our queries in the db?
const username = "postgres";

////whats the user's passwors?
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

module.exports.getImages = () => {
    return db.query(`SELECT * FROM images
    ORDER BY id DESC
    LIMIT 6`);
};
module.exports.getSpecificImage = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

module.exports.uploadImage = (url, username, title, description) => {
    const q = `INSERT INTO images(url, username, title, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *
    `;
    const param = [url, username, title, description];
    return db.query(q, param);
};

module.exports.getImageComments = (imageId) => {
    return db.query(
        `SELECT comments.comment, comments.username, comments.created_at
        FROM comments
        WHERE comments.image_id = $1`,
        [imageId]
    );
};

module.exports.uploadComment = (comment, username, image_id) => {
    const q = `INSERT INTO comments(comment, username, image_id)
     VALUES ($1, $2, $3)
     RETURNING *
    `;
    const param = [comment, username, image_id];
    return db.query(q, param);
};

module.exports.fetchMoreImages = (smallestId) => {
    return db.query(
        `SELECT url, title, id, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId"
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
        [smallestId]
    );
};

module.exports.countImages = () => {
    return db.query(`SELECT COUNT (*) FROM images`);
};
