const Papa = require("papaparse");

// Your code that uses Papa Parse here

function fetchCSV(filePath) {
  Papa.parse(filePath, {
    download: true,
    complete: function (results) {
      console.log("Parsing complete:", results.data);
      if (results.data && results.data.length > 0) {
        // Handle successful data parsing here
      } else {
        // Handle no data scenario here
      }
    },
    error: function (err) {
      if (err.code === "NotFound") {
        alert("CSV file does not exist");
      } else {
        alert("An error occurred while loading the CSV file");
      }
      console.error("Error loading CSV file:", err);
    },
  });
}
fetchCSV("class/11/A/January/morning.csv");
