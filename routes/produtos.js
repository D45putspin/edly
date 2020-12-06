const express =  require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
var database = new sqlite3.Database('edly.db', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("OK");
    }
});
function getusers(cb) {
    var sql = "SELECT * FROM Utilizador";
    database.all(sql, function (err, result) {
        cb(result);
    });
}
router.get('/', (req, res, next) => {
    getusers(function (users) {
        res.json(users); 
     });

});
router.post('/', (req, res, next) => {


});
module.exports = router;