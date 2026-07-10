import Footer from "../components/compound/Footer";
import Header from "../components/compound/Header";
import Main from "../components/compound/Main";
import Card from "../components/molecule/card";
import CardData from "../sampleData/cardData";

const HomeDetail = () => {
    return (
        <div className="home-detail">
            <h1>Welcome To WoodExchange</h1>

            <h5>"Buy. Sell. Build. The Smart Way with Quality Timber."</h5>

            <h2>Welcome to MyWoods</h2>

            <p>
                MyWoods is a trusted online marketplace for buying and selling
                high-quality wood and timber. We connect wood suppliers,
                manufacturers, retailers, and customers on a single platform,
                making the wood trading process simple, transparent, and
                efficient.
                <br /><br />
                Whether you're looking for premium hardwood, softwood,
                plywood, construction timber, or customized wood products,
                MyWoods offers a wide range of options to suit residential,
                commercial, and industrial needs. Every listing is designed to
                help buyers compare products and make informed purchasing
                decisions.
            </p>
        </div>
    );
};

export default HomeDetail;
