import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Chip,
  Alert,
  Autocomplete,
  Paper,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Inventory as InventoryIcon,
  Numbers as NumbersIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  LocalOffer as PriceIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { request } from "../api";

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    category: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Sample categories for autocomplete
  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Books",
    "Sports & Outdoors",
    "Home & Garden",
    "Health & Beauty",
    "Tools & Hardware",
  ];

  const handleInputChange = (field) => (event, value) => {
    const newValue = value !== undefined ? value : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
    }
    
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }
    
    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = "Price must be a valid number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    
    try {
      // Generate unique ID when adding the item
      const idResponse = await request("get", "/generate-id");
      const uniqueId = idResponse.unique_id;

      const itemData = {
        _id: uniqueId,
        name: formData.name.trim(),
        quantity: parseInt(formData.quantity),
        category: formData.category || "Uncategorized",
        description: formData.description.trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        created_at: new Date().toISOString(),
      };

      const response = await request("post", "/add-item", itemData);
      
      toast.success(`Item "${formData.name}" added successfully!`);
      
      // Reset form
      setFormData({
        name: "",
        quantity: "",
        category: "",
        description: "",
        price: "",
      });
      
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addItem();
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <InventoryIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Add New Item
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add items to your inventory with detailed information
          </Typography>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          elevation={0}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {/* Item Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  onKeyPress={handleKeyPress}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={formData.quantity}
                  onChange={handleInputChange('quantity')}
                  onKeyPress={handleKeyPress}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon />
                      </InputAdornment>
                    ),
                    inputProps: { min: 1 }
                  }}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={categories}
                  value={formData.category}
                  onChange={handleInputChange('category')}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      placeholder="Select or enter category"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CategoryIcon />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>

              {/* Price */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Price (Optional)"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange('price')}
                  onKeyPress={handleKeyPress}
                  error={!!errors.price}
                  helperText={errors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceIcon />
                      </InputAdornment>
                    ),
                    inputProps: { min: 0, step: 0.01 }
                  }}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  placeholder="Enter item description"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <DescriptionIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Form Summary */}
            {formData.name && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'action.hover', 
                    borderRadius: 2,
                    mb: 3 
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Item Preview:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    <Chip label={`Name: ${formData.name}`} size="small" />
                    {formData.quantity && (
                      <Chip label={`Qty: ${formData.quantity}`} size="small" />
                    )}
                    {formData.category && (
                      <Chip label={`Category: ${formData.category}`} size="small" />
                    )}
                    {formData.price && (
                      <Chip label={`Price: $${formData.price}`} size="small" />
                    )}
                  </Box>
                </Paper>
              </motion.div>
            )}

            {/* Submit Button */}
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={addItem}
                disabled={loading || !formData.name || !formData.quantity}
                startIcon={<AddIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  minWidth: 200,
                }}
              >
                {loading ? "Adding Item..." : "Add Item"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Help Text */}
      <Alert 
        severity="info" 
        sx={{ mt: 3, borderRadius: 2 }}
      >
        <Typography variant="body2">
          <strong>Tip:</strong> You can press Enter to quickly add the item, or use Tab to navigate between fields.
        </Typography>
      </Alert>
    </Box>
  );
};

export default AddItem;