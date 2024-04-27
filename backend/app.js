const express = require("express");
const cors = require('cors');
const router = require("./routes/routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT

app.use(express.json())
app.use(cors())
app.use("/api/v1",router)


app.listen(port, ()=>{console.log(`App running on ${port}`)})
