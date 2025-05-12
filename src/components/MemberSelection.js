import React from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';

function MemberSelection({ availableMembers, selectedMembers, onChange }) {
  return (
    <Autocomplete
      multiple
      id="member-selection"
      options={availableMembers}
      getOptionLabel={(option) => option.name}
      value={selectedMembers}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Members"
          placeholder="Members"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.name}
            {...getTagProps({ index })}
            key={option.id}
          />
        ))
      }
    />
  );
}

export default MemberSelection;