import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "http://localhost:5000/api/v1/admin-approval-product/get",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Admin changes status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `http://localhost:5000/api/v1/admin-approval-product/update/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `http://localhost:5000/api/product/deleteProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Table columns
  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: (params) =>
        params.row.images?.[0] ? (
          <img
            src={params.row.images[0]}
            alt="product"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          "N/A"
        ),
    },
    { field: "name", headerName: "Name", width: 150 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "condition", headerName: "Condition", width: 130 },
    { field: "brand", headerName: "Brand", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    { field: "phone", headerName: "Phone", width: 140 },
    { field: "governorate", headerName: "Governorate", width: 120 },
    { field: "city", headerName: "City", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.row.status}
            onChange={(e) =>
              handleStatusChange(params.row._id, e.target.value)
            }>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Product Approval</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            placeholder="Search by name..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />
          <Button variant="outlined" onClick={fetchProducts}>
            Refresh
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={products.filter((p) =>
            p.name?.toLowerCase().includes(search.toLowerCase())
          )}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Paper>
    </Layout>
  );
};

export default Products;
