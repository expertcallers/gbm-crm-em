const isDevelopment = process.env.NODE_ENV === "development";

const PRODUCTION_SERVER = process.env.REACT_APP_PRODUCTION_SERVER;
const DEVELOPMENT_SERVER = process.env.REACT_APP_DEVELOPMENT_SERVER;

export const HOST = isDevelopment ? DEVELOPMENT_SERVER : PRODUCTION_SERVER;
export const BASE_URL = `${isDevelopment ? "http" : "https"}://${HOST}${
  isDevelopment ? "" : "/api"
}`;
export const BASE_ROUTE = "/gbm-crm";
