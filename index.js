const express = require('express');
const app = express();

const persons = [
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


const PORT = 3001;
app.listen(PORT, () => console.log(`Phonebook backend listens on port ${PORT}`));