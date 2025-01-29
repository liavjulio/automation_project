import axios from "axios";

const BACKENDS = {
  python: "http://127.0.0.1:5002", // Python server
  node: "http://localhost:3000",  // Node.js backup server
};

// Axios instances for both servers
const pythonApi = axios.create({ baseURL: BACKENDS.python });
const nodeApi = axios.create({ baseURL: BACKENDS.node });

// Wrapper function with fallback logic
export const request = async (method, endpoint, data = null) => {
  const isFallbackEndpoint = ["/clear-list", "/count-items"].includes(endpoint);
  try {
    // Attempt request to Python server
    const response = await pythonApi.request({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error) {
    console.error(`Python server failed for ${method.toUpperCase()} ${endpoint}:`, error.message);

    // Fallback to Node.js server for specific endpoints
    if (isFallbackEndpoint) {
      try {
        const fallbackResponse = await nodeApi.request({
          method,
          url: endpoint,
          data,
        });
        console.warn(`Fallback to Node.js server for ${method.toUpperCase()} ${endpoint}`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error(`Node.js server also failed for ${method.toUpperCase()} ${endpoint}:`, fallbackError.message);
        throw fallbackError;
      }
    }

    // Throw the original error if no fallback is configured
    throw error;
  }
};