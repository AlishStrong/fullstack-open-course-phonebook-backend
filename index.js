const express = require('express');
const app = express();

app.use(express.json());

const randomId = () => Math.random() * Math.random();

let persons = [
  { 
    'name': 'Arto Hellas', 
    'number': '040-123456',
    'id': 1
  },
  { 
    'name': 'Ada Lovelace', 
    'number': '39-44-5323523',
    'id': 2
  },
  { 
    'name': 'Dan Abramov', 
    'number': '12-43-234345',
    'id': 3
  },
  { 
    'name': 'Mary Poppendieck', 
    'number': '39-23-6423122',
    'id': 4
  }
];

app.get('/info', (req, res) => {
  const peopleNumber = persons.length;
  const requestTime = new Date();
  res.send(
    '<div>' +
      `<p>Phonebook has info for ${peopleNumber === 1 ? peopleNumber + ' person' : peopleNumber + ' people'}</p>` +
      `<p>${requestTime}</p>` +
    '</div>'
  );
});

const personsEndpoint = '/api/persons';

app.get(personsEndpoint, (req, res) => {
  res.json(persons);
});

app.get(`${personsEndpoint}/:id`, (req, res) => {
  const personId = +req.params.id;
  if (!!personId) {
    const person = persons.find(p => p.id === personId);
    if (person) {
      res.json(person);
    }
  }
  res.status(404).end();
});

app.post(personsEndpoint, (req, res) => {
  const person = {...req.body, id: randomId()}
  persons.push(person);
  res.json(person);
})

app.delete(`${personsEndpoint}/:id`, (req, res) => {
  const personId = +req.params.id;
  persons = persons.filter(p => p.id !== personId);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Phonebook backend listens on port ${PORT}`));
