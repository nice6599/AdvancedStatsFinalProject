const csv = require("fast-csv");
const fs = require("fs");
const fileName = "cityCounty.json"; // constant variable that holds the filename to be written to
fs.appendFileSync(fileName, "["); // starts the file with a braket which will make the end result a Json Array.

var zipcodeMoney = fs
  .createReadStream("us_cities.csv") // creates a readable stream object of the csv file
  .pipe(csv.parse({ headers: true })) // pipes that stream to the csv.parse function from the package
  .on("error", (error) => console.error(error)) // event listener that listens for errors w
  .on("data", (row) => fs.appendFileSync(fileName, JSON.stringify(row) + ",\n")) // event listener runs when each line of data is read and then adds it to the output file in json
  .on("end", (rowCount) => {
    // event listener runs when the stream ends. the stream ends when all the lines of data are read.
    console.log(`Parsed ${rowCount} rows`); // logs rows parsed to console
    fs.appendFileSync(fileName, "]"); // ends the file with a bracket finishing it off and creating a json array
  });
