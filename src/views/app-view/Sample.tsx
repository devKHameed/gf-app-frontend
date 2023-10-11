import { Box } from "@mui/material";
import ManagementSettings from "components/ManagementSettings";
import { DocumentElementType } from "enums";

const fields: DataField[] = [
  {
    title: "Description",
    slug: "description",
    type: DocumentElementType.TextArea,
    tooltip: "description",
    id: "description",
  },
  {
    title: "Issue",
    slug: "issue",
    type: DocumentElementType.TextField,
    tooltip: "issue",
    id: "issue",
  },
  {
    title: "Checklist",
    slug: "checklist",
    type: DocumentElementType.Checkbox,
    tooltip: "checklist",
    id: "checklist",
  },
  {
    title: "Assignee",
    slug: "assignee",
    type: DocumentElementType.User,
    tooltip: "assignee",
    id: "assignee",
  },
  {
    title: "User Type",
    slug: "user_type",
    type: DocumentElementType.UserType,
    tooltip: "user_type",
    id: "user_type",
  },
  {
    title: "Due Date",
    slug: "due_date",
    type: DocumentElementType.Date,
    tooltip: "due_date",
    id: "due_date",
  },
  {
    title: "Rating",
    slug: "rating",
    type: DocumentElementType.Rating,
    tooltip: "rating",
    id: "rating",
  },
  {
    title: "Video",
    slug: "video",
    type: DocumentElementType.AudioVideo,
    tooltip: "video",
    id: "video",
  },
  {
    title: "Image",
    slug: "image",
    type: DocumentElementType.Image,
    tooltip: "image",
    id: "image",
  },
  {
    title: "File",
    slug: "file",
    type: DocumentElementType.File,
    tooltip: "file",
    id: "file",
  },
  {
    title: "Progress",
    slug: "progress",
    type: DocumentElementType.Progress,
    tooltip: "progress",
    id: "progress",
  },
  {
    title: "Code Editor",
    slug: "code",
    type: DocumentElementType.CodeEditor,
    tooltip: "code",
    id: "code",
  },
];

type ItemType = {
  description?: string;
  issue?: string;
  assignee?: string[];
  user_type?: string[];
  checklist?: string[];
  rating?: number;
  progress?: number;
  video?: { name?: string };
  image?: { name?: string };
  file?: { name?: string };
  code?: string;
  due_date?: string;
  _id: string;
};

const items: ItemType[] = [
  {
    _id: "0",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "1",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "2",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "3",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "4",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "5",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "6",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "7",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "8",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "9",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "10",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "11",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "12",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "13",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "14",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "15",
  },
  {
    description:
      "Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
    issue: "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.",
    assignee: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    user_type: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    checklist: [
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
      "John Doe",
    ],
    rating: 4,
    progress: 60,
    video: { name: "test.mp4" },
    image: { name: "test.jpg" },
    file: { name: "test.pdf" },
    code: "",
    due_date: "2022-11-17",
    _id: "16",
  },
];
type Props = {};

const Home = (props: Props) => {
  return (
    <Box>
      <ManagementSettings />
      {/* <DeveloperSettings /> */}
    </Box>
    // <Scrollbar autoHeight autoHeightMax={500}>
    // <Box>
    //   <TextField
    //     hiddenLabel
    //     id="filled-hidden-label-small"
    //     defaultValue="Small"
    //     variant="filled"
    //     size="small"
    //   />
    //   <TextField
    //     hiddenLabel
    //     id="filled-hidden-label-normal"
    //     defaultValue="Normal"
    //     variant="filled"
    //   />
    //   <FormControl sx={{ minWidth: 150 }} variant="filled" size="small">
    //     <Select displayEmpty>
    //       <MenuItem>1233865</MenuItem>
    //       <MenuItem>1233865</MenuItem>
    //       <MenuItem>1233865</MenuItem>
    //       <MenuItem>1233865</MenuItem>
    //       <MenuItem>1233865</MenuItem>
    //     </Select>
    //   </FormControl>
    //   <ColorPicker />
    //   {/* <LayoutFlow /> */}
    //   <EdgeConnector />
    //   <CrossIntegrationEgde />
    //   <Typography paragraph>
    //     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    //     non enim praesent elementum facilisis leo vel. Risus at ultrices mi
    //     tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non
    //     tellus. Convallis convallis tellus id interdum velit laoreet id donec
    //     ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl
    //     suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod
    //     quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet
    //     proin fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras
    //     tincidunt lobortis feugiat vivamus at augue. At augue eget arcu dictum
    //     varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt.
    //     Lorem donec massa sapien faucibus et molestie ac.
    //   </Typography>
    //   <Typography paragraph>
    //     Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
    //     ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar elementum
    //     integer enim neque volutpat ac tincidunt. Ornare suspendisse sed nisi
    //     lacus sed viverra tellus. Purus sit amet volutpat consequat mauris.
    //     Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
    //     vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra
    //     accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac.
    //     Pellentesque nec nam aliquam sem et tortor. Habitant morbi tristique
    //     senectus et. Adipiscing elit duis tristique sollicitudin nibh sit.
    //     Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra
    //     maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
    //     aliquam ultrices sagittis orci a.
    //   </Typography>
    //   {/* <DataTable
    //     fields={fields}
    //     items={items}
    //     name="fields"
    //     onDeleteClick={(i, d) => {}}
    //     onEditClick={(i, d) => {}}
    //     onAddClick={() => {}}
    //   /> */}
    //   {/* <DataTableField name="items" fields={fields} control={control} /> */}
    // </Box>
    // </Scrollbar>
  );
};
export default Home;
