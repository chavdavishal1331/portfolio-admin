function SaveAlert({ message, onClose }) {
  if (!message?.text) return null;

  return (
    <div className={`admin-alert admin-alert-${message.type}`}>
      <span>{message.text}</span>
      {message.viewLink && (
        <>
          {" "}
          <a
            href={message.viewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-alert-link"
          >
            View on portfolio (then Refresh if needed) →
          </a>
        </>
      )}
      {onClose && (
        <button
          type="button"
          className="admin-alert-close"
          onClick={onClose}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SaveAlert;
