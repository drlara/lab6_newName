import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "miguel-lara.site",
    user: "miguella_webuser",
    password: "Cst-336",
    database: "miguella_quotes",
    connectionLimit: 10,
    waitForConnections: true
});
const conn = await pool.getConnection();

//routes
app.get('/', async (req, res) => {
    let sql = `SELECT *
    FROM authors
    WHERE authorId = 1 `;
    const [rows] = await conn.query(sql);
   res.render('home.ejs', {rows});
});

//api to get all the info for a specific author
//using route parameters
app.get('/api/authors/:authorId', async(req, res) => {
    let id = req.params.authorId;
    let sql = `SELECT *
               FROM authors
               WHERE authorId = ? `;
    let sqlParams = [id];
    const [rows] = await conn.query(sql, sqlParams);
    res.send(rows)
 });

app.get('/searchByKeyword', async(req, res) => {
    let keyword = req.query.keyword;
    console.log(keyword);
    let sql = `SELECT authorId, quote, firstName, lastName
               FROM quotes
               NATURAL JOIN authors
               WHERE quote LIKE ?`;
    //preventing SQL injection               
    let sqlParams = [`%${keyword}%`];
    const [rows] = await conn.query(sql, sqlParams);
    console.log(rows);
    res.render('quotes.ejs', {rows})
 });

app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.send(rows);
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})