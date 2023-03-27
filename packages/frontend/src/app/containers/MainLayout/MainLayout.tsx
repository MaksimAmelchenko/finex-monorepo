import React, { Fragment, Suspense, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { SnackbarKey, useSnackbar } from 'notistack';
import { observer } from 'mobx-react-lite';
import { parseISO } from 'date-fns';

import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, styled, Theme } from '@mui/material/styles';

import {
  ChevronRightIcon,
  Logo,
  calendarDaysSvg,
  chartColumnSvg,
  chartLineSvg,
  chartPieSvg,
  gearSvg,
  giftSvg,
  rightLeftSvg,
  rightLongSvg,
  screwdriverWrenchSvg,
  shuffleSvg,
} from '@finex/ui-kit';
import { AccountMenu } from './AccountMenu/AccountMenu';
import { Link } from '../../components/Link/Link';
import { LinkBase } from '../../components/LinkBase/LinkBase';
import { Loader } from '../../components/Loader/Loader';
import { ProfileRepository } from '../../stores/profile-repository';
import { ProjectMenu } from './ProjectMenu/ProjectMenu';
import { getT } from '../../lib/core/i18n';
import { useStore } from '../../core/hooks/use-store';

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

export const MainLayout: React.FC<{ children: React.ReactNode }> = observer(({ children }) => {
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
        label: t('Cash Flow'),
        icon: <img src={shuffleSvg} alt="" />,
      },
      {
        id: 'transactions',
        link: '/transactions',
        label: t('Income & Expenses'),
        icon: <img src={rightLeftSvg} alt="" />,
      },
      {
        id: 'debts',
        link: '/debts',
        label: t('Debts'),
        icon: <img src={giftSvg} alt="" />,
      },
      {
        id: 'transfers',
        link: '/transfers',
        label: t('Transfers'),
        icon: <img src={rightLongSvg} alt="" />,
      },
      {
        id: 'exchanges',
        link: '/exchanges',
        label: t('Exchanges'),
        icon: <img src={rightLeftSvg} alt="" />,
      },
      {
        id: 'planning',
        link: '/planning',
        label: t('Planning'),
        icon: <img src={calendarDaysSvg} alt="" />,
      },
      {
        id: 'reports',
        link: '/reports',
        label: t('Reports'),
        icon: <img src={chartLineSvg} alt="" />,
        items: [
          {
            id: 'dynamicsReport',
            link: '/reports/dynamics',
            label: t('Dynamics'),
            icon: <img src={chartColumnSvg} alt="" />,
          },
          {
            id: 'distributionReport',
            link: '/reports/distribution',
            label: t('Distribution'),
            icon: <img src={chartPieSvg} alt="" />,
          },
        ],
      },
      {
        id: 'settings',
        link: '/settings',
        label: t('Settings'),
        icon: <img src={gearSvg} alt="" />,
      },
      {
        id: 'tools',
        link: '/tools',
        label: t('Tools'),
        icon: <img src={screwdriverWrenchSvg} alt="" />,
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
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </div>
    </div>
  );
});
