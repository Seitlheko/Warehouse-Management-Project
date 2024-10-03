const Header = ({ username, title }) => {
  return (
    <div className="header">
      <div className="header-title">{title || "Admin Dashboard"}</div>
      <div className="header-right">
        <div className="username">
          <span>{username}</span>
          <FaUser className="user-icon" />
        </div>
      </div>
    </div>
  );
};

export default Header;
