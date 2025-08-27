import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Inventory,
  ShoppingCart,
  Add as AddIcon,
  Search as SearchIcon,
  Analytics,
  Timeline,
  NotificationsActive,
  Refresh,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { request } from "../api";

const Dashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalItems: 0,
    recentItems: [],
    categories: 0,
    lowStockItems: 0,
    loading: true,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch total items count
      const countResponse = await request("get", "/count-items");
      
      // Fetch recent items
      const itemsResponse = await request("get", "/view-list");
      
      const items = itemsResponse.items || [];
      
      // Calculate statistics from real data
      const categories = new Set(items.map(item => item.category || 'Uncategorized')).size;
      const lowStockItems = items.filter(item => (item.quantity || 0) < 5).length;
      
      console.log('Dashboard data:', { items, categories, lowStockItems });
      
      setStats({
        totalItems: countResponse.count || items.length || 0,
        recentItems: items.slice(0, 5),
        categories: categories,
        lowStockItems: lowStockItems,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats(prev => ({ ...prev, loading: false }));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statsData = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: <Inventory />,
      color: "#2196f3",
      change: stats.totalItems > 0 ? "Items in inventory" : "No items yet",
      trend: stats.totalItems > 0 ? "up" : "neutral",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: <ShoppingCart />,
      color: "#4caf50",
      change: `${stats.categories} different categories`,
      trend: "up",
    },
    {
      title: "Low Stock",
      value: stats.lowStockItems,
      icon: <NotificationsActive />,
      color: "#ff9800",
      change: stats.lowStockItems > 0 ? "Needs attention" : "All good",
      trend: stats.lowStockItems > 0 ? "warning" : "success",
    },
  ];  const quickActions = [
    { 
      icon: <AddIcon />, 
      label: "Add Item", 
      color: "#2196f3",
      action: "add"
    },
    { 
      icon: <SearchIcon />, 
      label: "Search", 
      color: "#4caf50",
      action: "search"
    },
    { 
      icon: <Analytics />, 
      label: "View Items", 
      color: "#ff9800",
      action: "view"
    },
    { 
      icon: <Timeline />, 
      label: "Statistics", 
      color: "#9c27b0",
      action: "count"
    },
  ];

  const handleQuickAction = (action) => {
    if (onNavigate) {
      onNavigate(action);
    }
  };

  if (stats.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's your inventory overview.
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchDashboardData} disabled={refreshing}>
            <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={4}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                elevation={0}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={stat.color}>
                        {stat.value}
                      </Typography>
                      <Chip
                        size="small"
                        label={stat.change}
                        color={stat.trend === 'up' ? 'success' : stat.trend === 'warning' ? 'warning' : 'default'}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ 
                    height: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color,
                    }
                  }}
                />
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Items */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Items
              </Typography>
              <List>
                {stats.recentItems.length > 0 ? (
                  stats.recentItems.map((item, index) => (
                    <ListItem key={index} divider>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: '#2196f3', width: 40, height: 40 }}>
                          {item.name?.charAt(0).toUpperCase() || 'I'}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name || 'Unnamed Item'}
                        secondary={`Quantity: ${item.quantity || 0} • Added recently`}
                      />
                      <Chip 
                        size="small" 
                        label="In Stock" 
                        color="success" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No items found"
                      secondary="Add your first item to get started"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={6} key={action.label}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          borderColor: action.color,
                        }
                      }}
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <Avatar sx={{ bgcolor: action.color, mx: 'auto', mb: 1 }}>
                        {action.icon}
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {action.label}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>

      {/* Add custom CSS for refresh animation */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default Dashboard;
