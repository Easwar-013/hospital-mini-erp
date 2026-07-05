import "./Navbar.css";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { FaBell, FaSearch } from "react-icons/fa";

import SearchDropdown from "../search/SearchDropdown";
import { globalSearch } from "../../services/searchService";

import NotificationDropdown from "../navbar/NotificationDropdown";
import { getNotifications } from "../../services/notificationService";

const Navbar = () => {
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);

  // NEW
  const [unreadCount, setUnreadCount] = useState(0);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/patients": "Patients",
    "/doctors": "Doctors",
    "/appointments": "Appointments",
    "/wards": "Ward Management",
    "/billing": "Billing",
    "/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] || "Hospital ERP";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Search
  useEffect(() => {
    const load = async () => {
      try {
        const data = await globalSearch();
        setAllData(data);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const keyword = search.toLowerCase();

    const filtered = allData.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.subtitle.toLowerCase().includes(keyword),
    );

    setResults(filtered);
  }, [search, allData]);

  // Notifications
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();

        setNotifications(data || []);

        // Badge Count
        setUnreadCount(data?.length || 0);
      } catch (err) {
        console.log(err);
      }
    };

    load();
  }, []);

  const handleNotificationClick = () => {
    setOpenNotifications(!openNotifications);

    // Hide badge after opening
    if (!openNotifications) {
      setUnreadCount(0);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>{pageTitle}</h2>
        <span>{today}</span>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search patients, doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <SearchDropdown
              results={results}
              onClose={() => {
                setSearch("");
                setResults([]);
              }}
            />
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div style={{ position: "relative" }}>
          <button
            className="notification-btn"
            onClick={handleNotificationClick}
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>

          {openNotifications && (
            <NotificationDropdown notifications={notifications} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
