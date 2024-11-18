const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbconnection = require("./Connection/Connection");
const UserRoute = require("./Routes/UserRoutes");

app.use("/users", UserRoute);

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
