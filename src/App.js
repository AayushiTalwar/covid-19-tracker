// import logo from './logo.svg';
import React, { useEffect, useState} from "react";
import './App.css';
import {sortData, prettyPrintStat} from './util.js';
import Table from './Table';
import Map from "./Map.js"
import InfoBox from './InfoBox.js';
import LineGraph from "./LineGraph";
import {
  MenuItem,
  FormControl,
  Select, 
  Card,
  CardContent
} from "@material-ui/core"

import "leaflet/dist/leaflet.css";

function App() {
  const [casesType, setCasesType] = useState("cases");
  const[countries, setCountries] = useState([]);
  const[country, setCountry] = useState ('worldwide');
  const[countryInfo, setCountryInfo] = useState({});
  const[TableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const[mapCountries, setMapCountries] = useState([]);
  // STATE - How to write a variable in react
 
  // https://disease.sh/v3/covid-19/countries
 
  // USEFFECT = runs a piece of code based on some given condition
  // but useEffect is generally used when something loads and if we put something in square braces 
  // toh say if anything in the square braces changes toh tab dubara reload hoga jo bhi useEffect ke andar hai 
 
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);
  useEffect(()=>{
  // The code inside here runs only once when the component loads and not again  

  // aync - send a request to server, wait for the request to be answered and then do something with the data we have got
    const getCountriesData = async()=> {
      await fetch ("https://disease.sh/v3/covid-19/countries").then((response)=>response.json()).then((data)=> {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  },[]);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;
    console.log("dvn", countryCode);
    setCountry(countryCode);

    const url = countryCode ==='worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })

  }; 
  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        {/* title + select input dropdown field */}

        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant = "outlined" onChange = {onCountryChange} value = {country}>
              <MenuItem value ="worldwide">Worldwide</MenuItem>
              {
                countries.map ((country)=>(
                  <MenuItem value = {country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox isRed = {true} active ={casesType === "cases"} onClick={(e) => setCasesType("cases")} title=  "CoronaVirus Cases" cases = {prettyPrintStat(countryInfo.todayCases)} total = {prettyPrintStat(countryInfo.cases)} />
          <InfoBox active ={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title= "CoronaVirus Recovered" cases ={prettyPrintStat( countryInfo.todayRecovered)} total = {prettyPrintStat(countryInfo.recovered)} />
          <InfoBox isRed = {true} active ={casesType === "deaths"} onClick={(e) => setCasesType("deaths")} title= "CoronaVirus Deaths" cases ={countryInfo.todayDeaths} total = {countryInfo.deaths} />
        </div>
        {/* Map */}
        <Map casesType={casesType} center ={mapCenter} zoom = {mapZoom} countries = {mapCountries}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          {/* Table */}
          <Table countries={TableData}  />
          <h3 className = "app__graphTitle">Worldwide New {casesType}</h3>
          {/* Graph */}
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
