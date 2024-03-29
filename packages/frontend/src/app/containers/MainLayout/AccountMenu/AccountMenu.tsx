import React from 'react';
import { observer } from 'mobx-react-lite';

import { AuthRepository } from '../../../core/other-stores/auth-repository';
import { Divider, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Link as LinkBase, creditCard01Svg, logOut01Svg, user01Svg } from '@finex/ui-kit';
import { getT } from '../../../lib/core/i18n';
import { useStore } from '../../../core/hooks/use-store';

interface UserMenuProps {
  name: string;
  className?: string;
}
const t = getT('AccountMenu');

export const AccountMenu = observer(({ name, className }: UserMenuProps) => {
  const authRepository = useStore(AuthRepository);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isOpened = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = () => {
    authRepository.signOut();
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        className={className}
        aria-controls={isOpened ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpened ? 'true' : undefined}
      >
        <ListItemIcon>
          <img src={user01Svg} alt="" />
        </ListItemIcon>
        <ListItemText primary={name} primaryTypographyProps={{ overflow: 'hidden', textOverflow: 'ellipsis' }} />
      </ListItemButton>

      <Menu anchorEl={anchorEl} id="account-menu" open={isOpened} onClose={handleClose} onClick={handleClose}>
        <MenuItem href="/profile" component={LinkBase}>
          <ListItemIcon>
            <img src={user01Svg} alt="" />
          </ListItemIcon>
          {t('Profile')}
        </MenuItem>
        <MenuItem href="/settings/billing" component={LinkBase}>
          <ListItemIcon>
            <img src={creditCard01Svg} alt="" />
          </ListItemIcon>
          {t('Billing & plans')}
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleSignOutClick}>
          <ListItemIcon>
            <img src={logOut01Svg} alt="" />
          </ListItemIcon>
          {t('Logout')}
        </MenuItem>
      </Menu>
    </>
  );
});
