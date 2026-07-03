import "./Navbar.css";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="user-navbar">
      <div>
        <h2>Patient Portal</h2>
      </div>

      <div className="user-info">Welcome, {user?.name}</div>
    </header>
  );
};

export default Navbar;
