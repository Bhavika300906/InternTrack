import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ApplicationCard from "../components/ApplicationCard";

import { getApplications } from "../services/applicationService";

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    // =========================
    // APPLICATION STATISTICS
    // =========================

    const totalApplications = applications.length;

    const applied = applications.filter(
        (application) => application.status === "Applied"
    ).length;

    const interviews = applications.filter(
        (application) => application.status === "Interview"
    ).length;

    const offers = applications.filter(
        (application) => application.status === "Offer"
    ).length;

    const rejected = applications.filter(
        (application) => application.status === "Rejected"
    ).length;

    // Applications that received a response
    const responses = interviews + offers + rejected;

    const responseRate =
        totalApplications > 0
            ? Math.round((responses / totalApplications) * 100)
            : 0;

    // Latest 5 applications
    const recentApplications = [...applications]
        .sort(
            (a, b) =>
                new Date(b.applied_date) -
                new Date(a.applied_date)
        )
        .slice(0, 5);

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Navbar />

                <main className="dashboard">
                    <div className="dashboard-header">
                        <div>
                            <h1>Dashboard</h1>

                            <p>
                                Track your job applications and monitor your
                                progress.
                            </p>
                        </div>
                    </div>

                    {loading && (
                        <p className="dashboard-message">
                            Loading dashboard...
                        </p>
                    )}

                    {error && (
                        <p className="dashboard-error">
                            {error}
                        </p>
                    )}

                    {!loading && !error && (
                        <>
                            {/* =========================
                                STATISTICS
                            ========================= */}

                            <div className="stats">
                                <div className="stat-card">
                                    <span className="stat-label">
                                        Total Applications
                                    </span>

                                    <strong className="stat-value">
                                        {totalApplications}
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span className="stat-label">
                                        Applied
                                    </span>

                                    <strong className="stat-value">
                                        {applied}
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span className="stat-label">
                                        Interviews
                                    </span>

                                    <strong className="stat-value">
                                        {interviews}
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span className="stat-label">
                                        Offers
                                    </span>

                                    <strong className="stat-value">
                                        {offers}
                                    </strong>
                                </div>
                            </div>

                            {/* =========================
                                SECONDARY STATISTICS
                            ========================= */}

                            <div className="dashboard-secondary-stats">
                                <div className="secondary-stat-card">
                                    <span>
                                        Rejected
                                    </span>

                                    <strong>
                                        {rejected}
                                    </strong>
                                </div>

                                <div className="secondary-stat-card">
                                    <span>
                                        Response Rate
                                    </span>

                                    <strong>
                                        {responseRate}%
                                    </strong>
                                </div>
                            </div>

                            {/* =========================
                                DASHBOARD CONTENT
                            ========================= */}

                            <div className="dashboard-grid">

                                {/* STATUS OVERVIEW */}

                                <section className="dashboard-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h2>
                                                Application Status
                                            </h2>

                                            <p>
                                                Overview of your application
                                                pipeline.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="status-overview">

                                        <div className="status-row">
                                            <span>
                                                Applied
                                            </span>

                                            <strong>
                                                {applied}
                                            </strong>
                                        </div>

                                        <div className="status-bar">
                                            <div
                                                className="status-progress applied-progress"
                                                style={{
                                                    width: `${
                                                        totalApplications
                                                            ? (applied /
                                                                  totalApplications) *
                                                              100
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>

                                        <div className="status-row">
                                            <span>
                                                Interview
                                            </span>

                                            <strong>
                                                {interviews}
                                            </strong>
                                        </div>

                                        <div className="status-bar">
                                            <div
                                                className="status-progress interview-progress"
                                                style={{
                                                    width: `${
                                                        totalApplications
                                                            ? (interviews /
                                                                  totalApplications) *
                                                              100
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>

                                        <div className="status-row">
                                            <span>
                                                Offer
                                            </span>

                                            <strong>
                                                {offers}
                                            </strong>
                                        </div>

                                        <div className="status-bar">
                                            <div
                                                className="status-progress offer-progress"
                                                style={{
                                                    width: `${
                                                        totalApplications
                                                            ? (offers /
                                                                  totalApplications) *
                                                              100
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>

                                        <div className="status-row">
                                            <span>
                                                Rejected
                                            </span>

                                            <strong>
                                                {rejected}
                                            </strong>
                                        </div>

                                        <div className="status-bar">
                                            <div
                                                className="status-progress rejected-progress"
                                                style={{
                                                    width: `${
                                                        totalApplications
                                                            ? (rejected /
                                                                  totalApplications) *
                                                              100
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* RECENT APPLICATIONS */}

                                <section className="dashboard-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h2>
                                                Recent Applications
                                            </h2>

                                            <p>
                                                Your latest job applications.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="recent-applications">
                                        {recentApplications.length === 0 ? (
                                            <p className="empty-message">
                                                No applications yet.
                                            </p>
                                        ) : (
                                            recentApplications.map(
                                                (application) => (
                                                    <ApplicationCard
                                                        key={
                                                            application.id
                                                        }
                                                        application={
                                                            application
                                                        }
                                                    />
                                                )
                                            )
                                        )}
                                    </div>
                                </section>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;