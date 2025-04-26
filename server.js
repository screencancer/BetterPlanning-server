const express = require("express");
require("dotenv").config();
const cors = require("cors");
const Joi = require("joi");
const app = express();
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const columnsToSeed = [
  {
    id: 1,
    title: "To Do",
    cards: [
      {
        id: 1,
        header: "Create A",
        task1Name: "testTask",
        task2Name: "testTask2",
        statusClass: "critical",
        classDisplay: "Critical",
      },
      {
        id: 2,
        header: "Do Z",
        task1Name: "testTaskVeryUrgent",
        task2Name: "testTask2",
        statusClass: "urgent",
        classDisplay: "Urgent",
      },
      {
        id: 3,
        header: "Create Y",
        task1Name: "Needs X",
        task2Name: "Needs Y",
      },
    ],
  },
  {
    id: 2,
    title: "In Progress",
    cards: [
      {
        id: 4,
        header: "Do Y",
        task1Name: "testTaskVeryUrgent3",
        task2Name: "testTask24234",
        statusClass: "urgent",
        classDisplay: "Urgent",
      },
      {
        id: 5,
        header: "Create Y",
        task1Name: "Needs X",
        task2Name: "Needs Y",
        statusClass: "urgent",
        classDisplay: "Urgent",
      },
      {
        id: 6,
        header: "Create Z",
        task1Name: "Needs X",
        task2Name: "Needs Y",
        statusClass: "non-urgent",
        classDisplay: "Not Urgent",
        embeddedContent: {
          type: "iframe",
          src: "https://www.youtube.com/embed/wDchsz8nmbo?si=rVIMruHPL_vWDH7R",
          className: "videoplayer",
        },
      },
    ],
  },
  {
    id: 3,
    title: "Done",
    cards: [
      {
        id: 7,
        header: "Create XYZ",
        task1Name: "Needs X",
        task2Name: "Needs Y",
        statusClass: "critical",
        classDisplay: "Critical",
      },
      {
        id: 8,
        header: "Create XYZ JSON test",
        task1Name: "Needs X",
        task2Name: "Needs Y",
        statusClass: "critical",
        classDisplay: "Critical",
      },
    ],
  },
];

mongoose
  .connect(
    `mongodb+srv://maddyjohn2030:${process.env.PASS_MONGO}@cluster0.aqknuo0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(async () => {
    console.log("connected to mongodb");
    const count = await Column.countDocuments();
    if (count === 0) {
      console.log("Seeding initial data...");
      await Column.deleteMany({});
      await Column.insertMany(columnsToSeed);
      console.log("Database seeded successfully");
    }
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });
const columnSchema = new mongoose.Schema({
  id: Number,
  title: String,
  cards: [
    {
      id: Number,
      header: String,
      task1Name: String,
      task2Name: String,
      statusClass: String,
      classDisplay: String,
      embeddedContent: {
        type: { type: String },
        src: String,
        className: String,
      },
    },
  ],
});

const Column = mongoose.model("Column", columnSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/boards", (req, res) => {
  res.sendFile(__dirname + "/data.json");
});

app.get("/api/columns", async (req, res) => {
  try {
    const columns = await Column.find();
    res.send(columns);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/columns/:id", async (req, res) => {
  try {
    const result = validateCard(req.body);
    const id = parseInt(req.params.id);
    const column = await Column.findOne({ id: req.params.id });
    let status;
    if (result.error) {
      console.log("I have an error");
      res.status(400).send(result.error.details[0].message);
      return;
    }

    console.log(req.body.statusClass, "checking for");
    switch (req.body.statusClass) {
      case "non-urgent":
        status = "Not Urgent";
        console.log(status, "=");
        break;
      case "critical":
        status = "Critical";
        console.log(status, "=");
        break;
      case "urgent":
        status = "Urgent";
        console.log(status, "=");
        break;
    }
    console.log(id);
    console.log(column);
    const card = {
      id: column.cards[column.cards.length - 1].id + 1,
      header: req.body.header,
      task1Name: req.body.task1Name,
      task2Name: req.body.task2Name,
      statusClass: req.body.statusClass,
      classDisplay: status,
    };

    console.log(card);

    //column.push(card);
    column.cards.push(card);
    await column.save();
    console.log(column);
    res.status(200).send(column);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put("/api/columns/:id/cards/:cardId", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cardId = parseInt(req.params.cardId);
    const result = validateCard(req.body);
    const updateData = req.body;
    console.log(result);
    console.log(req.body);
    if (result.error) {
      console.log("I have an error");
      res.status(400).send(result.error.details[0].message);
      return;
    }

    const column = await Column.findOne({ id: req.params.id });
    if (!column) {
      return res.status(404).send("Column not found");
    }

    const card = column.cards.find((card) => card.id === cardId);
    if (!card) {
      return res.status(404).send("Card not found");
    }

    Object.assign(card, updateData);
    await column.save();
    res.json(card);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete("/api/columns/:id/cards/:cardId", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cardId = parseInt(req.params.cardId);
    const result = validateCard(req.body);
    const updateData = req.body;
    console.log(result);
    console.log(req.body);
    if (result.error) {
      console.log("I have an error");
      res.status(400).send(result.error.details[0].message);
      return;
    }

    const column = await Column.findOne({ id: req.params.id });
    if (!column) {
      return res.status(404).send("Column not found");
    }

    const cardIndex = column.cards.findIndex((card) => card.id === cardId);
    if (cardIndex === -1) {
      return res.status(404).send("Card not found");
    }

    column.cards.splice(cardIndex, 1);
    await column.save();
    res.status(200).send(column);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const validateCard = (cards) => {
  const schema = Joi.object({
    id: Joi.allow(""),
    header: Joi.string().required(),
    task1Name: Joi.string().required(),
    task2Name: Joi.string().required(),
    statusClass: Joi.string().required(),
  });

  return schema.validate(cards);
};

app.listen(3000, () => {
  console.log("Listening");
});
