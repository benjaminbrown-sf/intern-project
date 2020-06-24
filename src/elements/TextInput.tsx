import React from 'react';
import Input from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange: (ev?: React.SyntheticEvent) => void;
  showSearchIcon?: boolean;
}

const TextInput = (props: InputProps): JSX.Element => {
  const { value, placeholder, onChange } = props;
  return (
    <Input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
    ></Input>
  );
};

export default TextInput;
