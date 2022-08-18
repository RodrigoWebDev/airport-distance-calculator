import React from "react"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AutoCompleteOptionsInterface } from "../../interfaces"

const CustomAutoComplete = ({ 
  options, 
  onInputChange, 
  onChange, 
  label,
}: AutoCompleteOptionsInterface) => {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: 300}}
      getOptionLabel={option => option.name}
      onInputChange={onInputChange}
      onChange={onChange}
      renderInput={params => <TextField {...params} label={label} />}
    />
  )
}

export default CustomAutoComplete