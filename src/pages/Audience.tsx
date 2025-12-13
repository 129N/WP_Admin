import { useNavigate } from "react-router-dom";
import "../pages/layouts/Home.css";
import Header from "../comp/header";

type AudienceAction = {
  title: string;
  description: string;
  route: string;
  icon: string;
};

export default function AudiencePage() {
  const navigate = useNavigate();

  const actions: AudienceAction[] = [
    {
      title: "Watch Competition",
      description: "View live competition progress and tracking",
      route: "/admin_control",
      icon: "👀",
    },
    {
      title: "View History",
      description: "Browse completed events and results",
      route: "/",
      icon: "📜",
    },
  ];

  return (
    <div className="homePage page--audience">
      {/* Top bar */}
      <div className="topBar">
        <div className="topBarLeft">
          <div className="brandDot brandDot--audience" />
          <div className="brandText">
            <div className="brandTitle">Waypoint Tracker</div>
            <div className="brandSub">Audience View</div>
          </div>
        </div>

        <div className="topBarRight">
          <div className="statusChip ok">● Viewer</div>
          <button className="ghostBtn" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </div>

      <Header />

      {/* Content */}
      <main className="content">
        <div className="hero hero--audience">
          <h2>Audience Dashboard</h2>
          <p className="subtitle">
            Watch live competitions and explore event history.
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
