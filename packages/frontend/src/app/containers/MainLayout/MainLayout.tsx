import React, { Fragment, Suspense, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';

import Collapse from '@mui/material/Collapse';
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
import { Link } from '../../components/Link/Link';
import { Loader } from '../../components/Loader/Loader';
import { ProfileRepository } from '../../stores/profile-repository';
import { Project } from '../../stores/models/project';
import { ProjectsRepository } from '../../stores/projects-repository';
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

  return (
    <div className={styles.layout}>
      <Drawer variant="permanent" open={isOpened} onClick={handleDrawerToggle}>
        <List component="nav" onClick={e => e.stopPropagation()}>
          <ListItemButton href="/" component={Link}>
            <ListItemIcon>
              <Logo className={styles.header__logo} />
            </ListItemIcon>
            <ListItemText primary="FINEX.io" />
          </ListItemButton>

          {/*<ProjectMenu />*/}

          {menu.map(({ link, label, icon: Icon, items, id }) => {
            return (
              <Fragment key={id}>
                <ListItemButton {...(items ? { onClick: handleClick(id) } : { href: link, component: Link })}>
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
                          <ListItemButton href={link} component={Link} key={id}>
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

        {/*<Divider />*/}
      </Drawer>

      <div className={styles.content}>
        {!profileRepository.profile ? <Loader /> : <Suspense fallback={<Loader />}>{children}</Suspense>}
      </div>
    </div>
  );
});

function ProjectMenu(): JSX.Element | null {
  const projectsRepository = useStore(ProjectsRepository);
  const { enqueueSnackbar } = useSnackbar();
  const [isOpenedProjects, setIsOpenedProjects] = useState(false);

  const handleCurrentProjectClick = () => {
    setIsOpenedProjects(isOpenedProjects => !isOpenedProjects);
  };

  const handleProjectClick = (project: Project) => () => {
    projectsRepository
      .useProject(project.id)
      .then(() => setIsOpenedProjects(false))
      .catch(err => {
        let message = '';
        switch (err.code) {
          default:
            message = err.message;
        }
        enqueueSnackbar(message, { variant: 'error' });
      });
  };

  const { currentProject, projects } = projectsRepository;
  if (!currentProject) {
    return null;
  }

  if (projects.length === 1) {
    return (
      <ListItemButton>
        <ListItemText primary={currentProject.name} />
      </ListItemButton>
    );
  }

  return (
    <>
      <ListItemButton onClick={handleCurrentProjectClick}>
        <ListItemText primary={currentProject.name} />
      </ListItemButton>

      <Collapse in={isOpenedProjects} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {projects
            .filter(project => project !== currentProject)
            .map(project => (
              <ListItemButton onClick={handleProjectClick(project)} key={project.id}>
                <ListItemText primary={project.name} />
              </ListItemButton>
            ))}
        </List>
      </Collapse>
    </>
  );
}
