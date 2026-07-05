import "./Navbar.css";

const Navbar = () => {
  // Grab the user safely from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // Use fullName (for patients) or name (for admins), fallback to "Patient" if neither exists
  // Checks for all 3 possible ways your app might be saving the name!
  const displayName = user?.fullName || user?.name || "Patient";

  return (
    <header className="user-navbar">
      <div>
        <h2>User Portal</h2>
      </div>

      <div className="user-info">Welcome, {displayName}</div>
    </header>
  );
};;

export default Navbar;
