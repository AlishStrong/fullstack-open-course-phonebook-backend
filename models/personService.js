const Person = require('./person');

const getAllPersons = () => Person.find({})
  .catch(error => {
    console.error(error);
    throw error;
  });

const getPersonById = id => Person.findById(id)
  .catch(error => {
    console.error(error);
    throw error;
  });

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
    .catch(error => {
      console.error(error);
      throw error;
    });
};

const addPerson = person => {
  const newPerson = new Person({
    name: person.name,
    number: person.number
  });
  
  return newPerson.save()
    .catch(error => {
      console.error(error);
      throw error;
    });
};

const deletePerson = personId => Person.findByIdAndRemove(personId)
  .catch(error => {
    console.error(error);
    throw error;
  });

module.exports = { getAllPersons, getPersonById, updatePerson, addPerson, deletePerson };
