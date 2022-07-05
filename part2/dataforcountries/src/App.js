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

const WeatherReport = ({ weather }) => {
  if (Object.keys(weather).length === 0) {
    return null
  }

  const temperature = weather.main.temp
  const wind = weather.wind.speed

  const iconCode = weather.weather[0].icon
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div>
      <p>temperature {temperature} Celcius</p>
      <img src={iconUrl} />
      <p>wind {wind} m/s</p>
    </div>
  )
}
const CountryData = ({ country }) => {
  const [weather, setWeather] = useState({})

  const capital = country.capital[0]
  const languages = Object.values(country['languages'])

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [])


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

      <h3>Weather in {country.capital[0]}</h3>
      <WeatherReport weather={weather} />
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

  return null
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