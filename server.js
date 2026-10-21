const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
// Add your Express setup here...

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});