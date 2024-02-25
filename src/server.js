const app = require("./app");
require("dotenv").config();

const port = process.env.PORT || 3000;
app.listen(port, "192.168.10.3", () => {
  console.log(`Call Center Server is listening on 192.168.10.3:${port}`);
});
