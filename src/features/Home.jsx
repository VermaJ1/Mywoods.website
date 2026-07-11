import { TreePine, ShieldCheck, Truck, Coins, ArrowRight } from "lucide-react";

const HomeDetail = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-content">
          <h5>Buy. Sell. Build.</h5>
          <h1>Welcome to MyWoods</h1>
          <p>
            The premium online marketplace connecting timber suppliers, builders, and artisans. 
            Discover high-quality hardwood, softwood, and engineered wood tailored for any residential 
            or industrial project.
          </p>
          <div className="hero-buttons">
            <a href="/woods" className="btn-amber">
              Browse Timber <ArrowRight size={16} />
            </a>
            <a href="/about" className="btn-outline" style={{ color: "#ffffff", borderColor: "#ffffff" }}>
              Our Story
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="home-stats-bar">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>50+</h3>
            <p>Timber Species</p>
          </div>
          <div className="stat-item">
            <h3>1k</h3>
            <p>Trusted Suppliers</p>
          </div>
          <div className="stat-item">
            <h3>10+</h3>
            <p>Delivered Orders</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Certified Forestry</p>
          </div>
        </div>
      </section>

      {/* Reassurance Grid */}
      <section className="featured-home-section">
        <div className="section-header">
          <h2>Why Choose MyWoods?</h2>
          <p>We provide a transparent, secure, and highly efficient marketplace for wood commerce.</p>
        </div>

        <div className="about-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", marginBottom: "0" }}>
          <div className="stat" style={{ textAlign: "left", padding: "30px" }}>
            <div style={{ color: "var(--forest-light)", marginBottom: "15px" }}><TreePine size={32} /></div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", fontFamily: "var(--font-sans)", fontWeight: "600" }}>Premium Quality</h3>
            <p style={{ margin: "0" }}>Hand-selected hardwood and softwood species from certified sustainable forests.</p>
          </div>
          <div className="stat" style={{ textAlign: "left", padding: "30px" }}>
            <div style={{ color: "var(--forest-light)", marginBottom: "15px" }}><ShieldCheck size={32} /></div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", fontFamily: "var(--font-sans)", fontWeight: "600" }}>Verified Listings</h3>
            <p style={{ margin: "0" }}>Full transparency on origin, density, and color details for every listing.</p>
          </div>
          <div className="stat" style={{ textAlign: "left", padding: "30px" }}>
            <div style={{ color: "var(--forest-light)", marginBottom: "15px" }}><Truck size={32} /></div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px", fontFamily: "var(--font-sans)", fontWeight: "600" }}>Reliable Logistics</h3>
            <p style={{ margin: "0" }}>Seamless delivery options and local pickup arrangements directly from suppliers.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeDetail;
