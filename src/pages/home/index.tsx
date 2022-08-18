//Libs
import React from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CountUp from 'react-countup';

//Components
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CustomAutoComplete from "../../components/CustomAutoComplete";

//Hooks
import useHome from "./hook";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Home = () => {
  const {
    mainTitleVariant,
    isDesktop,
    airportListOne,
    airportListTwo,
    getAirportOne,
    setAirportOneInfo,
    getAirportTwo,
    setAirportTwoInfo,
    airportOneInfo,
    airportTwoInfo,
    distanceInNmi
  } = useHome()

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
            <CustomAutoComplete
              options={airportListOne}
              onInputChange={(e, term) => getAirportOne(term)}
              onChange={(e, newValue) => {
                setAirportOneInfo(newValue)
              }}
              label="Select the first airport"
            />
          </Box>

          <CustomAutoComplete
            options={airportListTwo}
            onInputChange={(e, term) => getAirportTwo(term)}
            onChange={(e, newValue) => {
              setAirportTwoInfo(newValue)
            }}
            label="Select the second airport"
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
                decimal="." 
              /> NMI
            </Typography>
          </Box>
        }
      </Container>
    </ThemeProvider>
  )
}

export default Home

