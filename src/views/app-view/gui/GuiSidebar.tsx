import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import TagEditWithDataProvider from "components/Form/TagEditor/TagEditWithDataProvider";
import { useParams } from "react-router-dom";

const SidebarContainer = styled(Box)(({ theme }) => {
  return {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    height: "100%",
    // width: "420px",

    [`${theme.breakpoints.down("sm")}`]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  };
});

const GuiSidebar: React.FC = (props) => {
  const { slug: guiSlug = "" } = useParams<{ slug?: string }>();

  return (
    <SidebarContainer>
      <Box mt={2.5}>
        <TagEditWithDataProvider recordType={guiSlug} key={guiSlug} />
      </Box>
    </SidebarContainer>
  );
};

export default GuiSidebar;
