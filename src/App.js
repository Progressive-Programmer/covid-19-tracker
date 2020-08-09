import React, { useState, useEffect } from 'react';
import { Card, MenuItem, FormControl, Select, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import './App.css';
import { sortData, prettyPrintStat } from "./util";
import Linegraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");

// STATE = the way to write variables in react

// USEEFFECT = Runa a piece of code based on a given condition
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
        .then(response => response.json())
        .then((data) => {
            setCountryInfo(data);
        })
    }, [])




    useEffect(() => {
        // async -> send a request, wait for it , do something wiht it 
        // code inside here will run once when the app component loads and not after
        const getCountriesData = async () =>{
            await fetch("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((data) => {
                const countries = data.map((country) => (
                    {
                        name: country.country,          //India, United Stated, United Kingdon.....
                        value: country.countryInfo.iso2,       //UK, USA, IN
                    }));
                    
                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data); 
                    setCountries(countries);
                });

        };
        getCountriesData();
    }, []);


    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        console.log("Youooo>>>>>", countryCode);
        setCountry(countryCode);

        const url = countryCode === 'worldwide' 
            ? 'https://disease.sh/v3/covid-19/all' 
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`
         
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                //all of the date... from the country response
                setCountryInfo(data);
                // Move map to the location of country selected
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);


        })
    };


    console.log('COUNTRY INFO>>>>', countryInfo)
    return ( 
        <div className = "app" >
            <div className="app__left">  
                <div className="app__header">                   
                    <h1 > COVID 19 TRACKER </h1> 
                    <FormControl className = "app__dropdown">
                        <Select variant = "outlined" onChange= {onCountryChange} value = {country} >
                            <MenuItem value = "worldwide">Worldwide</MenuItem>
                            {countries.map(country => (
                                    <MenuItem value = {country.value}>{country.name }</MenuItem> 
                                ))}
                        
                        </Select>        
                    </FormControl>                    
                </div>                        
                    
                <div className="app__stats">
                    <InfoBox
                    isRed 
                    active={casesType === "cases"}
                    onClick={(e) => setCasesType('cases')}
                    title="Coronavirus Cases" 
                    cases={prettyPrintStat(countryInfo.todayCases)} 
                    total={prettyPrintStat(countryInfo.cases)}/>

                    <InfoBox 
                    active={casesType === "recovered"}
                    onClick={(e) => setCasesType('recovered')}
                    title="Recovered" 
                    cases={prettyPrintStat(countryInfo.todayRecovered)} 
                    total={prettyPrintStat(countryInfo.recovered)} />
                    
                    <InfoBox
                    isRed 
                    active={casesType === "deaths"}
                    onClick={(e) => setCasesType('deaths')} 
                    title="Deaths" 
                    cases={prettyPrintStat(countryInfo.todayDeaths)} 
                    total={prettyPrintStat(countryInfo.deaths)} />
                </div>

                <Map casesType = {casesType}
                    countries = { mapCountries} 
                    center = {mapCenter}
                    zoom = { mapZoom }
                    />
                
            </div>

            <Card className="app__right">
                <CardContent>
                    <h3>Live cases by country </h3>
                    <Table countries={tableData} />
                    <h3 className="app__graphTitle">World wide new {casesType} </h3>
                    <Linegraph className="app__graph" casesType = {casesType} />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;