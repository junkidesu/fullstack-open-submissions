import { useState, useEffect } from 'react'
import axios from 'axios'
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

const Persons = ({ persons }) => (
  <div>
    {persons.map(person => <Person key={person.id} person={person} />)}
  </div>
)

const Person = ({ person }) => <p>{person['name']} {person['number']}</p>

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

  const alreadyAdded = (person) => (
    persons.some(p => p.name === person.name)
  )

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber
      //id: persons.length + 1
    }


    if (alreadyAdded(newPerson)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      personService
        .create(newPerson)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          setNewName('')
          setNewNumber('')
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter value={filter} onChange={event => setFilter(event.target.value)} />

      <h3>add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={event => setNewName(event.target.value)}
        number={newNumber}
        onNumberChange={event => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>

      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App