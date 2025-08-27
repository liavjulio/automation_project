import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Skeleton,
  Tooltip,
  Badge,
  Paper,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  ShoppingCart,
  Category,
  LocalOffer,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { request } from "../api";

const ViewList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      setRefreshing(true);
      const response = await request("get", "/view-list");
      setItems(response.items || []);
      setFilteredItems(response.items || []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      toast.error("Failed to fetch items. Please check the backend server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteItem = async () => {
    if (!deleteDialog.item) return;
    
    try {
      await request("delete", `/delete-item?id=${deleteDialog.item._id}`);
      const updatedItems = items.filter((item) => item._id !== deleteDialog.item._id);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
      toast.success(`"${deleteDialog.item.name}" deleted successfully!`);
    } catch (err) {
      console.error("Failed to delete item:", err);
      toast.error("Failed to delete item. Please try again.");
    }
    setDeleteDialog({ open: false, item: null });
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = items.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const getItemColor = (index) => {
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#f44336', '#00bcd4'];
    return colors[index % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <ViewListIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" fontWeight="bold">
            Inventory Items
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" height={30} sx={{ mt: 2 }} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box display="flex" alignItems="center">
          <ViewListIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Inventory Items
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and view all your inventory items
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh Items">
          <IconButton 
            onClick={fetchItems} 
            disabled={refreshing}
            sx={{ 
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
          >
            <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Search and Stats */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search items, categories, or descriptions..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Chip 
                icon={<ShoppingCart />} 
                label={`${filteredItems.length} Items`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<Category />} 
                label={`${new Set(items.map(item => item.category || 'Uncategorized')).size} Categories`}
                color="secondary"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ borderRadius: 2, textAlign: 'center', py: 4 }}
        >
          <Typography variant="h6" gutterBottom>
            {searchTerm ? "No items found" : "No items in inventory"}
          </Typography>
          <Typography variant="body2">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "Add your first item to get started"
            }
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Item Header */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Avatar 
                          sx={{ 
                            bgcolor: getItemColor(index),
                            width: 50,
                            height: 50,
                            fontSize: '1.5rem'
                          }}
                        >
                          {item.name?.charAt(0).toUpperCase() || 'I'}
                        </Avatar>
                        <Tooltip title="Delete Item">
                          <IconButton 
                            size="small" 
                            sx={{ color: 'error.main' }}
                            onClick={() => setDeleteDialog({ open: true, item })}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Item Info */}
                      <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                        {item.name || "Unnamed Item"}
                      </Typography>
                      
                      {item.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}

                      {/* Item Details */}
                      <Box display="flex" flexDirection="column" gap={1} mb={2}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Quantity:
                          </Typography>
                          <Badge 
                            badgeContent={item.quantity || 0} 
                            color="primary"
                            max={999}
                          >
                            <ShoppingCart fontSize="small" />
                          </Badge>
                        </Box>

                        {item.category && (
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Category:
                            </Typography>
                            <Chip 
                              size="small" 
                              label={item.category}
                              variant="outlined"
                            />
                          </Box>
                        )}

                        {item.price && (
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Price:
                            </Typography>
                            <Chip 
                              size="small" 
                              icon={<LocalOffer />}
                              label={`$${parseFloat(item.price).toFixed(2)}`}
                              color="success"
                              variant="outlined"
                            />
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>"{deleteDialog.item?.name}"</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, item: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={deleteItem}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default ViewList;