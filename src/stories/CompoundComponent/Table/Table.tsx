import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableFooter, Stack, Button, MenuItem } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { EnhanceTable } from "./Table.style";
import {useTheme} from '@mui/material/styles';

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  status: string;
  // protein: number;
}
type Order = "asc" | "desc";

interface EnhancedTableProps {
  numSelected?: number;
  setStatus?: (props: any) => void;
  onRequestSort?: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  order?: Order;
  orderBy?: string;
  rowCount?: number;
}
interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

export function SplitButton(props: any) {
  const {
    options,
    label,
    isOptionsShow = false,
    setStatus,
    setRowsPerPage,
  } = props;
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };
  setStatus?.(options[selectedIndex]);
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    // setStatus?.(options[index || selectedIndex].status);
    setStatus?.(options[index]);
    if (typeof options[index] === "number") setRowsPerPage?.(options[index]);
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const theme = useTheme();

  return (
    <React.Fragment>
        <Stack direction='row' alignItems='center' gap={0.75}>
          <Button
            size="small"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            color="inherit"
            onClick={handleToggle}
            sx={{
              background: theme.palette.info.main,
              width: '20px',
              height: '20px',
              minWidth: '20px',
              borderRadius: '3px',
              p: '4px'
            }}
          >
            <ArrowDropDownIcon /> {label && label}
          </Button>
          {isOptionsShow && (
            <Button 
              color="inherit"
              sx={{
                background: theme.palette.info.main,
                borderRadius: '3px',
                height: 'auto',
                p: '1px 10px',
                fontSize: '12px',
              }} size="small" onClick={handleClick}>{options[selectedIndex]}</Button>
          )}
        </Stack>
        <Popper
          sx={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {options.map((option: any, index: any) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    </React.Fragment>
  );
}

function createData(
  status: string,
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  // protein: number
): Data {
  return {
    status,
    name,
    calories,
    fat,
    carbs,
    // protein,
  };
}

const rows = [
  createData("pending", "Cupcake", 305, 3.7, 67),
  createData("pending", "Donut", 452, 25.0, 51),
  createData("pending", "Eclair", 262, 16.0, 24),
  createData("pending", "Frozen yoghurt", 159, 6.0, 24),
  createData("pending", "Gingerbread", 356, 16.0, 49),
  createData("pending", "Honeycomb", 408, 3.2, 87),
  createData("compelete", "Ice cream sandwich", 237, 9.0, 37),
  createData("compelete", "Jelly Bean", 375, 0.0, 94),
  createData("compelete", "KitKat", 518, 26.0, 65),
  createData("compelete", "Lollipop", 392, 0.2, 98),
  createData("compelete", "Marshmallow", 318, 0, 81),
  createData("compelete", "Nougat", 360, 19.0, 9),
  createData("compelete", "Oreo", 437, 18.0, 63),
];

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "20 TASKS",
  },
  {
    id: "calories",
    numeric: true,
    disablePadding: false,
    label: "DESCRIPTION",
  },
  {
    id: "fat",
    numeric: true,
    disablePadding: false,
    label: "ASSIGNEE",
  },
  {
    id: "carbs",
    numeric: true,
    disablePadding: false,
    label: "DUE DATE",
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    setStatus,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort?.(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <Stack direction='row' gap={0.75} alignItems="center">
              {idx === 0 && (
                <SplitButton
                  options={["pending", "compelete"]}
                  isOptionsShow={true}
                  setStatus={setStatus}
                />
              )}
              {headCell.label}
            </Stack>
          </TableCell>
        ))}
        <TableCell key={"add new"} align={"right"} padding={"normal"}>
          <AddCircleOutlinedIcon />
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const [status, setStatus] = React.useState<any>("pending");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  let rowslength = 0;

  function rowFilter(array: readonly any[], status: string) {
    const rows = array.filter((ele) => status === ele?.status);
    rowslength = rows.length;
    return rows;
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      <EnhanceTable sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead setStatus={setStatus} order={"asc"} />
            <TableBody>
              {rowFilter(rows, status)
                .slice(0 * rowsPerPage, 0 * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.status}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      {/* <TableCell align="right">{row.protein}</TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter>
          <Stack direction={"row"} gap={0.75}>
            {rowslength > 0 && <Button color='inherit' sx={{background: theme.palette.background.GF5, borderRadius: '4px',}}> + {rowslength}</Button>}
            {/* <SplitButton
              options={[5, 10, 15, 20]}
              label={"Load More"}
              setRowsPerPage={setRowsPerPage}
            /> */}
            <Button  color='inherit' sx={{background: theme.palette.background.GF5, borderRadius: '4px',}}>Load More</Button>
            <Button  color='inherit' sx={{background: theme.palette.background.GF5, borderRadius: '4px',}}>All</Button>
          </Stack>
        </TableFooter>
      </EnhanceTable>
    </Box>
  );
}
