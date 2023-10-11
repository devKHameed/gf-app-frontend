import { AxiosRequestConfig } from "axios";
import request, { API_POOL } from "utils/request";

export const upload = async (
  fileData: {
    file: File;
    filename?: string;
    pathPrefix?: string;
  },
  config?: AxiosRequestConfig
) => {
  const { file, filename, pathPrefix } = fileData;
  const name = filename || file.name;
  const type = file.type;

  const { data } = await getPresignedUrl(name, type, pathPrefix);

  return await request("", {
    baseURL: data.url,
    method: "PUT",
    data: file,
    attachToken: false,
    headers: {
      "Content-Type": type,
    },
    ...config,
  });
};

export const getPresignedUrl = async (
  filename: string,
  filetype: string,
  pathPrefix?: string
) => {
  const res = await request("/initial-upload", {
    method: "POST",
    baseURL: API_POOL["public-1"],
    data: {
      content_type: filetype,
      content_path: filename,
      folder_name: pathPrefix,
    },
  });

  return res.data as ApiResponse<{
    content_type: string;
    content_path: string;
    url: string;
  }>;
};
