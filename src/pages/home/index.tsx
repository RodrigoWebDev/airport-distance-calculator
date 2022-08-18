//Libs
import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CountUp from 'react-countup'
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api'

//Components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import CustomAutoComplete from '../../components/CustomAutoComplete'

//Hooks
import useHome from './hook'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

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
    distanceInNmi,
    mapOptions,
    onLoadMap, 
    onUnmountMap,
    isLoaded,
    showMapRoute, 
    setShowMapRoute,
    mapZoom, 
    setMapZoom,
    polyLinePath,
    polyLineOptions,
    airPortOnePosition,
    airPortTwoPosition
  } = useHome()

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth='md'>
        <Typography 
          variant={mainTitleVariant()} 
          component='h1'
          gutterBottom
          align='center'
          color='white'
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
              onInputChange={(e, term) => { 
                getAirportOne(term) 
                setShowMapRoute(false)
              }}
              onChange={(e, newValue) => {
                setAirportOneInfo(newValue)
              }}
              label='Select the first airport'
            />
          </Box>

          <CustomAutoComplete
            options={airportListTwo}
            onInputChange={(e, term) => {
              setShowMapRoute(false)
              getAirportTwo(term)
            }}
            onChange={(e, newValue) => {
              setAirportTwoInfo(newValue)
            }}
            label='Select the second airport'
          />
        </Box>

        {(airportOneInfo && airportTwoInfo) && 
          <>
            <Box sx={{ 
                margin: '16px 0', 
                display: 'flex', 
                alignItems: 'center', 
                flexDirection: 'column'
            }}>
              <Typography 
                variant='h2' 
                gutterBottom
                align='center'
                color='white'
              >
                <CountUp 
                  end={distanceInNmi || 0} 
                  decimals={2} 
                  decimal='.' 
                /> NMI
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Button 
                variant='contained'
                onClick={() => {
                  setShowMapRoute((state) => !state)
                  setMapZoom(5)
                }}
              >
                Toggle map route
              </Button>
            </Box>
            
            <Box
              sx={{
                display: (isLoaded && showMapRoute) ? 'block' : 'none'
              }}
            >
              <GoogleMap
                mapContainerStyle={mapOptions.containerStyle}
                center={mapOptions.center}
                onLoad={onLoadMap}
                onUnmount={onUnmountMap}
                zoom={mapZoom}
              >
                <Polyline
                  path={polyLinePath}
                  options={polyLineOptions}
                />
                <Marker
                  position={airPortOnePosition()}
                />
                <Marker
                  position={airPortTwoPosition()}
                />
              </GoogleMap>
            </Box>
          </>
        }
      </Container>
    </ThemeProvider>
  )
}

export default Home

