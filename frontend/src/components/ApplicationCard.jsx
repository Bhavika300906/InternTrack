import { useNavigate } from "react-router-dom";

function ApplicationCard({ application, onDelete, showActions = false }) {
    const navigate = useNavigate();

    return (
        <div className="application-card">
            <div className="application-card-header">
                <div>
                    <h3>{application.company}</h3>
                    <p>{application.position}</p>
                </div>

                <span className="status">
                    {application.status}
                </span>
            </div>

            <div className="application-details">
                <p>
                    <strong>Location:</strong>{" "}
                    {application.location}
                </p>

                <p>
                    <strong>Job Type:</strong>{" "}
                    {application.job_type}
                </p>

                <p>
                    <strong>Applied:</strong>{" "}
                    {application.applied_date}
                </p>
            </div>

            {showActions && (
                <div className="application-actions">
                    <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                            navigate(
                                `/edit-application/${application.id}`
                            )
                        }
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="delete-button"
                        onClick={() => onDelete(application.id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default ApplicationCard;