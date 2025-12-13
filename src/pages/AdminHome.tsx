import { useNavigate } from "react-router-dom";
import "../pages/layouts/Home.css";
import Header from "../comp/header";

type AdminAction = {
  title: string;
  description: string;
  route: string;
  icon: string;
};

export default function AdminHome() {
  const navigate = useNavigate();

  const actions: AdminAction[] = [
    {
      title: "Create Event",
      description: "Set up new events and define routes",
      route: "/eventCreation",
      icon: "➕",
    },
    {
      title: "Manage Events",
      description: "Edit, update, or delete existing events",
      route: "/admin_control",
      icon: "🛠️",
    },
    {
      title: "User List",
      description: "View participants and registered users",
      route: "/Datalist",
      icon: "👥",
    },
    {
      title: "GPX Files",
      description: "Review uploaded GPX route files",
      route: "/GpxFileList",
      icon: "🗺️",
    },
  ];

  return (
    <div className="homePage">
      {/* Top bar */}
      <div className="topBar">
        <div className="topBarLeft">
          <div className="brandDot brandDot--admin" />
          <div className="brandText">
            <div className="brandTitle">Waypoint Tracker</div>
            <div className="brandSub">Administrator Panel</div>
          </div>
        </div>

        <div className="topBarRight">
          <div className="statusChip ok">● Admin</div>
          <button className="ghostBtn" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>
      </div>

      <Header />

      {/* Content */}
      <main className="content">
        <div className="hero hero--admin">
          <h2>Administrator Dashboard</h2>
          <p className="subtitle">
            Create events, manage data, and oversee the entire system.
          </p>
        </div>

        <section className="grid">
          {actions.map((a) => (
            <button
              key={a.route}
              className="card"
              onClick={() => navigate(a.route)}
            >
              <div className="cardIcon">{a.icon}</div>
              <div className="cardBody">
                <div className="cardTitle">{a.title}</div>
                <div className="cardDesc">{a.description}</div>
              </div>
              <div className="cardArrow">→</div>
            </button>
          ))}
        </section>

        {/* Secondary action */}
        <div style={{ marginTop: "18px" }}>
          <button className="dangerBtn" onClick={() => navigate("/")}>
            ⟵ Back Home
          </button>
        </div>
      </main>
    </div>
  );
}
