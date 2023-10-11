import { Theme } from "@mui/material/styles";
import Accordion from "./Accordion";
import Alert from "./Alert";
import AlertTitle from "./AlertTitle";
import AppBar from "./AppBar";
import Autocomplete from "./Autocomplete";
import Avatar from "./Avatar";
import Backdrop from "./Backdrop";
import Badge from "./Badge";
import Breadcrumbs from "./Breadcrumbs";
import Button from "./Button";
import ButtonBase from "./ButtonBase";
import ButtonGroup from "./ButtonGroup";
import Card from "./Card";
import Checkbox from "./Checkbox";
import Chip from "./Chip";
import ControlLabel from "./ControlLabel";
import CssBaseline from "./CssBaseline";
import DataGrid from "./DataGrid";

import Dialog from "./Dialog";
import Drawer from "./Drawer";
import Fab from "./Fab";
import Input from "./Input";
import Link from "./Link";
import Lists from "./List";
import LoadingButton from "./LoadingButton";
import Menu from "./Menu";
import Modal from "./Modal";
import Pagination from "./Pagination";
import Paper from "./Paper";
import PickersDay from "./PickersDay ";
import Popover from "./Popover";
import Progress from "./Progress";
import Radio from "./Radio";
import Rating from "./Rating";
import Select from "./Select";
import Skeleton from "./Skeleton";
import Slider from "./Slider";
import Stepper from "./Stepper";
import SvgIcon from "./SvgIcon";
import Switch from "./Switch";
import Table from "./Table";
import Tabs from "./Tabs";
import TextField from "./TextField";
import Timeline from "./Timeline";
import ToggleButton from "./ToggleButton";
import Tooltip from "./Tooltip";
import TreeView from "./TreeView";
import Typography from "./Typography";

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme: Theme) {
  return Object.assign(
    Modal(theme),
    Fab(theme),
    PickersDay(theme),
    Tabs(theme),
    Chip(theme),
    AlertTitle(theme),
    Card(theme),
    Menu(theme),
    Link(),
    Input(theme),
    AppBar(theme),
    Radio(theme),
    Badge(),
    Lists(theme),
    Table(theme),
    Paper(theme),
    Alert(theme),
    Switch(theme),
    Select(theme),
    Button(theme),
    ButtonBase(theme),
    Rating(theme),
    Dialog(theme),
    Avatar(theme),
    Slider(theme),
    Drawer(theme),
    Stepper(theme),
    Tooltip(theme),
    Popover(theme),
    SvgIcon(),
    Checkbox(theme),
    DataGrid(theme),
    Skeleton(theme),
    Timeline(theme),
    TreeView(theme),
    Backdrop(theme),
    Progress(theme),
    Accordion(theme),
    Typography(theme),
    Pagination(theme),
    ButtonGroup(theme),
    Breadcrumbs(theme),
    CssBaseline(),
    Autocomplete(theme),
    ControlLabel(theme),
    ToggleButton(theme),
    TextField(theme),
    LoadingButton()
  );
}
