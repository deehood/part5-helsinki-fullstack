const Notification = ({ notification }) => {
  if (notification)
    return (
      <div className={`Notification ${notification.type} `}>
        <p>{notification.exception}</p>
      </div>
    );

  return null;
};

export default Notification;
