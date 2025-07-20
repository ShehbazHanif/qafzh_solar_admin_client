import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";

const servicesOptions = ["sale", "install", "repair"];

const ShopForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    governorate: "",
    services: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        phone: "",
        city: "",
        governorate: "",
        services: [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      services: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Edit Shop" : "Add Shop"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Shop Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          label="Governorate"
          name="governorate"
          value={formData.governorate}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          select
          fullWidth
          label="Services"
          SelectProps={{ multiple: true }}
          value={formData.services}
          onChange={handleServiceChange}
          sx={{ my: 1 }}>
          {servicesOptions.map((service) => (
            <MenuItem key={service} value={service}>
              {service}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShopForm;
