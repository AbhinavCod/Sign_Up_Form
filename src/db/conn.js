const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1/signup", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection SuccessFull");
  })
  .catch((err) => {
    console.log("No Connection!!!");
  });
