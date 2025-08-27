// Modern App.js with Material-UI, Dark Mode, and Enhanced UX
import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Switch,
  FormControlLabel,
  Paper,
  useMediaQuery
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as ClearIcon,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Home as HomeIcon,
  List as ListIcon,
  Countertops as CountertopsIcon
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import AddItem from "./components/AddItem";
import SearchItems from "./components/SearchItems";
import SearchOnline from "./components/SearchOnline";
import ViewList from "./components/ViewList";
import CountItems from "./components/CountItems";
import ClearList from "./components/ClearList";
import DashboardComponent from "./components/Dashboard";

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [activeSection, setActiveSection] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const isMobile = useMediaQuery('(max-width:768px)');

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });

    const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, section: 'dashboard' },
    { text: 'Add Item', icon: <AddIcon />, section: 'add' },
    { text: 'View List', icon: <ListIcon />, section: 'view' },
    { text: 'Search', icon: <SearchIcon />, section: 'search' },
    { text: 'Search Online', icon: <SearchIcon />, section: 'search-online' },
    { text: 'Count Items', icon: <CountertopsIcon />, section: 'count' },
    { text: 'Clear List', icon: <ClearIcon />, section: 'clear' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardComponent onNavigate={setActiveSection} />;
      case "add":
        return <AddItem />;
      case "search":
        return <SearchItems />;
      case "search-online":
        return <SearchOnline />;
      case "view":
        return <ViewList />;
      case "count":
        return <CountItems />;
      case "clear":
        return <ClearList />;
      default:
        return <DashboardComponent onNavigate={setActiveSection} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Smart Inventory Manager
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  icon={<Brightness7 />}
                  checkedIcon={<Brightness4 />}
                />
              }
              label=""
            />
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', pt: 2 }}>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.section}
                  onClick={() => {
                    setActiveSection(item.section);
                    if (isMobile) setDrawerOpen(false);
                  }}
                  selected={activeSection === item.section}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.contrastText,
                      },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: activeSection === item.section ? 600 : 400,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            mt: { xs: 7, sm: 8 },
            ml: { sm: 0 },
          }}
        >
          <Container maxWidth="lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    minHeight: 'calc(100vh - 140px)',
                  }}
                >
                  {renderContent()}
                </Paper>
              </motion.div>
            </AnimatePresence>
          </Container>
        </Box>
      </Box>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#333',
          },
        }}
      />
    </ThemeProvider>
  );
};

export default App;