import Card from "../components/molecule/card";
import CardData from "../sampleData/cardData";

const WoodsPage = () => {
  return (
    <section className="featured-home-section" style={{ padding: "60px 20px" }}>
      <div className="section-header" style={{ marginBottom: "40px" }}>
        <h2>Timber Catalog</h2>
        <p>Premium responsibly-sourced lumber, veneer, and engineered boards for design and construction projects.</p>
      </div>

      <div className="cardsClass">
        {CardData.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default WoodsPage;