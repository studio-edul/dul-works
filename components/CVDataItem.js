export default function CVDataItem({ item }) {
  const { period, name, client, place } = item;

  return (
    <div className="cv-data-item">
      <div className="cv-data-period">{period || ''}</div>
      <div className="cv-data-name-client">
        <span className="cv-data-name">{name || ''}</span>
        {client && (
          <>
            <span className="cv-data-separator">{`\u00A0\u00A0|\u00A0\u00A0`}</span>
            <span className="cv-data-client">{client}</span>
          </>
        )}
      </div>
      <div className="cv-data-place">
        {place || ''}
        {place && item.role && `\u00A0\u00A0|\u00A0\u00A0`}
        {item.role || ''}
      </div>
    </div>
  );
}

