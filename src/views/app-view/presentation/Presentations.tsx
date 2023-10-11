import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Box,
  Grid,
  IconButton,
  SelectChangeEvent,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { createSelectorFunctions } from "auto-zustand-selectors-hook";
import FusionsFileItems from "components/FusionsFileItems";
import Scrollbar from "components/Scrollbar";
import SubHeader from "components/SubHeader";
import useAppNavigate from "hooks/useAppNavigate";
import { ApiModels } from "queries/apiModelMapping";
import useCreateItem from "queries/useCreateItem";
import useDeleteItem from "queries/useDeleteItem";
import useListItems from "queries/useListItems";
import { ReactNode, useEffect } from "react";
import { useStageStore } from "store/stores/presentation/StageDataList";
import { v4 } from "uuid";
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
const useStageS = createSelectorFunctions(useStageStore);
const Presentions: React.FC<Props> = (props) => {
  const { onChange, ...rest } = props;
  const stageDataList = useStageS();
  const { data: presentations, isLoading: isprLoading } = useListItems({
    modelName: ApiModels.Presentation,
  });
  const { mutate: createPresentation, isLoading } = useCreateItem({
    modelName: ApiModels.Presentation,
  });
  const { mutate: deletePres } = useDeleteItem({
    modelName: ApiModels.Presentation,
  });
  const router = useAppNavigate();
  useEffect(() => {
    stageDataList.clearItems();
  }, []);
  const handleChange = (
    event: SelectChangeEvent<unknown>,
    child: ReactNode
  ) => {
    onChange?.(event, child);
  };
  const handleCreatePresentaion = async () => {
    const id = v4();
    createPresentation(
      {
        title: id,
        sort_order: Math.round(Date.now() / 1000),
      },
      {
        onSuccess(data) {
          router(data.slug);
        },
      }
    );
  };
  const handleEditSlide = (slug: string) => {
    router(slug);
  };
  const handleDeletePresentaion = (slug: string) => {
    if (!!presentations?.length) {
      deletePres({
        slug: slug,
      });
    }
  };
  return (
    <FusionBlock>
      <SubHeader title='Presentations' />
      <FusionBoxes>
        <Scrollbar>
          <BoxContainer>
            <CardsRow container spacing={"30px"}>
              <CardsBox
                item
                xs={6}
                md={4}
                lg={3}
                onClick={() => handleCreatePresentaion()}
              >
                <CardItem alignItems='center' direction={"row"}>
                  <IconLeft>
                    <InsertDriveFileOutlinedIcon />
                  </IconLeft>
                  <CenterContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      New Presentation
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Create a Presentation
                    </Typography>
                  </CenterContent>
                  <IconRight>
                    <AddOutlinedIcon />
                  </IconRight>
                </CardItem>
              </CardsBox>
            </CardsRow>

            <FusionRow container spacing={"20px"}>
              {presentations?.map((ele, i) => {
                return (
                  <FusionBox
                    item
                    xs={6}
                    md={4}
                    lg={3}
                    key={ele.slug || i}
                    onClick={() => handleEditSlide(ele.slug)}
                  >
                    <FusionsFileItems
                      title={ele.title}
                      isDelete={true}
                      rightIcon={
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePresentaion(ele?.slug);
                          }}
                        >
                          <DeleteOutlinedIcon sx={{ width: "18px" }} />
                        </IconButton>
                      }
                    />
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

export default Presentions;
