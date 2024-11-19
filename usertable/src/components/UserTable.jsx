import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import LogoutIcon from "@mui/icons-material/Logout";
import { useCookies } from "react-cookie";
import axios from "axios";

const UserTable = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState({ type: "name", value: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState({ name: "", address: "", phone: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", address: "", phone: "" });
  const [cookies, , removeCookie] = useCookies(["user"]);
  const navigate = useNavigate();

  // Fetch users from API on mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/users/get")
      .then((response) => {
        console.log("Fetched Data:", response.data); 
        if (Array.isArray(response.data.data)) {
          setUsers(response.data.data); 
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Logout function
  const handleLogout = () => {
    removeCookie("user");
    onLogout();
    navigate("/login");
  };

  // Add new user
  const handleAddUser = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/users/create", newUser)
      .then((response) => {
        if (response.data.success) {
          setUsers([...users, response.data.data]);
          handleCloseDialog();
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  // Delete user
  const handleDeleteUser = (id) => {
    axios
      .delete(`http://localhost:3000/users/delete/${id}`)
      .then((response) => {
        if (response.data.success) {
          setUsers(users.filter((user) => user._id !== id)); // Use _id for deletion
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  // Handle edit click
  const handleEditClick = (user) => {
    setEditingUserId(user._id); // Use _id for editing
    setEditingUser({ name: user.name, address: user.address, phone: user.phone });
  };

  // Save edit changes
  const handleSaveEdit = (id) => {
    axios
      .put(`http://localhost:3000/users/update/${id}`, editingUser)
      .then((response) => {
        if (response.data.success) {
          setUsers(users.map((user) => (user._id === id ? { ...user, ...editingUser } : user))); // Use _id for saving
          setEditingUserId(null);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => console.error("Error saving user edit:", error));
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  // Toggle filter view
  const handleFilterIconClick = () => {
    setFilterOpen((prev) => !prev);
  };

  // Handle dialog open/close
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({ name: "", address: "", phone: "" });
  };

  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtered users based on filter criteria
  const filteredUsers = users.filter((user) => {
    if (filter.value === "") return true;
    switch (filter.type) {
      case "name":
        return user.name.toLowerCase().includes(filter.value.toLowerCase());
      case "id":
        return user._id.toString().includes(filter.value); // Correct filtering by _id
      case "phone":
        return user.phone.includes(filter.value);
      case "address":
        return user.address.toLowerCase().includes(filter.value.toLowerCase());
      default:
        return true;
    }
  });

  return (
    <>
      <Paper>
        <div style={{ margin: "20px", display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ backgroundColor: "#1976d2", color: "#fff", padding: "10px", borderRadius: "4px" }}>
            Welcome, {cookies.user || "Guest"}!
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IconButton onClick={handleFilterIconClick} color="primary">
              <FilterListIcon />
            </IconButton>
            {filterOpen && (
              <>
                <FormControl variant="outlined" style={{ minWidth: 150, marginRight: "10px" }}>
                  <InputLabel>Filter By</InputLabel>
                  <Select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })} label="Filter By">
                    <MenuItem value="id">ID</MenuItem>
                    <MenuItem value="name">Full Name</MenuItem>
                    <MenuItem value="address">Address</MenuItem>
                    <MenuItem value="phone">Phone Number</MenuItem>
                  </Select>
                </FormControl>
                <TextField label="Filter" variant="outlined" name="value" value={filter.value} onChange={handleFilterChange} />
              </>
            )}
          </div>
          <Button variant="contained" color="primary" onClick={handleOpenDialog} sx={{maxHeight:'50px',marginTop:'20px'}}>Add User</Button>
          <IconButton color="secondary" onClick={handleLogout}><LogoutIcon /></IconButton>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>
                    {editingUserId === user._id ? (
                      <TextField name="name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user._id ? (
                      <TextField name="address" value={editingUser.address} onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} />
                    ) : (
                      user.address
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user._id ? (
                      <TextField name="phone" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} />
                    ) : (
                      user.phone
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user._id ? (
                      <IconButton onClick={() => handleSaveEdit(user._id)} color="primary"><SaveIcon /></IconButton>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEditClick(user)} color="primary"><EditIcon /></IconButton>
                        <IconButton onClick={() => window.confirm("Delete this user?") && handleDeleteUser(user._id)} color="secondary"><DeleteIcon /></IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{bgcolor:"rgb(25, 118, 210)", color:'white'}}>Add New User</DialogTitle>
        <DialogContent >
          <TextField label="Full Name" fullWidth value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} sx={{marginBottom:'7px', marginTop:'35px'}} />
          <TextField label="Address" fullWidth value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} sx={{marginBottom:'7px', marginTop:'7px'}}/>
          <TextField label="Phone Number" fullWidth value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} sx={{marginBottom:'7px', marginTop:'7px'}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleAddUser} color="primary">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserTable;
