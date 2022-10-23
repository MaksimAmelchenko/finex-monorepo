import React, { Fragment, Suspense, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';
import { CSSObject, styled, Theme } from '@mui/material/styles';

import {
  ArrowForwardIcon,
  BarIncreaseSvg,
  CashFlowSvg,
  Logo,
  PieSvg,
  PlanningSvg,
  ReportsSvg,
  SettingsSvg,
  ToolsSvg,
} from '@finex/ui-kit';
import { AccountMenu } from './AccountMenu/AccountMenu';
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

  const handleDrawerToggle = () => {
    setIsOpened(isOpened => !isOpened);
  };

  const menu: IMenuItem[] = useMemo(() => {
    return [
      {
        id: 'transactions',
        link: '/transactions',
        label: t('Income & Expenses'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'debts',
        link: '/debts',
        label: t('Debts'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'transfers',
        link: '/transfers',
        label: t('Transfers'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'exchanges',
        link: '/exchanges',
        label: t('Exchanges'),
        icon: <img src={CashFlowSvg} alt="" />,
      },
      {
        id: 'planning',
        link: '/planning',
        label: t('Planning'),
        icon: <img src={PlanningSvg} alt="" />,
      },
      {
        id: 'reports',
        link: '/reports',
        label: t('Reports'),
        icon: <img src={ReportsSvg} alt="" />,
        items: [
          {
            id: 'dynamicsReport',
            link: '/reports/dynamics',
            label: t('Dynamics'),
            icon: <img src={BarIncreaseSvg} alt="" />,
          },
          {
            id: 'distributionReport',
            link: '/reports/distribution',
            label: t('Distribution'),
            icon: <img src={PieSvg} alt="" />,
          },
        ],
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

  const [openedMenuIds, setOpenedMenuIds] = React.useState<string[]>([]);

  const handleClick = (menuId: string) => () => {
    if (openedMenuIds.includes(menuId)) {
      setOpenedMenuIds(openedMenuIds.filter(id => id !== menuId));
    } else {
      setOpenedMenuIds([...openedMenuIds, menuId]);
    }
  };

  const { profile } = profileRepository;
  if (!profile) {
    return <Loader />;
  }

  return (
    <div className={styles.layout}>
      <Drawer variant="permanent" open={isOpened}>
        <List component="nav">
          <ListItemButton href="/" component={LinkBase}>
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
                    openedMenuIds.includes(id) ? (
                      <ArrowForwardIcon style={{ transform: 'rotate(270deg)' }} />
                    ) : (
                      <ArrowForwardIcon style={{ transform: 'rotate(90deg)' }} />
                    )
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
