export default function Home() {
  return (
    <>
      {/* NAVBAR */}
      <div className="navbar-wrapper">
        <header className="navbar">
          <img
            src="/images/aiesec logo.PNG"
            alt="AIESEC logo"
            className="logo"
          />

          <nav className="nav-right">
            <a className="nav-link" href="#home">
              Home
            </a>
            <a className="nav-link" href="#partners">
              Partners
            </a>
            <a className="nav-btn" href="/signup">
              Sign up
            </a>
          </nav>
        </header>
      </div>

      {/* PAGE CONTENT */}
      <div className="page">
        {/* HERO TEXT */}
        <h1 className="hero-title">
          <span className="c1">Ready to</span>{" "}
          <span className="c2">make a</span>{" "}
          <span className="c3">difference</span>
        </h1>
        <p className="hero-subtitle">Explore our opportunities abroad !</p>

        {/* PROGRAM CARDS */}
        <section className="programs">
          <div className="program-card volunteer">
            <img
              src="/images/global volunteer.jpeg"
              className="program-image"
              alt="Global Volunteer"
            />
            <div className="program-overlay"></div>
            <div className="program-label">Global Volunteer</div>
          </div>

          <div className="program-card teacher">
            <img
              src="/images/global teacher.jpeg"
              className="program-image"
              alt="Global Teacher"
            />
            <div className="program-overlay"></div>
            <div className="program-label">Global Teacher</div>
          </div>

          <div className="program-card talent">
            <img
              src="/images/global talent.jpeg"
              className="program-image"
              alt="Global Talent"
            />
            <div className="program-overlay"></div>
            <div className="program-label">Global Talent</div>
          </div>
        </section>
      </div>
    </>
  );
}
