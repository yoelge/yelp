import React from 'react';
import { TextField } from '@mui/material';

function SearchBar({ defaultCategory, defaultLocation, onCategoryBlur, onCategoryKeyDown, onLocationBlur, onLocationKeyDown }) {

  return (
    <div>
      <TextField id="outlined-basic" label="Term" variant="outlined" defaultValue={defaultCategory} style={{ width: 397, marginRight: 10, marginBottom: 10 }} onBlur={onCategoryBlur} onKeyDown={onCategoryKeyDown} />
      <TextField id="outlined-basic" label="Location" variant="outlined" defaultValue={defaultLocation} style={{ width: 397, marginBottom: 10 }} onBlur={onLocationBlur} onKeyDown={onLocationKeyDown} />
    </div>
  );
}

export default SearchBar;
