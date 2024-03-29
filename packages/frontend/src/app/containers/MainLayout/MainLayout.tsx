import React, { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import { CSSObject, styled, Theme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarKey, useSnackbar } from 'notistack';
import clsx from 'clsx';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';

import { BillingLazy } from '../../pages/Billing/BillingLazy';
import { CashFlows } from '../../pages/CashFlows/CashFlows';
import {
  ChevronRightIcon,
  barChart07Svg,
  coinsHandSvg,
  coinsStacked01Svg,
  dataFlow03Svg,
  lineChartUp01Svg,
  pieChart02Svg,
  refreshCW03Svg,
  reverseRightSvg,
  settings02Svg,
  switchHorizontal01Svg,
  tool02Svg,
} from '@finex/ui-kit';
import { AccountMenu } from './AccountMenu/AccountMenu';
import { DashboardLazy } from '../../pages/Dashboard/DashboardLazy';
import { Debts } from '../../pages/Debts/Debts';
import { DistributionReportLazy } from '../../pages/Reports/DistributionReport/DistributionReportLazy';
import { DynamicsReportLazy } from '../../pages/Reports/DynamicsReport/DynamicsReportLazy';
import { Exchanges } from '../../pages/Exchanges/Exchanges';
import { getT } from '../../lib/core/i18n';
import { Link } from '../../components/Link/Link';
import { Link as LinkBase } from '@finex/ui-kit';
import { Loader } from '../../components/Loader/Loader';
import { PlanningLazy } from '../../pages/Planning/PlanningLazy';
import { ProfileLazy } from '../../pages/Profile/ProfileLazy';
import { ProfileRepository } from '../../stores/profile-repository';
import { ProjectMenu } from './ProjectMenu/ProjectMenu';
import { SettingsLazy } from '../../pages/Settings/SettingsLazy';
import { ToolsLazy } from '../../pages/Tools/ToolsLazy';
import { Transactions } from '../../pages/Transactions/Transactions';
import { Transfers } from '../../pages/Transfers/Transfers';
import { useStore } from '../../core/hooks/use-store';

import { ReactComponent as Logo } from '../../icons/logo.svg';

import styles from './MainLayout.module.scss';

const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
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
    '&.active': {
      backgroundColor: 'var(--color-gray-100)',
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
  items?: IMenuItem[];
}

const t = getT('MainLayout');

export const MainLayout = observer(() => {
  const profileRepository = useStore(ProfileRepository);

  const [isOpened, setIsOpened] = useState(true);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleDrawerToggle = () => {
    setIsOpened(isOpened => !isOpened);
  };

  const menu: IMenuItem[] = useMemo(() => {
    return [
      {
        id: 'cash-flows',
        link: '/cash-flows',
        label: t('Cash Flows'),
        icon: <img src={dataFlow03Svg} alt="" />,
      },
      {
        id: 'transactions',
        link: '/transactions',
        label: t('Income & Expenses'),
        icon: <img src={switchHorizontal01Svg} alt="" />,
      },
      {
        id: 'debts',
        link: '/debts',
        label: t('Debts'),
        icon: <img src={coinsHandSvg} alt="" />,
      },
      {
        id: 'transfers',
        link: '/transfers',
        label: t('Transfers'),
        icon: <img src={reverseRightSvg} alt="" />,
      },
      {
        id: 'exchanges',
        link: '/exchanges',
        label: t('Exchanges'),
        icon: <img src={refreshCW03Svg} alt="" />,
      },
      {
        id: 'planning',
        link: '/planning',
        label: t('Planning'),
        icon: <img src={coinsStacked01Svg} alt="" />,
      },
      {
        id: 'reports',
        link: '/reports',
        label: t('Reports'),
        icon: <img src={lineChartUp01Svg} alt="" />,
        items: [
          {
            id: 'dynamicsReport',
            link: '/reports/dynamics',
            label: t('Dynamics'),
            icon: <img src={barChart07Svg} alt="" />,
          },
          {
            id: 'distributionReport',
            link: '/reports/distribution',
            label: t('Distribution'),
            icon: <img src={pieChart02Svg} alt="" />,
          },
        ],
      },
      {
        id: 'settings',
        link: '/settings',
        label: t('Settings'),
        icon: <img src={settings02Svg} alt="" />,
      },
      {
        id: 'tools',
        link: '/tools',
        label: t('Tools'),
        icon: <img src={tool02Svg} alt="" />,
      },
    ];
  }, []);

  const [openedMenuIds, setOpenedMenuIds] = React.useState<string[]>([]);

  const handleClick = (menuId: string) => () => {
    if (openedMenuIds.includes(menuId)) {
      setOpenedMenuIds(openedMenuIds.filter(id => id !== menuId));
    } else {
      setOpenedMenuIds([...openedMenuIds, menuId]);
    }
  };

  const { profile } = profileRepository;

  useEffect(() => {
    if (profile) {
      if (parseISO(profile.accessUntil) < new Date()) {
        const action = (snackbarId: SnackbarKey) => (
          <div className={styles.snackbar__action}>
            <Link
              href="/settings/billing"
              className={styles.snackbar__actionlink}
              onClick={() => closeSnackbar(snackbarId)}
            >
              {t('Subscribe')}
            </Link>
            <Link href="#" className={styles.snackbar__actionlink} onClick={() => closeSnackbar(snackbarId)}>
              {t('Dismiss')}
            </Link>
          </div>
        );
        enqueueSnackbar(t('Your subscription has ended.'), { variant: 'info', action, autoHideDuration: 10000 });
      }
    }
  }, [closeSnackbar, enqueueSnackbar, profile]);

  if (!profile) {
    return <Loader />;
  }

  return (
    <div className={styles.layout}>
      <Drawer variant="permanent" open={isOpened}>
        <List component="nav">
          <ListItemButton href="/outcome" component={LinkBase}>
            <ListItemIcon>
              <Logo className={styles.header__logo} />
            </ListItemIcon>
            <ListItemText primary={t('Outcome')} />
          </ListItemButton>

          {menu.map(({ link, label, icon: Icon, items, id }) => {
            return (
              <Fragment key={id}>
                <ListItemButton {...(items ? { onClick: handleClick(id) } : { href: link, component: LinkBase })}>
                  <ListItemIcon>{Icon}</ListItemIcon>
                  <ListItemText primary={label} />
                  {items ? (
                    <ChevronRightIcon
                      className={clsx(styles.chevron, openedMenuIds.includes(id) && styles.chevron_opened)}
                    />
                  ) : null}
                </ListItemButton>

                {items && (
                  <Collapse in={openedMenuIds.includes(id)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {items.map(({ link, label, icon: Icon, items, id }) => {
                        return (
                          <ListItemButton href={link} component={LinkBase} key={id}>
                            <ListItemIcon>{Icon}</ListItemIcon>
                            <ListItemText primary={label} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Fragment>
            );
          })}
        </List>

        <div className={styles.empty} onClick={handleDrawerToggle} />

        <ProjectMenu />

        <Divider />

        <AccountMenu className={styles.accountMenu} name={profile.name} />
      </Drawer>

      <div className={styles.content}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/outcome" element={<DashboardLazy />} />
            <Route path="/cash-flows" element={<CashFlows />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="/planning" element={<PlanningLazy />} />
            <Route path="/reports" element={<Navigate to={'/reports/dynamics'} replace={true} />} />
            <Route path="/reports/dynamics" element={<DynamicsReportLazy />} />
            <Route path="/reports/distribution" element={<DistributionReportLazy />} />

            <Route path="/settings/billing" element={<BillingLazy />} />

            <Route path="/settings" element={<SettingsLazy />} />
            <Route path="/settings/:tab" element={<SettingsLazy />} />

            <Route path="/profile" element={<ProfileLazy />} />
            <Route path="/tools" element={<ToolsLazy />} />

            <Route path="*" element={<Navigate to="/transactions" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
});

export default MainLayout;
