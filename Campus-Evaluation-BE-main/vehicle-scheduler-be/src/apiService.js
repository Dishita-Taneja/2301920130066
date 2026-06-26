const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service";

function getAuthHeaders() {
  const token = process.env.ACCESS_TOKEN;
  if (!token) throw new Error("ACCESS_TOKEN is not set in environment variables");
  return { Authorization: `Bearer ${token}` };
}

async function fetchDepots() {
  const response = await axios.get(`${BASE_URL}/depots`, {
    headers: getAuthHeaders(),
  });
  return response.data.depots; // Array of { ID, MechanicHours }
}

async function fetchVehicles() {
  const response = await axios.get(`${BASE_URL}/vehicles`, {
    headers: getAuthHeaders(),
  });
  return response.data.vehicles; // Array of { TaskID, Duration, Impact }
}

module.exports = { fetchDepots, fetchVehicles };
