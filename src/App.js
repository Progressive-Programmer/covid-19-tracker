import React, { useState, useEffect } from 'react';
import {
    MenuItem,
    FormControl,
    Select
} from "@material-ui/core";
import './App.css';

function App() {
    const [countries, setCountries] = useState([
        'USA', 'INDIA'
    ]);

// STATE = the way to write variables in react

// USEEFFECT = Runa a piece of code based on a given condition

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
            
                    setCountries(countries);
                });

        };
        getCountriesData();
    }, []);


    return ( 
        <div className = "app" >
        <div className="app__header">
                                
            <h1 > COVID 19 TRACKER </h1> 
            <FormControl className = "app__dropdown">
                <Select variant = "outlined" value = "abc" >

                    {
                        countries.map(country => (
                            <MenuItem value = {country.value}>{country.name}</MenuItem> 
                        ))
                    }

                    {/* <MenuItem value = "worldwide">Worldwide</MenuItem> 
                    <MenuItem value = "worldwide">Option one</MenuItem> 
                    <MenuItem value = "worldwide">Option two</MenuItem> 
                    <MenuItem value = "worldwide">Option three</MenuItem>         */}
                </Select>        
            </FormControl>
        </div>

        { /* Head */ } { /* title + input drop */ }

        { /* InfoBox */ } { /* InfoBox */ } { /* InfoBox */ }


        { /* Table */ } { /* Graph */ }

        { /* Map */ } 
        </div>
    );
}

export default App;