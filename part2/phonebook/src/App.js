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

const Person = ({ person, deletePerson }) => (
  <div>
    {person['name']} {person['number']} <button onClick={deletePerson}>delete</button>
  </div>
)

const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }

  const messageStyle = {
    color: success ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(true)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const resetMessage = () => setTimeout(() => setMessage(null), 5000)

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
        setSuccess(true)
        setMessage(`Replaced ${newName}'s phone number`)
        resetMessage()
      })
      .catch(error => {
        setSuccess(false)
        setMessage(error.response.data.error)
        resetMessage()
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
        setSuccess(true)
        setMessage(`Added ${newName}`)
        resetMessage()
      })
      .catch(error => {
        setSuccess(false)
        setMessage(error.response.data.error)
        resetMessage()
      })
  }

  const deletePerson = person => {
    if (window.confirm(`Delete ${person['name']}?`)) {
      personService
        .remove(person.id)
        .then(response => {
          const newPersons = persons.filter(p => p.id !== person.id)
          setPersons(newPersons)
          setSuccess(true)
          setMessage(`Deleted ${person['name']}`)
          resetMessage()
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} success={success} />

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