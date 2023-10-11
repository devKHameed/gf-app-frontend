import { Stack } from "@mui/material";
import Pagination, { PaginationProps } from "@mui/material/Pagination";

type Props = PaginationProps;

export const BasicPagination = (props: Props) => {
  return (
    <Stack spacing={2}>
      <Pagination count={10} {...props} />
      <Pagination count={10} color="primary" {...props} />
      <Pagination count={10} color="secondary" {...props} />
      <Pagination count={10} disabled {...props} />
    </Stack>
  );
};

export default BasicPagination;
