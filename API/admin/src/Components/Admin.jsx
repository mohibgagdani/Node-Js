import React from "react";

const Admin = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="admin-container">
      <h1>Welcome Admin!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Admin;
