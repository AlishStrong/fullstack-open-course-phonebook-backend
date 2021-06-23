require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const personService = require('./models/personService');
const app = express();

app.use(express.static('build'))
app.use(express.json());

morgan.token('req-body', function getId (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ' ';
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

const personsEndpoint = '/api/persons';

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
  personService.getAllPersons()
    .then(persons => {
      const peopleNumber = persons.length;
      const requestTime = new Date();
      res.send(
        '<div>' +
          `<p>Phonebook has info for ${peopleNumber === 1 ? peopleNumber + ' person' : peopleNumber + ' people'}</p>` +
          `<p>${requestTime}</p>` +
        '</div>'
      );
    });
});

app.get(personsEndpoint, (req, res) => {
  personService.getAllPersons()
    .then(persons => res.json(persons));
});

app.get(`${personsEndpoint}/:id`, (req, res) => {
  personService.getPersonById(req.params.id)
    .then(person => person ? res.json(person) : res.status(404).end())
    .catch(_ => res.status(500).end());
});

app.put(`${personsEndpoint}/:id`, (req, res) => {
  personService.updatePerson(req.params.id, req.body.number)
    .then(updatedPerson => updatedPerson ? res.json(updatedPerson) : res.status(404).end());
});

app.post(personsEndpoint, (req, res) => {
  personService.addPerson(req.body)
    .then(result => {
      if (result.error) {
        res.status(400).json(result);
      } else {
        res.json(result);
      }
    });
});

app.delete(`${personsEndpoint}/:id`, (req, res) => {
  personService.deletePerson(req.params.id)
    .then(_ => res.status(204).end());
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Phonebook backend listens on port ${PORT}`));
