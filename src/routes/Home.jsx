import HomeDetail from "../features/Home";
import CardData from "../sampleData/cardData";
import Card from "../components/molecule/card";

const Home = () => {
    return (
        <>
            <HomeDetail />

            {/* Featured Cards Section */}
            <section className="featured-home-section" style={{ backgroundColor: "var(--forest-soft)", padding: "80px 20px" }}>
                <div className="section-header">
                    <h2>Featured Timber Species</h2>
                    <p>Explore some of our premium sustainable timber varieties currently popular in building and craftsmanship.</p>
                </div>
                
                <div className="cards-container">
                    {CardData.slice(0, 3).map((item) => (
                        <Card key={item.id} item={item} />
                    ))}
                </div>
                
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <a href="/woods" className="btn-forest">
                        View All Woods
                    </a>
                </div>
            </section>
        </>
    );
};

export default Home;