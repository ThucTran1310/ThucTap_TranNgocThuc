import React from 'react';
import { HEADER, NAV } from '@/layouts/config-layout.js';
import {
  Avatar,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { NAV_LIST } from '@/constant/nav.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const openedMixin = (theme) => ({
  width: NAV.W_VERTICAL_FULL,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: HEADER.H_DESKTOP,
  padding: theme.spacing(0, 1),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: NAV.W_VERTICAL_FULL,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

const Nav = ({ openNav }) => {
  const {
    palette: { primary, common },
  } = useTheme();

  const nav = useNavigate();

  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      open={openNav}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: primary.main,
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'transparent',
          },
        },
      }}
    >
      <DrawerHeader>
        <Avatar />
      </DrawerHeader>
      <List sx={{ mt: 5 }}>
        {NAV_LIST.map(({ title, icon, href }) => (
          <ListItem
            onClick={() => nav(href)}
            key={title}
            disablePadding
            sx={{
              display: 'block',
              backgroundColor: location.pathname === href ? primary.light : 'transparent',
            }}
          >
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: 'initial',
                    }
                  : {
                      justifyContent: 'center',
                    },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                    color: common.white,
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: 'auto',
                      },
                ]}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={title}
                style={{
                  color: common.white,
                  fontWeight: 'bold',
                }}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Nav;
