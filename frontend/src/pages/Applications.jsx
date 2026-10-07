import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ApplicationCard from "../components/ApplicationCard";

import {
  getApplications,
  deleteApplication,
} from "../services/applicationService";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // -----------------------------
  // Delete Application
  // -----------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteApplication(id);

      setApplications((currentApplications) =>
        currentApplications.filter((application) => application.id !== id),
      );

      toast.success("Application deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete application.");
    }
  };

  // -----------------------------
  // Search and Filters
  // -----------------------------

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase().trim();

    const company = application.company?.toLowerCase() || "";

    const position = application.position?.toLowerCase() || "";

    const matchesSearch = company.includes(search) || position.includes(search);

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    const matchesJobType =
      jobTypeFilter === "All" || application.job_type === jobTypeFilter;

    return matchesSearch && matchesStatus && matchesJobType;
  });

  // -----------------------------
  // Clear Filters
  // -----------------------------

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setJobTypeFilter("All");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="applications-page">
          {/* Header */}

          <div className="applications-header">
            <div>
              <h1>Applications</h1>

              <p>Manage and track all your job applications.</p>
            </div>

            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/")}
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Search and Filters */}

          <div className="application-filters">
            <input
              type="text"
              placeholder="Search company or position..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="application-search"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="application-filter-select"
            >
              <option value="All">All Statuses</option>

              <option value="Applied">Applied</option>

              <option value="Interview">Interview</option>

              <option value="Offer">Offer</option>

              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={jobTypeFilter}
              onChange={(event) => setJobTypeFilter(event.target.value)}
              className="application-filter-select"
            >
              <option value="All">All Job Types</option>

              <option value="Internship">Internship</option>

              <option value="Full Time">Full Time</option>

              <option value="Part Time">Part Time</option>

              <option value="Freelance">Freelance</option>
            </select>

            <button
              type="button"
              className="clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>

          {/* Applications */}

          <section className="applications-list">
            {loading && (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading applications...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && applications.length === 0 && (
              <p className="empty-message">No applications found.</p>
            )}

            {!loading &&
              !error &&
              applications.length > 0 &&
              filteredApplications.length === 0 && (
                <p className="empty-message">
                  No applications match your search or filters.
                </p>
              )}

            {!loading &&
              !error &&
              filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onDelete={handleDelete}
                  showActions={true}
                />
              ))}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Applications;
