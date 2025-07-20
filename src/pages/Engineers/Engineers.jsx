import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { Switch } from "@mui/material";
import Layout from "../../components/layout/Layout";
import EngineerForm from "../../components/EngineerForm";
import axios from "axios";

const Engineers = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("adminToken");

  const fetchEngineers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/v1/engineer/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEngineers(res.data);
    } catch (error) {
      showSnackbar("Failed to fetch engineers", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchEngineers();
  }, []);
  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/engineer/toggle-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchEngineers; // refresh
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };
  const handleAddOrEditEngineer = async (formData) => {
    try {
      if (selectedEngineer) {
        await axios.patch(
          `http://localhost:5000/api/v1/engineer/update/${selectedEngineer._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showSnackbar("Engineer updated successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/v1/engineer/add",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        showSnackbar("Engineer added successfully");
      }
      fetchEngineers();
      setOpenForm(false);
      setSelectedEngineer(null);
    } catch (error) {
      showSnackbar("Operation failed", "error");
    }
  };

  const handleDeleteEngineer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this engineer?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/engineer/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSnackbar("Engineer deleted successfully");
      fetchEngineers();
    } catch (error) {
      showSnackbar("Failed to delete engineer", "error");
    }
  };

  const handleEditClick = (engineer) => {
    setSelectedEngineer(engineer);
    setOpenForm(true);
  };

  const filter = async () => {
    if (!searchKeyword.trim()) {
      fetchEngineers();
    } else {
      const keyword = searchKeyword.toLowerCase();
      const filtered = engineers.filter((eng) =>
        eng.name.toLowerCase().includes(keyword)
      );
      setEngineers(filtered);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Engineer",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 2 }}>{params.value.charAt(0)}</Avatar>
          {params.value}
        </Box>
      ),
    },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "services",
      headerName: "Services",
      width: 180,
      renderCell: (params) => params.value?.join(", "),
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
      width: 130,
      renderCell: (params) => {
        const engineer = engineers.find((e) => e._id === params.row.id);
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="primary"
              onClick={() => handleEditClick(engineer)}>
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteEngineer(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Engineers</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenForm(true);
            setSelectedEngineer(null);
          }}>
          Add Engineer
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            placeholder="Search engineers..."
            variant="outlined"
            size="small"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />
          <Button variant="outlined" sx={{ mr: 1 }} onClick={filter}>
            Filter
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={
            Array.isArray(engineers)
              ? engineers.map((e) => ({ ...e, id: e._id }))
              : []
          }
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          loading={loading}
        />
      </Paper>

      <EngineerForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleAddOrEditEngineer}
        initialData={selectedEngineer}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Engineers;
