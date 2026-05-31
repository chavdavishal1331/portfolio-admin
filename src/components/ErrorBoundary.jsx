import { Component } from "react";

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="admin-root admin-login-page">
          <div className="admin-login-card">
            <h1>Something went wrong</h1>
            <p className="subtitle">{this.state.error.message}</p>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-full"
              onClick={() => {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                window.location.href = "/#/login";
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
