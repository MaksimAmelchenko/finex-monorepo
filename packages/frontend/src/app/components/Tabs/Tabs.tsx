import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';

export interface ITabOption {
  value: string;
  label: string;
}

export interface TabsProps {
  value: string;
  options: ITabOption[];
  onChange: (value: string) => unknown;
}

const MuiTabsStyled = styled(MuiTabs)(({ theme }) => ({
  '.MuiTabs-indicator': {
    backgroundColor: 'var(--color-primary-600)',
  },
}));

const MuiTabStyled = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  '&.Mui-selected': {
    color: 'var(--color-primary-600)',
  },
}));

export function Tabs({ value, options, onChange }: TabsProps): JSX.Element {
  const handleChange = (event: unknown, value: string) => {
    onChange(value);
  };

  return (
    <MuiTabsStyled value={value} onChange={handleChange}>
      {options.map(({ value, label }) => (
        <MuiTabStyled disableRipple value={value} label={label} key={value} />
      ))}
    </MuiTabsStyled>
  );
}
