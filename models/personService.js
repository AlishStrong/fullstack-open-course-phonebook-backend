const Person = require('./person');

const getAllPersons = () => Person.find({}).catch(console.error);

const getPersonById = id => Person.findById(id).catch(console.error);

const updatePerson = (personId, newNumber) => {
  return getPersonById(personId)
    .then(person => {
      if (person) {
        return person;
      } else {
        throw new Error(`Person with id ${personId} was not found`);
      }
    })
    .then(foundPerson => {
      foundPerson.number = newNumber;
      return foundPerson.save();
    })
    .catch(console.error);
};

const addPerson = person => {
  return checkPersonData(person)
    .then(_ => Person.findOne({ name: person.name }))
    .then(foundPerson => {
      if (foundPerson) {
        if (String(foundPerson.number) === String(person.number)) {
          return { error: `Person ${person.name} with number ${person.number} already exists!`};
        } else {
          return updatePerson(foundPerson._id, person.number);
        }
      } else {
        const newPerson = new Person({
          name: person.name,
          number: person.number
        });
        return newPerson.save();
      }
    })
    .catch(error => {
      console.log(error);
      return error;
    });
};

const deletePerson = personId => Person.findByIdAndRemove(personId);

const checkPersonData = person => {
  return new Promise((resolve, reject) => {
    if (!person.name && !person.number) {
      reject({ error: 'name and number are missing!' });
    } else if (!person.name) {
      reject({ error: 'name is missing!' });
    } else if (!person.number) {
      reject({ error: 'number is missing!' });
    } else {
      resolve();
    }
  });
};

module.exports = { getAllPersons, getPersonById, updatePerson, addPerson, deletePerson };
