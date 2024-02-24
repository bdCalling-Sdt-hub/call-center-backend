const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 3000;
app.listen(port, "143.198.26.67", () => {
  console.log(`Call Center Server is listening on 143.198.26.67:${port}`);

});
