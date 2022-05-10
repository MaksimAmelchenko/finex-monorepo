import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';

export interface ITabOption {
  value: string;
  label: string;
}

export interface TabsProps {
  value: string;
  options: ITabOption[];
  onChange: (value: string) => unknown;
}

export function Tabs({ value, options, onChange }: TabsProps): JSX.Element {
  const handleChange = (event: unknown, value: string) => {
    onChange(value);
  };
  return (
    <MuiTabs value={value} onChange={handleChange}>
      {options.map(({ value, label }) => (
        <MuiTab
          disableRipple
          value={value}
          label={label}
          key={value}
          sx={{
            textTransform: 'none',
          }}
        />
      ))}
    </MuiTabs>
  );
}
