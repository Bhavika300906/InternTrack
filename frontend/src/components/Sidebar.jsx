import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-title">
                InternTrack
            </div>

            <nav className="sidebar-menu">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/applications"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Applications
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;