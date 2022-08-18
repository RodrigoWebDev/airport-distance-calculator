interface Location {
  lat: number
  lon: number
}

export interface AirportListInterface {
  icao: string
  iata: string
  name: string
  shortName: string
  municipalityName: string
  location: Location
  countryCode: string
}

export interface AutoCompleteOptionsInterface {
  options: AirportListInterface[] | []
  onInputChange: (e: any, term: any) => void
  onChange: (e: any, newValue: any) => void
  label: string
}