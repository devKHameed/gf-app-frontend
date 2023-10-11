import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import InsertPageBreakOutlinedIcon from "@mui/icons-material/InsertPageBreakOutlined";
import ReorderOutlinedIcon from "@mui/icons-material/ReorderOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import {
  Box,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import FusionsFileItems from "components/FusionsFileItems";
import Scrollbar from "components/Scrollbar";
import SubHeader from "components/SubHeader";
import { ReactNode, useState } from "react";

const result = [1, 2, 3, 4, 5];
type Props = {
  onChange?: (e: SelectChangeEvent<unknown>, child: ReactNode) => void;
};

const FusionBlock = styled(Box)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));
const FusionBoxes = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minHeight: "0",
}));
const BoxContainer = styled(Box)(({ theme }) => ({
  maxWidth: "1255px",
  margin: "0 auto",
  padding: "21px 20px",
  overflow: "hidden",
  width: "100%",
}));
const FusionRow = styled(Grid)(({ theme }) => ({}));
const FusionBox = styled(Grid)(({ theme }) => ({}));
const CardsRow = styled(Grid)(({ theme }) => ({
  marginBottom: "30px",
}));
const CardsBox = styled(Grid)(({ theme }) => ({}));
const CardItem = styled(Stack)(({ theme }) => ({
  padding: "17px 23px 17px 18px",
  border: `1px solid ${theme.palette.background.GF20}`,
  borderRadius: "5px",
  gap: "16px",

  ".MuiTypography-h5 ": {
    fontSize: "14px",
    lineHeight: "17px",
    fontWeight: "500",
    margin: "0 0 3px",
  },

  ".MuiTypography-body2": {
    fontSize: "12px",
    lineHeight: "15px",
    fontWeight: "500",
  },
}));

const IconLeft = styled(Box)(({ theme }) => ({
  width: "24px",
  minWidth: "24px",

  "svg, img": {
    width: "100%",
    height: "auto",
    display: "block",
  },
}));

const IconRight = styled(Box)(({ theme }) => ({
  width: "24px",
  minWidth: "24px",

  "svg, img": {
    width: "100%",
    height: "auto",
    display: "block",
  },
}));

const CenterContent = styled(Box)(({ theme }) => ({
  flexGrow: "1",
  flexBasis: "0",
  minWidth: "0",
}));

const FiltersArea = styled(Stack)(({ theme }) => ({
  margin: "0 0 30px",
}));

const TagsArea = styled(Stack)(({ theme }) => ({
  alignItems: "center",

  ".MuiChip-root": {
    background: theme.palette.background.cardsBorder,
    padding: "0 9px",
    borderRadius: "4px",
    margin: "2px 8px 2px 0",
    height: "24px",

    ".MuiChip-label": {
      fontSize: "12px",
      lineHeight: "24px",
      padding: "0 12px 0 0",
    },

    ".MuiChip-deleteIcon": {
      width: "16px",
      height: "auto",
      margin: "0",
      color: theme.palette.text.primary,
    },
  },

  ".result-counter": {
    fontSize: "12px",
    lineHeight: "14px",
    color: theme.palette.background.GF80,
    padding: "0 0 0 11px",
  },
}));

const SelectHolder = styled(Stack)(({ theme }) => ({
  ".MuiInputBase-root": {
    minHeight: "inherit !important",
    background: "none !important",

    ".MuiSelect-select": {
      padding: "0 18px 0 0 !important",
      fontSize: "12px",
      lineHeight: "17px",
      background: "none !important",
    },
  },

  ".MuiTypography-root": {
    fontSize: "12px",
    lineHeight: "14px",
    color: theme.palette.background.GF50,
    margin: "0 10px 0 0",
  },

  ".MuiSelect-icon": {
    width: "14px",
    height: "auto",
    right: "0 !important",
    color: theme.palette.background.GF80,
    top: "calc(50% - 7px)",
  },
}));

const ButtonsHolder = styled(Stack)(({ theme }) => ({
  padding: "0 0 0 8px",
  gap: "4px",
}));

const FavouriteButton = styled(Box)(({ theme }) => ({
  padding: "0 0 0 30px",
}));

const ButtonBox = styled(IconButton)(({ theme }) => ({
  width: "26px",
  minWidth: "26px",
  height: "26px",
  borderRadius: "4px",
  background: theme.palette.background.GF10,
  fontSize: "12px",
  lineHeight: "15px",
  color: theme.palette.background.GF40,

  "&:hover": {
    color: theme.palette.text.primary,
    background: theme.palette.background.GF20,
  },

  svg: {
    width: "16px",
    height: "auto",
    display: "block",
  },
}));

const FusionsView: React.FC<Props> = (props) => {
  const { onChange, ...rest } = props;
  const [value, setValue] = useState("10");

  const handleChange = (
    event: SelectChangeEvent<unknown>,
    child: ReactNode
  ) => {
    setValue(event.target.value as string);
    onChange?.(event, child);
  };
  return (
    <FusionBlock>
      <SubHeader />
      <FusionBoxes>
        <Scrollbar>
          <BoxContainer>
            <CardsRow container spacing={"30px"}>
              <CardsBox item xs={6} md={4} lg={3}>
                <CardItem alignItems='center' direction={"row"}>
                  <IconLeft>
                    <InsertDriveFileOutlinedIcon />
                  </IconLeft>
                  <CenterContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      New Fusion File
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Create and prototype
                    </Typography>
                  </CenterContent>
                  <IconRight>
                    <AddOutlinedIcon />
                  </IconRight>
                </CardItem>
              </CardsBox>
              <CardsBox item xs={6} md={4} lg={3}>
                <CardItem alignItems='center' direction={"row"}>
                  <IconLeft>
                    <InsertPageBreakOutlinedIcon />
                  </IconLeft>
                  <CenterContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      Import Fusion
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Create and prototype
                    </Typography>
                  </CenterContent>
                  <IconRight>
                    <FileUploadOutlinedIcon />
                  </IconRight>
                </CardItem>
              </CardsBox>
            </CardsRow>
            <FiltersArea
              justifyContent='space-between'
              alignItems='center'
              direction={"row"}
            >
              <TagsArea direction={"row"}>
                {result.map((v) => (
                  <Chip
                    key={v}
                    label={v}
                    onDelete={() => console.log("")}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
                {!!result.length ? (
                  <span className='result-counter'>Found ${result.length}</span>
                ) : (
                  ""
                )}
              </TagsArea>
              <Stack direction={"row"}>
                <SelectHolder direction={"row"} alignItems='center'>
                  <Typography variant='subtitle1'>Sort :</Typography>
                  <Select
                    value={value}
                    onChange={handleChange}
                    // variant="outlined"
                    // variant="standard"
                    IconComponent={ExpandMoreIcon}
                    size='small'
                    variant='filled'
                    renderValue={(value) => {
                      return (
                        <Box sx={{ display: "flex", gap: 1 }}>{value}</Box>
                      );
                    }}
                    {...rest}
                  >
                    <MenuItem value={"None"}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </SelectHolder>
                <ButtonsHolder direction={"row"}>
                  <ButtonBox aria-label='upload picture'>
                    <GridViewOutlinedIcon />
                  </ButtonBox>
                  <ButtonBox aria-label='upload picture'>
                    <ReorderOutlinedIcon />
                  </ButtonBox>
                </ButtonsHolder>
                <FavouriteButton>
                  <ButtonBox aria-label='upload picture'>
                    <StarBorderOutlinedIcon />
                  </ButtonBox>
                </FavouriteButton>
              </Stack>
            </FiltersArea>
            <FusionRow container spacing={"20px"}>
              {result.map((ele) => {
                return (
                  <FusionBox item xs={6} md={4} lg={3} key={ele}>
                    <FusionsFileItems isFavorite={true} />
                  </FusionBox>
                );
              })}
            </FusionRow>
          </BoxContainer>
        </Scrollbar>
      </FusionBoxes>
    </FusionBlock>
  );
};

export default FusionsView;
