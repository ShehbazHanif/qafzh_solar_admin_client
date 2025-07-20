import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";

const serviceOptions = ["Install", "Repair"];

const EngineerForm = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    governorate: "",
    services: [],
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        city: initialData.city || "",
        governorate: initialData.governorate || "",
        services: initialData.services || [],
      });
    } else {
      setForm({
        name: "",
        phone: "",
        city: "",
        governorate: "",
        services: [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (event) => {
    const {
      target: { value },
    } = event;
    setForm({
      ...form,
      services: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "white",
          width: 400,
          mx: "auto",
          mt: "10%",
          borderRadius: 2,
        }}>
        <Typography variant="h6" mb={2}>
          {initialData ? "Edit Engineer" : "Add Engineer"}
        </Typography>

        <TextField
          name="name"
          label="Name"
          fullWidth
          value={form.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          name="phone"
          label="Phone"
          fullWidth
          value={form.phone}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="services-label">Services</InputLabel>
          <Select
            labelId="services-label"
            multiple
            name="services"
            value={form.services}
            onChange={handleServiceChange}
            input={<OutlinedInput label="Services" />}
            renderValue={(selected) => selected.join(", ")}>
            {serviceOptions.map((service) => (
              <MenuItem key={service} value={service}>
                <Checkbox checked={form.services.indexOf(service) > -1} />
                <ListItemText primary={service} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="governorate"
          label="Governorate"
          fullWidth
          value={form.governorate}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          name="city"
          label="City"
          fullWidth
          value={form.city}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <Button fullWidth variant="contained" onClick={handleSubmit}>
          {initialData ? "Update" : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default EngineerForm;
