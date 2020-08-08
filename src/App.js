import React, { useState, useEffect } from 'react';
import { Card, MenuItem, FormControl, Select, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import './App.css';

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);

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
                    
                    setTableData(data);
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
                    <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>

                    <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
                    
                    <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
                </div>

                <Map />
                
            </div>

            <Card className="app__right">
                <CardContent>
                    <h3>I am a card onm right side</h3>
                    <Table countries={tableData} />
                    <h3>World wide new cases</h3>
                </CardContent>
            </Card>
        </div>
    );
}

export default App;