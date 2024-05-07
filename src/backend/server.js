// server.js
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors()); // Enable CORS to allow your React app to make requests to this server

app.get("/check-file", (req, res) => {
  const filePath = req.query.filePath;

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.send({ exists: false });
    }
    res.send({ exists: true });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
