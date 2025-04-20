const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

let cards = [
    {
      "id": 1,
      "title": "To Do",
      "cards": [
        {
          "id": 1,
          "header": "Create A",
          "task1Name": "testTask",
          "task2Name": "testTask2",
          "statusClass": "critical",
          "classDisplay": "Critical"
        },
        {
          "id": 2,
          "header": "Do Z",
          "task1Name": "testTaskVeryUrgent",
          "task2Name": "testTask2",
          "statusClass": "urgent",
          "classDisplay": "Urgent"
        },
        {
          "id": 3,
          "header": "Create Y",
          "task1Name": "Needs X",
          "task2Name": "Needs Y"
        }
      ]
    },
    {
      "id": 2,
      "title": "In Progress",
      "cards": [
        {
          "id": 4,
          "header": "Do Y",
          "task1Name": "testTaskVeryUrgent3",
          "task2Name": "testTask24234",
          "statusClass": "urgent",
          "classDisplay": "Urgent"
        },
        {
          "id": 5,
          "header": "Create Y",
          "task1Name": "Needs X",
          "task2Name": "Needs Y",
          "statusClass": "urgent",
          "classDisplay": "Urgent"
        },
        {
          "id": 6,
          "header": "Create Z",
          "task1Name": "Needs X",
          "task2Name": "Needs Y",
          "statusClass": "non-urgent",
          "classDisplay": "Not Urgent",
          "embeddedContent": {
            "type": "iframe",
            "src": "https://www.youtube.com/embed/wDchsz8nmbo?si=rVIMruHPL_vWDH7R",
            "className": "videoplayer"
          }
        }
      ]
    },
    {
      "id": 3,
      "title": "Done",
      "cards": [
        {
          "id": 7,
          "header": "Create XYZ",
          "task1Name": "Needs X",
          "task2Name": "Needs Y",
          "statusClass": "critical",
          "classDisplay": "Critical"
        },
        {
            "id": 8,
            "header": "Create XYZ JSON test",
            "task1Name": "Needs X",
            "task2Name": "Needs Y",
            "statusClass": "critical",
            "classDisplay": "Critical"
          }
      ]
    }
  ]

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/boards', (req, res) => {
    res.sendFile(__dirname + "/data.json");
})

app.get('/api/columns', (req, res) => {
    res.send(cards);
})

app.post('/api/columns/:columnId', (req, res)=>{
    const result = validateCard(req.body);
    const columnId = parseInt(req.params.columnId);
    let status;
    if(result.error){
        console.log("I have an error");
        res.status(400).send(result.error.details[0].message);
        return;
    }

    console.log(req.body.statusClass, "checking for")
    switch(req.body.statusClass){
        case 'non-urgent':
            status = 'Not Urgent'
            console.log(status, "=")
            break;
        case 'critical':
            status = 'Critical'
            console.log(status, "=")
            break;
        case 'urgent':
            status = 'Urgent'
            console.log(status, "=")
            break;
    }
    const column = cards[columnId-1];
    console.log(columnId);
    console.log(column);
    const card = {
        id: column.cards[column.cards.length-1].id + 1,
        header:req.body.header,
        task1Name:req.body.task1Name,
        task2Name:req.body.task2Name,
        statusClass:req.body.statusClass,
        classDisplay:status,
    };

    console.log(card);

    //column.push(card);
    column.cards.push(card);
    console.log(column)
    res.status(200).send(column);
});

app.put('/api/columns/:columnId/cards/:cardId', (req, res) => {
    const columnId = parseInt(req.params.columnId);
    const cardId = parseInt(req.params.cardId);
    const result = validateCard(req.body);
    const updateData = req.body;
    console.log(result)
    console.log(req.body)
    if(result.error){
        console.log("I have an error");
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const column = cards.find(card => card.id === columnId);
    if (!column) {
        return res.status(404).send('Column not found');
    }

    const card = column.cards.find(card => card.id === cardId);
    if (!card) {
        return res.status(404).send('Card not found');
    }

    Object.assign(card, updateData);
    res.json(card);
});

app.delete('/api/columns/:columnId/cards/:cardId', (req, res) => {
    const columnId = parseInt(req.params.columnId);
    const cardId = parseInt(req.params.cardId);
    const result = validateCard(req.body);
    const updateData = req.body;
    console.log(result)
    console.log(req.body)
    if(result.error){
        console.log("I have an error");
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const column = cards.find(card => card.id === columnId);
    if (!column) {
        return res.status(404).send('Column not found');
    }

    const card = column.cards.find(card => card.id === cardId);
    if (!card) {
        return res.status(404).send('Card not found');
    }

    delete card;
});

const validateCard = (cards) => {
    const schema = Joi.object({
        id:Joi.allow(""),
        header:Joi.string().required(),
        task1Name:Joi.string().required(),
        task2Name:Joi.string().required(),
        statusClass:Joi.string().required()
    });

    return schema.validate(cards);
};

app.listen(3000, () => {
    console.log("Listening");
});