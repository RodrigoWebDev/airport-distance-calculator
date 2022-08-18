/* schiphol */
import React, { useState, useEffect, SetStateAction, Dispatch } from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CountUp from 'react-countup';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
  const isDesktop = useMediaQuery('(min-width:663px)');
  const [airportListOne, setAirportListOne] = useState<AirportListInterface[] | []>([])
  const [airportListTwo, setAirportListTwo] = useState<AirportListInterface[] | []>([])
  const [airportOneInfo, setAirportOneInfo] = useState<AirportListInterface | null>(null)
  const [airportTwoInfo, setAirportTwoInfo] = useState<AirportListInterface | null>(null)
  const [distanceInNmi, setDistanceInNmi] = useState<number | null>(null)
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
      return d;
    }

    return null
  }

  useEffect(() => {
    if(airportOneInfo && airportTwoInfo){
      const lat1 = airportOneInfo?.location.lat
      const lon1 = airportOneInfo?.location.lon
      const lat2 = airportTwoInfo?.location.lat
      const lon2 = airportTwoInfo?.location.lon
      const nmi = 0.539956803
      const distanceInKm = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
      const distanceInNmi = distanceInKm && (distanceInKm * nmi)

      console.log("distanceInKm", distanceInKm?.toFixed(2))
      console.log("distanceInNmi", distanceInNmi?.toFixed(2))
      console.log({ distanceInNmi })

      setDistanceInNmi(distanceInNmi)
    }
  }, [airportOneInfo, airportTwoInfo])

  const mainTitleVariant = () => isDesktop ? 'h1' : 'h2'

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="md">
        <Typography 
          variant={mainTitleVariant()} 
          component="h1"
          gutterBottom
          align="center"
          color="white"
        >
            Airport distance calculator
        </Typography>
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap'
        }}>
          <Box sx={{ 
            marginRight: isDesktop ? '16px' : '0',
            marginBottom: isDesktop ? '0': '16px'
          }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={airportListOne}
              sx={{ width: 300 }}
              getOptionLabel={option => option.name}
              onInputChange={(e, term) => getAirportOne(term)}
              onChange={(e, newValue) => {
                setAirportOneInfo(newValue)
              }}
              renderInput={params => <TextField {...params} label="Select the first airport" />}
          />
          </Box>

          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={airportListTwo}
            sx={{ width: 300 }}
            getOptionLabel={option => option.name}
            onInputChange={(e, term) => getAirportTwo(term)}
            onChange={(e, newValue) => {
              setAirportTwoInfo(newValue)
            }}
            renderInput={params => <TextField {...params} label="Select the second airport" />}
          />
        </Box>

        {(airportOneInfo && airportTwoInfo) && 
          <Box sx={{ marginTop: '16px'}}>
            <Typography 
              variant="h2" 
              gutterBottom
              align="center"
              color="white"
            >
              <CountUp 
                end={distanceInNmi || 0} 
                decimals={2} 
                decimal="," 
              /> NMI
            </Typography>
          </Box>
        }
      </Container>
    </ThemeProvider>
  )
}

export default Index

