import "./NotificationDropdown.css";

const NotificationDropdown = ({ notifications }) => {
  return (
    <div className="notification-dropdown">
      <h4>Notifications</h4>

      {notifications.length === 0 ? (
        <p className="empty">No Notifications</p>
      ) : (
        notifications.map((item, index) => (
          <div className="notification-item" key={index}>
            <span>{item.icon}</span>

            <p>{item.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;
