const express = require('express');
const morgan = require('morgan');
const app = express();

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

const randomId = () => Math.random() * Math.random();

const checkData = data => {
  if (!data.name && !data.number) {
    return { result: false, error: 'name and number are missing!'};
  } else if (!data.name) {
    return { result: false, error: 'name is missing!'};
  } else if (!data.number) {
    return { result: false, error: 'number is missing!'};
  } else {
    return { result: true };
  }
}

const isNewPersonName = name => {
  const exists = persons.find(p => p.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  return exists ?  { result: false, error: 'name must be unique!'} : { result: true };
};

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
  const dataCheck = checkData(req.body);
  if (dataCheck.result) {
    const nameCheck = isNewPersonName(req.body.name);
    if (nameCheck.result) {
      const person = {...req.body, id: randomId()};
      persons.push(person);
      res.json(person);
    } else {
      return res.status(400).json({ error: nameCheck.error });
    }
  } else {
    return res.status(400).json({ error: dataCheck.error });
  }
});

app.delete(`${personsEndpoint}/:id`, (req, res) => {
  const personId = +req.params.id;
  persons = persons.filter(p => p.id !== personId);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Phonebook backend listens on port ${PORT}`));
