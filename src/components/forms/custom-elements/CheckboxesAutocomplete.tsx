import React, { useState } from 'react';

import { TextField, Checkbox, Autocomplete } from '@mui/material';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { ISelectProps } from '../../../views/projects/projectModels';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const CheckboxesAutocomplete = (props: ISelectProps) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (event, value) => {
    setSelectedOptions(value);
    console.log(selectedOptions);
  };

  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={props && props.data}
      disableCloseOnSelect
      onChange={handleChange}
      getOptionLabel={(option: any) => option.label}
      // filterSelectedOptions={props&&props.selectedValues}
      // disabled={
      //   props && props.selectedValues?.length > 0 && props.selectedValues.indexOf() !== -1
      // }
      renderOption={(props, option, { selected }) => (
        <>
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        </>
      )}
      fullWidth
      renderInput={(params) => (
        <TextField {...params} size="small" placeholder="Select" aria-label="Select" />
      )}
    />
  );
};

export default CheckboxesAutocomplete;
