import React, { FC, Suspense, useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { Link } from '../../components/Link/Link';
import { getT } from '../../lib/core/i18n';

import cashFlowSvg from '../../components/Icons/cash-flow.svg';
import dashboardSvg from '../../components/Icons/dashboard.svg';
import hamburgerSvg from '../../components/Icons/hamburger.svg';
import planningSvg from '../../components/Icons/planning.svg';
import reportsSvg from '../../components/Icons/reports.svg';
import settingsSvg from '../../components/Icons/settings.svg';
import toolsSvg from '../../components/Icons/tools.svg';
import { ReactComponent as Logo } from '../../components/Icons/Logo.svg';

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

export const MainLayout: FC = observer(({ children }) => {
  const theme = useTheme();
  const [isOpened, setIsOpened] = React.useState(false);

  const handleDrawerToggle = () => {
    setIsOpened(isOpened => !isOpened);
  };

  const menu: IMenuItem[] = useMemo(() => {
    return [
      {
        id: 'dashboard',
        link: '/dashboard',
        label: t('Dashboard'),
        icon: <img src={dashboardSvg} alt="" />,
      },
      {
        id: 'transactions',
        link: '/cash-flows/income-expenses/transactions',
        label: t('Transactions'),
        icon: <img src={cashFlowSvg} alt="" />,
      },
      {
        id: 'planning',
        link: '#',
        label: t('Planning'),
        icon: <img src={planningSvg} alt="" />,
      },
      {
        id: 'reports',
        link: '#',
        label: t('Reports'),
        icon: <img src={reportsSvg} alt="" />,
      },
      {
        id: 'settings',
        link: '#',
        label: t('Settings'),
        icon: <img src={settingsSvg} alt="" />,
      },
      {
        id: 'tools',
        link: '#',
        label: t('Tools'),
        icon: <img src={toolsSvg} alt="" />,
      },
    ];
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{
              marginLeft: '-8px',
            }}
          >
            <img src={hamburgerSvg} alt="" />
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
            p: '0 3rem 3rem',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Suspense fallback={<div>loading...</div>}>{children}</Suspense>
        </Box>
      </Box>
    </Box>
  );
});
