

export default function AboutDeatil() {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-image">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.z2enAVvjsQVmIBuVkAeFVAHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Timber Yard"
          />
        </div>

        <div className="about-content">
          <span className="about-tag">About MyWoods</span>

          <h1>Sourcing Premium Sustainable Timber</h1>

          <p>
            At MyWoods, we connect developers, architects, and woodcraft artisans with 
            verified regional timber suppliers. Our platform bridges the gap in the timber supply 
            chain, ensuring transparency in quality grades, wood origin, density specifications, 
            and ethical forest harvesting practices.
          </p>

          <div className="about-stats">
            <div className="stat">
              <h2>10+</h2>
              <p>Wood Yards</p>
            </div>

            <div className="stat">
              <h2>400</h2>
              <p>Clients Served</p>
            </div>

            <div className="stat">
              <h2>2+</h2>
              <p>Years Experience</p>
            </div>
          </div>

          <a href="/woods" className="btn-forest">Browse Catalog</a>
        </div>
      </div>
    </section>
  );
}