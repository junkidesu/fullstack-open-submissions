import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, onChange }) => (
  <div>
    find countries <input value={value} onChange={onChange} />
  </div>
)

const CountryItem = ({ country, onCountryClick }) => (
  <div>
    {country.name.common} <button onClick={() => onCountryClick(country.name.common)}>show</button>
  </div>
)

const GeographyData = ({ capital, area }) => (
  <>
    <p>capital {capital}</p>
    <p>area {area}</p>
  </>
)
const Languages = ({ languages }) => (
  <ul>
    {languages.map(lang => <li key={lang}>{lang}</li>)}
  </ul>
)

const Flag = ({ flagUrl, alt }) => (
  <img src={flagUrl} alt={alt} />
)

const CountryData = ({ country }) => {
  const languages = Object.values(country['languages'])

  return (
    <div>
      <h1>{country.name.common}</h1>

      <GeographyData
        capital={country.capital[0]}
        area={country.area}
      />

      <h4>languages:</h4>
      <Languages languages={languages} />

      <Flag
        flagUrl={country.flags.png}
        alt={`flag of ${country.name.common}`}
      />
    </div>
  )
}

const Countries = ({ countries, onCountryClick }) => {
  const found = countries.length

  if (found > 10) {
    return <p>Too many countries, specify another filter</p>
  }

  else if (found > 1 && found <= 10) {
    return (
      <div>
        {countries.map(c => <CountryItem onCountryClick={onCountryClick} key={c.name.common} country={c} />)}
      </div>
    )
  }

  else if (found === 1) {
    return (
      <CountryData country={countries[0]} />
    )
  }

  return (
    <div>
      <p>No countries found</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  const filteredCountries = countries
    .filter(c => c.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <Filter value={filter} onChange={event => setFilter(event.target.value)} />
      <Countries countries={filteredCountries} onCountryClick={country => setFilter(country)} />
    </div>
  )
}

export default App