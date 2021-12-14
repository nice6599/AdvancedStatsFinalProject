const csv = require("fast-csv");
const fs = require("fs");

var file = JSON.parse(fs.readFileSync("endproduct.json")); // reads the json
var endPoint = fs.createWriteStream("data.csv"); // creates writaable stream

const csvStream = csv.format({ headers: true, writeHeaders: true }); // defines csv formatting stuff ** not sure this line does anything tbh **
csv.write(file, { headers: true, writeHeaders: true }).pipe(endPoint); // writes the csv stream to the writeable stream.
