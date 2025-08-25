import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ListItemButton } from "@mui/material";

const FilterDropdown = ({ label, options, value, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  return (
    <>
      <ListItem disablePadding sx={{ display: "block", py: 0 }}>
        <ListItemButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ width: "100%", justifyContent: "flex-start", minHeight: 48 }}
        >
          <ListItemIcon>
            <FilterListIcon />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      </ListItem>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem
          key="all"
          selected={value === ""}
          onClick={() => {
            onChange("");
            setAnchorEl(null);
          }}
        >
          All
        </MenuItem>
        {options.map((opt) => (
          <MenuItem
            key={opt}
            selected={value === opt}
            onClick={() => {
              onChange(opt);
              setAnchorEl(null);
            }}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FilterDropdown;
