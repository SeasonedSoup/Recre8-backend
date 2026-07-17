require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send("HI IM RECRE-8 API");
})

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, (err) => {
    if (err) {
        throw err;
    }

    console.log(`The server is now listening at http://localhost:${PORT}`);
})

