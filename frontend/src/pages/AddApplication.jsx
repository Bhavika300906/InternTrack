import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createApplication } from "../services/applicationService";

function AddApplication() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        company: "",
        position: "",
        location: "",
        job_type: "Internship",
        applied_date: "",
        status: "Applied",
        job_url: "",
        notes: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createApplication(formData);

            toast.success("Application added successfully!");

            navigate("/");
        } catch (err) {
            console.error(err);

            toast.error("Failed to add application.");
        }
    };

    return (
        <div className="add-application-page">
            <h1>Add Application</h1>

            <button
                type="button"
                className="back-button"
                onClick={() => navigate("/")}
            >
                ← Back to Dashboard
            </button>

            <form
                className="application-form"
                onSubmit={handleSubmit}
            >
                <div className="form-group">
                    <label>Company</label>

                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Google"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Position</label>

                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        placeholder="e.g. Frontend Developer Intern"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>

                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Ahmedabad"
                    />
                </div>

                <div className="form-group">
                    <label>Job Type</label>

                    <select
                        id="job_type"
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                    >
                        <option value="Internship">Internship</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Freelance">Freelance</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Applied Date</label>

                    <input
                        type="date"
                        name="applied_date"
                        value={formData.applied_date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Job URL</label>

                    <input
                        type="url"
                        name="job_url"
                        value={formData.job_url}
                        onChange={handleChange}
                        placeholder="https://example.com/job"
                    />
                </div>

                <div className="form-group">
                    <label>Notes</label>

                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Add any notes..."
                        rows="4"
                    />
                </div>

                <button
                    type="submit"
                    className="submit-button"
                >
                    Add Application
                </button>
            </form>
        </div>
    );
}

export default AddApplication;