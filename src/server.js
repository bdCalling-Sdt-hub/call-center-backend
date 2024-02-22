const app = require("./app");
require("dotenv").config();
// const port = process.env.PORT || 3001;

// app.get('/', (req, res) => {
//     res.send('Call Center Backend is Runinng!')
// })

// app.listen(port, () => {
//     console.log(`Call Center is listening on port ${port}`)
// })

const port = process.env.PORT || 3000;
app.listen(port, "45.55.201.7", () => {
  console.log(`Call Center Server is listening on 192.168.10.3:${port}`);
});
