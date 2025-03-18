import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import HomeIcon from "@mui/icons-material/Home";
import BallotIcon from "@mui/icons-material/Ballot";
import FeedIcon from "@mui/icons-material/Feed";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";

const drawerWidth = 250;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": {
          ...openedMixin(theme),
          backgroundColor: "#001F54",
        },
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": {
          ...closedMixin(theme),
          backgroundColor: "#001F54",
        },
      }),
}));

const NAVIGATION = [
  { kind: "header", title: "Main items" },

  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon style={{ color: "#ffffff" }} />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon style={{ color: "#ffffff" }} />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon style={{ color: "#ffffff" }} />,
      },
    ],
  },
];

const CollapsibleMenu = ({ item }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <ListItem
        onClick={() => setOpen(!open)}
        sx={{
          color: "white",
          cursor: "pointer",
          "&:hover": { bgcolor: "#90caf9" }, // Apply hover effect
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((subItem, index) => (
            <ListItem
              key={index}
              sx={{
                pl: 4,
                color: "white",
                "&:hover": { bgcolor: "#90caf9" }, // Apply hover effect to nested items
              }}
            >
              <ListItemIcon>{subItem.icon}</ListItemIcon>
              <ListItemText primary={subItem.title} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <div className="flex  min-h-screen  mx-auto  text-gray-950">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: "10",
        }}
      >
        <CssBaseline />
        {/* <AppBar
          position="fixed"
          open={open}
          sx={{ boxShadow: "none", backgroundColor: "transparent" }}
        >
          <Toolbar>
            {!open && (
              <IconButton
                color="default"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ color: "white" }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar> */}

        <AppBar
          position="fixed"
          open={open}
          sx={{
            boxShadow: "none",
            backgroundColor: "transparent",
            width: "7%", // Corrected width
            left: 0,
          }}
        >
          <Toolbar sx={{ width: "100%" }}>
            {!open && (
              <IconButton
                color="default"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ color: "white" }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            {open && (
              <IconButton onClick={handleDrawerClose}>
                <MenuOpenIcon sx={{ color: "white" }} />
              </IconButton>
            )}
          </DrawerHeader>

          <List sx={{ gap: 2, display: "flex", flexDirection: "column" }}>
            {NAVIGATION.map((item, index) => {
              if (item.kind === "header") {
                return open ? ( // Show header only if drawer is open
                  <ListSubheader
                    key={index}
                    sx={{
                      color: "white",
                      bgcolor: "transparent",
                      pointerEvents: "none", // Prevent hover effect
                    }}
                  >
                    {item.title}
                  </ListSubheader>
                ) : null;
              }
              if (item.kind === "divider") {
                return <Divider key={index} sx={{ bgcolor: "gray" }} />;
              }
              if (item.children) {
                return <CollapsibleMenu key={index} item={item} />;
              }
              return (
                <ListItem
                  key={item.segment}
                  sx={{
                    color: "white",
                    "&:hover": { bgcolor: "#90caf9" },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      </Box>
    </div>
  );
}
