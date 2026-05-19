const express = require("express");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Backend running on port ${config.PORT}`);
});
