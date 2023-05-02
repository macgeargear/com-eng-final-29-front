const backendIPAddress = "44.195.103.88:3000";

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};
