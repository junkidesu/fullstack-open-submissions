import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = ({ onSubmit, name, onNameChange, number, onNumberChange }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={name} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={number} onChange={onNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person =>
      <Person
        key={person.id}
        person={person}
        deletePerson={() => deletePerson(person)}
      />)}
  </div>
)

const Person = ({ person, deletePerson }) => {
  return (
    <div>
      {person['name']} {person['number']} <button onClick={deletePerson}>delete</button>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const handleAdd = (event) => {
    event.preventDefault()

    if (persons.some(p => p.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        replaceNumber()
      }
    } else {
      addPerson()
    }

    setNewName('')
    setNewNumber('')
  }

  const replaceNumber = () => {
    const person = persons.find(p => p.name === newName)
    const changedPerson = { ...person, number: newNumber }

    personService
      .update(changedPerson)
      .then(newPerson => {
        setPersons(persons.map(p => p.id !== newPerson.id ? p : newPerson))
      })
  }

  const addPerson = () => {
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(addedPerson => {
        setPersons(persons.concat(addedPerson))
      })
  }

  const deletePerson = person => {
    if (window.confirm(`Delete ${person['name']}?`)) {
      personService
        .remove(person.id)
        .then(response => {
          const newPersons = persons.filter(p => p.id !== person.id)
          setPersons(newPersons)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={event => setFilter(event.target.value)} />

      <h3>add a new</h3>

      <PersonForm
        onSubmit={handleAdd}
        name={newName}
        onNameChange={event => setNewName(event.target.value)}
        number={newNumber}
        onNumberChange={event => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>

      <Persons
        persons={filteredPersons}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App