export function getApiErrorMessage(err, fallback = "Something went wrong. Try again.") {
  if (err.response?.data?.message) return err.response.data.message;
  if (typeof err.response?.data === "string" && err.response.data.trim()) {
    return err.response.data;
  }
  if (err.response?.status === 502) {
    return "Backend server unavailable. Wait 30 seconds and try again.";
  }
  if (err.response?.status === 200 && !err.response?.data) {
    return "Server returned an empty response. Redeploy admin panel or try again.";
  }
  if (err.code === "ECONNABORTED") {
    return "Server is waking up. Please wait a moment and try again.";
  }
  if (err.message === "Network Error") {
    return "Cannot connect to server. Wait 30 seconds and try again.";
  }
  return fallback;
}
