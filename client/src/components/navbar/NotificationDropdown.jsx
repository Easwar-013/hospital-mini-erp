import "./NotificationDropdown.css";

const NotificationDropdown = ({ notifications }) => {
  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h4>Notifications</h4>
        <span>{notifications.length}</span>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="empty">No Notifications</p>
        ) : (
          notifications.map((item, index) => (
            <div className="notification-item" key={index}>
              <div className="notification-icon">{item.icon}</div>

              <div className="notification-content">
                {item.title && <h5>{item.title}</h5>}

                <p>{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
