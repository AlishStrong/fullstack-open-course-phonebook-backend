require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const personService = require('./models/personService');
const app = express();

app.use(express.static('build'))
app.use(express.json());

const errorHandler = (error, request, response, next) => {
  console.error('Index.js', error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if(error.message.indexOf('was not found') !== -1) {
    return response.status(400).end();
  }

  response.status(500).end();
  next(error);
};

morgan.token('req-body', function getId (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ' ';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

const personsEndpoint = '/api/persons';

// get general data about people in DB
app.get('/info', (req, res, next) => {
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
    })
    .catch(error => next(error));
});

// get all people from DB
app.get(personsEndpoint, (req, res, next) => {
  personService.getAllPersons()
    .then(persons => res.json(persons))
    .catch(error => next(error));
});

// get a person by provided id
app.get(`${personsEndpoint}/:id`, (req, res, next) => {
  personService.getPersonById(req.params.id)
    .then(person => person ? res.json(person) : res.status(404).end())
    .catch(error => next(error));
});

// update a person by provided id
app.put(`${personsEndpoint}/:id`, (req, res, next) => {
  personService.updatePerson(req.params.id, req.body.number)
    .then(updatedPerson => updatedPerson ? res.json(updatedPerson) : res.status(404).end())
    .catch(error => next(error));
});

// create a new person
// if provided name exists and number differs, then update the person
app.post(personsEndpoint, (req, res, next) => {
  personService.addPerson(req.body)
    .then(result => {
      if (result.error) {
        res.status(400).json(result);
      } else {
        res.json(result);
      }
    })
    .catch(error => next(error));
});

// delete a person by provided id
app.delete(`${personsEndpoint}/:id`, (req, res, next) => {
  personService.deletePerson(req.params.id)
    .then(_ => res.status(204).end())
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Phonebook backend listens on port ${PORT}`));
