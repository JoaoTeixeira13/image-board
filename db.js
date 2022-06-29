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
    return db.query(`SELECT * FROM images`);
};
