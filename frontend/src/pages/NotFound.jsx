import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <div className="not-found-code">404</div>

                <h1>Page Not Found</h1>

                <p>
                    Sorry, the page you are looking for doesn't exist or
                    the URL may be incorrect.
                </p>

                <div className="not-found-actions">
                    <button
                        type="button"
                        className="not-found-primary"
                        onClick={() => navigate("/")}
                    >
                        Go to Dashboard
                    </button>

                    <button
                        type="button"
                        className="not-found-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;