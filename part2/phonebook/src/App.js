import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: '040-123456',
      id: 1
    },
    {
      name: 'Ada Lovelace',
      number: '39-44-5323523',
      id: 2
    },
    {
      name: 'Dan Abramov',
      number: '12-43-234345',
      id: 3
    },
    {
      name: 'Mary Poppendieck',
      number: '39-23-6423122',
      id: 4
    }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const onFilterChange = (event) => setFilter(event.target.value)
  const onNameChange = (event) => setNewName(event.target.value)
  const onNumberChange = (event) => setNewNumber(event.target.value)

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
      number: newNumber,
      id: persons.length + 1
    }

    if (alreadyAdded(newPerson)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(newPerson))
      
      setNewName('')
      setNewNumber('')
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      
      <Filter value={filter} onChange={onFilterChange} />
      
      <h3>add a new</h3>
      
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        onNameChange={onNameChange}
        number={newNumber}
        onNumberChange={onNumberChange}
      />
      
      <h3>Numbers</h3>
      
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App