const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 3000;
app.listen(port, "64.23.212.196", () => {
  console.log(`Call Center Server is listening on 64.23.212.196:${port}`);
});
