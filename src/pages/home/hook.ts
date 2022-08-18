import { useState, useEffect, SetStateAction, Dispatch, useCallback } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useJsApiLoader } from '@react-google-maps/api'
import { AirportListInterface, Location } from '../../interfaces'

const polyLineOptions = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
}

const useHome = () => {
  const isDesktop = useMediaQuery('(min-width:663px)')
  const [airportListOne, setAirportListOne] = useState<AirportListInterface[] | []>([])
  const [airportListTwo, setAirportListTwo] = useState<AirportListInterface[] | []>([])
  const [airportOneInfo, setAirportOneInfo] = useState<AirportListInterface | null>(null)
  const [airportTwoInfo, setAirportTwoInfo] = useState<AirportListInterface | null>(null)
  const [distanceInNmi, setDistanceInNmi] = useState<number | null>(null)
  const [map, setMap] = useState(null)
  const [showMapRoute, setShowMapRoute] = useState(false)
  const [mapZoom, setMapZoom] = useState<number | undefined>(undefined)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAroVYQsjCocZryzS13ra5yndO77lAABh0'
  })

  const mainTitleVariant = () => isDesktop ? 'h1' : 'h3'
  const mapOptions = {
    containerStyle: {
      width: '100%',
      height: '400px',
      margin: '0 auto',
      marginBottom: '24px'
    },
    center: {
      lat: airportOneInfo?.location.lat || 0,
      lng: airportOneInfo?.location.lon || 0
    }  
  }

  const hasTerm = (term: string) => {
    return term && term.length >= 3
  }

  const getAirport = (term: string, setAirport: Dispatch<SetStateAction<[] | AirportListInterface[]>>) => {
    if(hasTerm(term)){
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '4a2e9916cbmsh577871ff8d632d4p19c36djsnacd6559fda31',
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
      }
      
      fetch(`https://aerodatabox.p.rapidapi.com/airports/search/term?q=${term}&limit=10`, options)
        .then(response => response.json())
        .then(({items}) => {
          setAirport(items)
        })
        .catch(err => console.error({err}))
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

  const getDistanceFromLatLonInKm = (lat1?: number, lon1?: number, lat2?: number, lon2?: number) => {
    if(lat1 && lon1 && lat2 && lon2){
      const R = 6371
      const dLat = deg2rad(lat2-lat1)
      const dLon = deg2rad(lon2-lon1) 
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
       
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
      const d = R * c
      return d
    }

    return null
  }

  const updateNmiDistanceInfo = () => {
    if(airportOneInfo && airportTwoInfo){
      const lat1 = airportOneInfo?.location.lat
      const lon1 = airportOneInfo?.location.lon
      const lat2 = airportTwoInfo?.location.lat
      const lon2 = airportTwoInfo?.location.lon
      const nmi = 0.539956803
      const distanceInKm = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
      const distanceInNmi = distanceInKm && (distanceInKm * nmi)

      setDistanceInNmi(distanceInNmi)
    }
  }

  const onLoadMap = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(mapOptions.center)
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onUnmountMap = useCallback(function callback() {
    setMap(null)
  }, [])

  const getPosition = ({ lat, lon }: Location) => ({
    lat,
    lng: lon
  })

  const airPortOnePosition = () => 
    getPosition({
      lat: airportOneInfo?.location.lat || 0,
      lon: airportOneInfo?.location.lon || 0
    })

  const airPortTwoPosition = () => 
    getPosition({
      lat: airportTwoInfo?.location.lat || 0,
      lon: airportTwoInfo?.location.lon || 0
    })

  const polyLinePath = [
    airPortOnePosition(),
    airPortTwoPosition()
  ]

  useEffect(() => {
    updateNmiDistanceInfo()
  }, [airportOneInfo, airportTwoInfo])

  return {
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
    polyLineOptions,
    polyLinePath,
    airPortOnePosition,
    airPortTwoPosition
  }
}

export default useHome