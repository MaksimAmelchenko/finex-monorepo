export interface SettingsMobileProps {
  onClose: () => void;
}

export enum SideSheet {
  Accounts = 'accounts',
  Categories = 'categories',
  Contractors = 'contractors',
  Units = 'units',
  Tags = 'tags',
  Moneys = 'moneys',
  Projects = 'projects',
  Profile = 'profile',
  Connections = 'connections',
  Billing = 'billing',
  None = 'none',
}
