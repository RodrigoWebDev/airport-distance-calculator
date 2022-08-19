export interface Location {
  lat: number
  lon: number
}

export interface AirportListInterface {
  name: string
  city: string
  iata: string
  latitude: number
  longitude: number
  country: {
      name: string
      iso: string
  }
  state: {
      name: string
      type: string
  }
}

export interface AutoCompleteOptionsInterface {
  options: AirportListInterface[] | []
  onInputChange: (e: any, term: any) => void
  onChange: (e: any, newValue: any) => void
  label: string
}