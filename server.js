const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.static("public"));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/boards', (req, res) => {
    const boards = [
        {
          "_id": 1,
          "image_source": "images/Cards.png",
          "title": "Sample Board",
          "num_cards": 6,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/16/2025"
        },
        {
          "_id": 2,
          "image_source": "images/Cards.png",
          "title": "Sample Board 2",
          "num_cards": 7,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/8/2025"
        },
        {
          "_id": 3,
          "image_source": "images/Cards.png",
          "title": "Sample Board 3",
          "num_cards": 6,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/16/2025"
        },
        {
          "_id": 4,
          "image_source": "images/Cards.png",
          "title": "Sample Board 4",
          "num_cards": 7,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/8/2025"
        },
        {
          "_id": 5,
          "image_source": "images/Cards.png",
          "title": "Sample Board 5",
          "num_cards": 6,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/16/2025"
        },
        {
          "_id": 6,
          "image_source": "images/Cards.png",
          "title": "Sample Board 6",
          "num_cards": 7,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/8/2025"
        },
        {
          "_id": 7,
          "image_source": "images/Cards.png",
          "title": "Sample Board 7",
          "num_cards": 6,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/16/2025"
        },
        {
          "_id": 8,
          "image_source": "images/Cards.png",
          "title": "JSON Name",
          "num_cards": 7,
          "num_categories": 3,
          "percent_done": "10%",
          "modified_date": "2/8/2025"
        }
      ]
    res.send(boards);
})

app.listen(3000, () => {
    console.log("Listening");
});