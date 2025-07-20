import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Switch } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import ShopForm from "../../components/ShopForm";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editShop, setEditShop] = useState(null);
  const token = localStorage.getItem("adminToken");

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/shop/getAll", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShops(res.data);
      setFilteredShops(res.data);
    } catch (err) {
      console.error("Error fetching shops:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSearch = () => {
    const filtered = shops.filter((shop) =>
      shop.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    setFilteredShops(filtered);
  };

  const handleAddOrEdit = async (formData) => {
    try {
      if (editShop) {
        await axios.patch(
          `http://localhost:5000/api/v1/shop/update/${editShop._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/v1/shop/add", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchShops();
      setOpenForm(false);
      setEditShop(null);
    } catch (error) {
      console.error("Error submitting shop:", error);
    }
  };
  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/shop/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchShops(); // refresh
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/shop/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchShops();
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Shop Name",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 1 }}>{params.value[0]}</Avatar>
          {params.value}
        </Box>
      ),
    },
    { field: "phone", headerName: "Phone", width: 140 },
    {
      field: "services",
      headerName: "Services",
      width: 180,
      renderCell: (params) => params.value.join(", "),
    },
    { field: "governorate", headerName: "Governorate", width: 150 },
    { field: "city", headerName: "City", width: 130 },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => toggleStatus(params.row._id)}
          color="success"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => {
              setEditShop(params.row);
              setOpenForm(true);
            }}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Verified Shops</Typography>
        <Button variant="contained" onClick={() => setOpenForm(true)}>
          Add Shop
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search by shop name..."
            variant="outlined"
            sx={{ flexGrow: 1, mr: 2 }}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button variant="outlined" onClick={handleSearch}>
            <SearchIcon />
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={filteredShops.map((shop) => ({ ...shop, id: shop._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          loading={loading}
        />
      </Paper>

      <ShopForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditShop(null);
        }}
        onSubmit={handleAddOrEdit}
        initialData={editShop}
      />
    </Layout>
  );
};

export default Shops;
