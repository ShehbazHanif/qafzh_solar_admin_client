import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Typography,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import Layout from "../../components/layout/Layout";

const token = localStorage.getItem("adminToken");
const placementOptions = [
  "homepage",
  "marketplace",
  "calculator",
  "engineerPage",
  "offersTab",
];

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [search, setSearch] = useState("");
  const [placement, setPlacement] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [form, setForm] = useState({
    title: "",
    linkType: "internal",
    externalUrl: "",
    placement: "",
    image: null,
  });

  // Fetch ads
  const fetchAds = async () => {
    const res = await axios.get("http://localhost:5000/api/v1/ads/get/allAds", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAds(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    fetchAds();
  }, [selectedAd]);

  const handleDelete = async (id) => {
    await axios.delete("http://localhost:5000/api/v1/ads/delete/${id}", {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAds();
  };

  const handleToggleStatus = async (id, active) => {
    await axios.patch(
      `http://localhost:5000/api/v1/ads/update/${id}`,
      { active: !active },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchAds();
  };

  const handleOpen = (ad = null) => {
    setSelectedAd(ad);
    if (ad) {
      setForm({
        title: ad.title,
        linkType: ad.linkType,
        externalUrl: ad.externalUrl || "",
        placement: ad.placement,
        image: null,
      });
    } else {
      setForm({
        title: "",
        linkType: "internal",
        externalUrl: "",
        placement: "",
        image: null,
      });
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    if (selectedAd) {
      await axios.patch(
        `http://localhost:5000/api/v1/ads/update/${selectedAd._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      await axios.post("http://localhost:5000/api/v1/ads/postads", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setOpen(false);
    fetchAds();
  };

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(search.toLowerCase()) &&
      (placement ? ad.placement === placement : true)
  );

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 200,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={params.row.imageUrl} variant="rounded" />
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
    { field: "linkType", headerName: "Link Type", width: 120 },
    { field: "placement", headerName: "Placement", width: 150 },
    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleStatus(params.row._id, params.value)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleOpen(params.row)}>
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
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          Manage Ads
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Search Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            select
            label="Placement"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            sx={{ minWidth: 200 }}>
            <MenuItem value="">All</MenuItem>
            {placementOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={() => handleOpen()}>
            Add Ad
          </Button>
        </Box>

        <DataGrid
          rows={filteredAds}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          pageSize={10}
        />

        {/* Modal */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>{selectedAd ? "Edit Ad" : "Add New Ad"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Link Type"
              select
              value={form.linkType}
              onChange={(e) => setForm({ ...form, linkType: e.target.value })}>
              <MenuItem value="internal">Internal</MenuItem>
              <MenuItem value="external">External</MenuItem>
            </TextField>
            {form.linkType === "external" && (
              <TextField
                fullWidth
                margin="dense"
                label="External URL"
                value={form.externalUrl}
                onChange={(e) =>
                  setForm({ ...form, externalUrl: e.target.value })
                }
              />
            )}
            <TextField
              fullWidth
              margin="dense"
              label="Placement"
              select
              value={form.placement}
              onChange={(e) => setForm({ ...form, placement: e.target.value })}>
              {placementOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}>
              {form.image ? form.image.name : "Upload Image"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Ads;
