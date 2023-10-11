import { Star } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React from "react";

type Props = {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  title?: string;
  createdAt?: string;
  thumbnail?: string;
  isFavorite?: boolean;
  isDelete?: boolean;
};

const FusionCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.GF10,
  border: `1px solid ${theme.palette.background.GF10}`,
  borderRadius: "5px",
  overflow: "hidden",
  position: "relative",

  ".image-holder": {
    padding: "12px",
    background: theme.palette.common.blackshades?.["100p"],

    img: {
      width: "148px",
      height: "auto",
      display: "block",
      margin: "0 auto",
    },
  },

  ".MuiCardContent-root": {
    padding: "8px 8px 9px 17px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  ".icon": {
    width: "22px",

    "svg, img": {
      width: "100%",
      height: "auto",
      display: "block",
    },
  },

  ".MuiTypography-h5": {
    fontSize: "14px",
    lineHeight: "17px",
    fontWeight: "500",
    margin: "0",
  },

  ".MuiTypography-body2": {
    fontSize: "12px",
    lineHeight: "15px",
    fontWeight: "300",
  },

  ".img-star": {
    width: "15px",
    minWidth: "15px",
    color: theme.palette.background.cardsBorder,

    "svg, img": {
      width: "100%",
      height: "auto",
      display: "block",
      color: "currentColor",
    },
  },
}));

const FusionsFileItems: React.FC<Props> = (props) => {
  const {
    title = "Radiant Monkey Vision",
    createdAt = "Digital effect routing for skill monkey get paid lamer face titty milk.",
    icon = (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='40'
        height='40'
        viewBox='0 0 40 40'
        fill='none'
      >
        <rect width='40' height='40' rx='5' fill='#0061FF' />
        <path
          d='M20 13.75L14 17.5L20 21.25L14 25L8 21.25L14 17.5L8 13.75L14 10L20 13.75ZM13.9841 26.25L19.9841 22.5L25.9841 26.25L19.9841 30L13.9841 26.25ZM20 21.25L26 17.5L20 13.75L26 10L32 13.75L26 17.5L32 21.25L26 25L20 21.25Z'
          fill='white'
        />
      </svg>
    ),
    isFavorite = false,
    isDelete = false,
    rightIcon,
    thumbnail = "https://s3-alpha-sig.figma.com/img/c376/89f5/c173957b82a01e6efa56d95a422061d6?Expires=1684713600&Signature=jy30Y8IDbcGvgHAeSxu-owCjnupXBxpxnlxpp~XuMaSUT~RV5K0DrJASz30V3zYySpqNU~-m9~nx7gCClWL-Pt67wlISPfIxPiTnd0-20ELUcxH~B2jW0SFEU~WfwqOqW-jaqw5O2j15u7VYqyIPlD1UPcRQS8F30hu-L~Qygvu~Vuz925uN~TvzerjaUUCBpkrCuHhohLmvovhTr1~p4m9EsHEdzFp2ypDUdTrtwxiy-x83oU5L4KLE1m0nu~r3hA1Ydwa5L9UHG0G-aw4tYWbOaT1NrooR2T1zI3ikWUaEd~S3MEgjGxselTgS3jqalNVyV191jGMjGslEoyXL7g__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4",
    ...rest
  } = props;

  return (
    <FusionCard>
      <Box className='image-holder'>
        <CardMedia
          component='img'
          image={thumbnail || "/static/images/cards/contemplative-reptile.jpg"}
          alt='green iguana'
        />
      </Box>
      <CardContent>
        <Stack alignItems='center' direction={"row"} gap='20px'>
          <Box className='icon'>{icon}</Box>
          <Stack gap='5px' className='text-holder'>
            <Typography gutterBottom variant='h5' component='div'>
              {title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {createdAt}
            </Typography>
          </Stack>
        </Stack>
        {isFavorite ? (
          <div className='img-star'>
            <Star />
          </div>
        ) : isDelete ? (
          <div>{rightIcon}</div>
        ) : null}
      </CardContent>
    </FusionCard>
  );
};

export default FusionsFileItems;
