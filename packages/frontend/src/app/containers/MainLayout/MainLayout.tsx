import React, { Suspense, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';

import { Link } from '../../components/Link/Link';
import { ProfileRepository } from '../../stores/profile-repository';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

import {
  CashFlowSvg,
  DashboardSvg,
  HamburgerIcon,
  IconButton,
  Logo,
  PlanningSvg,
  ReportsSvg,
  SettingsSvg,
  ToolsSvg,
} from '@finex/ui-kit';

import styles from './MainLayout.module.scss';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  borderRight: 'none',
  width: drawerWidth,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  borderRight: 'none',
  width: theme.spacing(7),
  [theme.breakpoints.up('sm')]: {
    width: theme.spacing(9),
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
  '& .MuiListItemButton-root': {
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      minWidth: theme.spacing(6),
    },
  },
}));

interface IMenuItem {
  id: string;
  link: string;
  label: string;
  icon: React.ReactNode;
}

const t = getT('MainLayout');

export const MainLayout: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
  const theme = useTheme();
  const [isOpened, setIsOpened] = useState(false);
  const profileRepository = useStore(ProfileRepository);

  const handleDrawerToggle = () => {
    setIsOpened(isOpened => !isOpened);
  };

  const menu: IMenuItem[] = useMemo(() => {
    return [
      {
        id: 'dashboard',
        link: '/dashboard',
        label: t('Dashboard'),
        icon: <img src={DashboardSvg} alt="" />,
      },
      {
        id: 'transactions',
        link: '/cash-flows/income-expenses/transactions',
        label: t('Income & Expenses'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'debts',
        link: '/cash-flows/debts',
        label: t('Debts'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'transfers',
        link: '/cash-flows/transfers',
        label: t('Transfers'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'exchanges',
        link: '/cash-flows/exchanges',
        label: t('Exchanges'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'planning',
        link: '#',
        label: t('Planning'),
        icon: <img src={PlanningSvg} alt="" />,
      },
      {
        id: 'reports',
        link: '#',
        label: t('Reports'),
        icon: <img src={ReportsSvg} alt="" />,
      },
      {
        id: 'settings',
        link: '/settings/accounts',
        label: t('Settings'),
        icon: <img src={SettingsSvg} alt="" />,
      },
      {
        id: 'tools',
        link: '#',
        label: t('Tools'),
        icon: <img src={ToolsSvg} alt="" />,
      },
    ];
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      {/*<CssBaseline />*/}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton aria-label="open drawer" className={styles.header__hamburger} onClick={handleDrawerToggle}>
            <HamburgerIcon />
          </IconButton>

          <Logo className={styles.header__logo} />

          <Typography variant="h6" noWrap color={theme.palette.text.primary} component="div">
            FINEX.io
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={isOpened}>
        <Toolbar />

        <List>
          {menu.map(({ link, label, icon: Icon, id }) => (
            <ListItemButton href={link} component={Link} key={id}>
              <ListItemIcon>{Icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>

        {/*<Divider />*/}
      </Drawer>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100vh',
        }}
      >
        <Toolbar />
        <Divider />

        <Box
          sx={{
            flexGrow: 1,
            p: '2rem 3rem',
            backgroundColor: '#f9f9f9',
          }}
        >
          {!profileRepository.profile ? (
            <div>loading...</div>
          ) : (
            <Suspense fallback={<div>loading...</div>}>{children}</Suspense>
          )}
        </Box>
      </Box>
    </Box>
  );
});
