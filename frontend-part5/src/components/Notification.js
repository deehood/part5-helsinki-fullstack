const Notification = ({ notification }) => {
  if (notification)
    return (
      <div className="Notification">
        <p>{notification}</p>
      </div>
    );

  return null;
};

export default Notification;
