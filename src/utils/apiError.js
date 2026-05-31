export function getApiErrorMessage(err, fallback = "Something went wrong. Try again.") {
  if (err.response?.data?.message) return err.response.data.message;
  if (typeof err.response?.data === "string") return err.response.data;
  if (err.code === "ECONNABORTED") {
    return "Server is waking up. Please wait a moment and try again.";
  }
  if (err.message === "Network Error") {
    return "Cannot connect to backend. Wait 30 seconds and try again.";
  }
  return fallback;
}
