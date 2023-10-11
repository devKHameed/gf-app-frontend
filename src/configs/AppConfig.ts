export const APP_NAME = "GF";
export const APP_PREFIX_PATH = "/:accountSlug";
export const AUTH_PREFIX_PATH = "/auth";

export const CognitoConfig = {
  REGION: process.env.REACT_APP_AWS_REGION,
  USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
  APP_CLIENT_ID: process.env.REACT_APP_APP_CLIENT_ID,
};

export const systemAdminRole = "systemdev";

export const S3_CLOUD_FRONT_URL = process.env.REACT_APP_S3_CLOUD_FRONT_URL;
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
export const STRIPE_KEY =
  "pk_test_51LwYZtBpvm0C4vU7qfSvU4V55U5qwut3Vtp1IXPIYvzzylFnJZhpb0LxGaFvVx43R2e9trKl7zcPAQXAYlXq9zdc00jlzZuERG";
export const SOCIAL_MEDIA_ACCOUNTS_TYPE = "accounts";
export const CHAT_WIDGET_PREVIEW_URL =
  process.env.REACT_APP_CHAT_WIDGET_PREVIEW_URL;
export const CHAT_SCRIPT_URL = process.env.REACT_APP_CHAT_SCRIPT_URL;

export const GITHUB_API_URL = process.env.REACT_APP_GITHUB_API_URL;
export const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
