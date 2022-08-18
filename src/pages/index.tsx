/* schiphol */
import React, { useState, useEffect, SetStateAction, Dispatch } from "react"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface Location {
  lat: number
  lon: number
}

interface AirportListInterface {
  icao: string
  iata: string
  name: string
  shortName: string
  municipalityName: string
  location: Location
  countryCode: string
}

const Index = () => {
  const [airportListOne, setAirportListOne] = useState<AirportListInterface[] | []>([])
  const [airportListTwo, setAirportListTwo] = useState<AirportListInterface[] | []>([])
  const [airportOneInfo, setAirportOneInfo] = useState<AirportListInterface | null>(null)
  const [airportTwoInfo, setAirportTwoInfo] = useState<AirportListInterface | null>(null)
  const [distanceInKm, setDistanceInKm] = useState<string | null>(null)
  const hasTerm = (term: string) => {
    return term && term.length >= 3
  }

  const getAirport = (term: string, setAirport: Dispatch<SetStateAction<[] | AirportListInterface[]>>) => {
    if(hasTerm(term)){
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'e47dec473dmsh3b8a2bfa6834f65p1c1fecjsn8a1cd8d092c4',
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
      };
      
      fetch(`https://aerodatabox.p.rapidapi.com/airports/search/term?q=${term}&limit=10`, options)
        .then(response => response.json())
        .then(({items}) => {
          setAirport(items)
        })
        .catch(err => console.error({err}));
    }
  }

  const getAirportOne = (term: string) => {
    getAirport(term, setAirportListOne)
  }

  const getAirportTwo = (term: string) => {
    getAirport(term, setAirportListTwo)
  }

  const onSubmit = (e) => {
    e.preventDefault()
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180)
  }

  const getDistanceFromLatLonInKm = (lat1?: number, lon1?: number, lat2?: number,lon2?: number) => {
    if(lat1 && lon1 && lat2 && lon2){
      const R = 6371;
      const dLat = deg2rad(lat2-lat1);
      const dLon = deg2rad(lon2-lon1); 
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c;
      return d.toFixed(2);
    }

    return null
  }

  useEffect(() => {
    if(airportOneInfo && airportTwoInfo){
      const lat1 = airportOneInfo?.location.lat
      const lon1 = airportOneInfo?.location.lon
      const lat2 = airportTwoInfo?.location.lat
      const lon2 = airportTwoInfo?.location.lon
      const distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)

      setDistanceInKm(distance)
    }
  }, [airportOneInfo, airportTwoInfo])

  return (
    <>
      <h1>Airport distance calculator</h1>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={airportListOne}
        sx={{ width: 300 }}
        getOptionLabel={option => option.name}
        onInputChange={(e, term) => getAirportOne(term)}
        onChange={(event: any, newValue: string | null) => {
          setAirportOneInfo(newValue)
        }}
        renderInput={params => <TextField {...params} label="Select the first airport" />}
      />

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={airportListTwo}
        sx={{ width: 300 }}
        getOptionLabel={option => option.name}
        onInputChange={(e, term) => getAirportTwo(term)}
        onChange={(event: any, newValue: string | null) => {
          setAirportTwoInfo(newValue)
        }}
        renderInput={params => <TextField {...params} label="Select the second airport" />}
      />

      <h1>{distanceInKm} KM</h1>
    </>
  )
}

export default Index

