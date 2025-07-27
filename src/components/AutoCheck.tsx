import * as React from 'react';
import useAutocomplete from '@mui/material/useAutocomplete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { FilmOptionType } from '../types/types';
import { useState } from 'react';

const Root = styled('div')`
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
`;

const InputWrapper = styled('div')`
  width: 100%;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: #2d2d2e;
  }

  &.focused {
    border-color: #1880c5;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 0.2);
  }

  & input {
    background-color: #fff;
    color: rgba(38, 55, 150, 0.85);
    height: 43px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
    outline: 0;
  }
`;

interface TagProps {
  label: string;
  onDelete?: (event: any) => void;
}

export interface AutocompleteProps {
  options: FilmOptionType[];
  defaultValue: FilmOptionType[];
  onChange: (value: FilmOptionType[]) => void;
}

function Tag(props: TagProps) {
  const { label, onDelete, ...other } = props;
  return (
    <div {...other}>
      <span>{label}</span>
      <CloseIcon onClick={onDelete} />
    </div>
  );
}

const StyledTag = styled(Tag)`
  display: flex;
  align-items: center;
  height: 30px;
  margin: 2px;
  line-height: 22px;
  background-color: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  &:focus {
    border-color: #40a9ff;
    background-color: #e6f7ff;
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Listbox = styled('ul')`
  width: 100%;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected='true'] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li.${autocompleteClasses.focused} {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: currentColor;
    }
  }
`;

const AutoCheck: React.FC<AutocompleteProps> = (props) => {
  const [selectedValues, setSelectedValues] = useState<FilmOptionType[]>(props.defaultValue);

  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: 'customized-hook-demo',
    value: selectedValues,
    multiple: true,
    options: props.options,
    getOptionLabel: (option) => option.title,
    onChange: (event, newValue) => {
      setSelectedValues(newValue);
      props.onChange(newValue);
    },
  });

  // type guard: 過濾掉分組 header
  const isFilmOption = (opt: any): opt is FilmOptionType => {
    return opt && typeof opt.title === 'string';
  };

  const validOptions: FilmOptionType[] = (groupedOptions as any[]).filter(isFilmOption);

  return (
    <Root>
      <div {...getRootProps()}>
        <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
          {value.map((option: FilmOptionType, index: number) => {
            const tagProps = getTagProps({ index });
            return <StyledTag {...tagProps} label={option.title} />;
          })}
          <input {...getInputProps()} />
        </InputWrapper>
      </div>
      {validOptions.length > 0 ? (
        <Listbox {...getListboxProps()}>
          {validOptions.map((option, index) => {
            const optionProps = getOptionProps({ option, index });
            return (
              <li key={index} {...optionProps}>
                <span>{option.title}</span>
                <CheckIcon fontSize="small" />
              </li>
            );
          })}
        </Listbox>
      ) : null}
    </Root>
  );
};

export default AutoCheck;
