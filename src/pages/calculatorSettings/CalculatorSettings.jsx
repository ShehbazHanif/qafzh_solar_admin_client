import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import axios from "axios";
import Layout from "../../components/layout/Layout";

const token = localStorage.getItem("adminToken");

const CalculatorSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    batteryEfficiency: "",
    panelEfficiency: "",
    inverterEfficiency: "",
    batteryCostPerAh: "",
    panelCostPerWatt: "",
    inverterCostPerWatt: "",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/v1/calculator/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/v1/calculator/settings",
        settings,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update settings.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Layout>
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          Calculator Settings
        </Typography>
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <TextField
                label="Battery Efficiency (%)"
                name="batteryEfficiency"
                fullWidth
                margin="normal"
                value={settings.batteryEfficiency}
                onChange={handleChange}
              />
              <TextField
                label="Panel Efficiency (%)"
                name="panelEfficiency"
                fullWidth
                margin="normal"
                value={settings.panelEfficiency}
                onChange={handleChange}
              />
              <TextField
                label="Inverter Efficiency (%)"
                name="inverterEfficiency"
                fullWidth
                margin="normal"
                value={settings.inverterEfficiency}
                onChange={handleChange}
              />
              <TextField
                label="Battery Cost per Ah (PKR)"
                name="batteryCostPerAh"
                fullWidth
                margin="normal"
                value={settings.batteryCostPerAh}
                onChange={handleChange}
              />
              <TextField
                label="Panel Cost per Watt (PKR)"
                name="panelCostPerWatt"
                fullWidth
                margin="normal"
                value={settings.panelCostPerWatt}
                onChange={handleChange}
              />
              <TextField
                label="Inverter Cost per Watt (PKR)"
                name="inverterCostPerWatt"
                fullWidth
                margin="normal"
                value={settings.inverterCostPerWatt}
                onChange={handleChange}
              />

              <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                Save Settings
              </Button>
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default CalculatorSettings;
