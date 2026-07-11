

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo">
          <h2>Mywoods</h2>
          <p>
            Your premium online marketplace for buying and selling high-quality timber and custom wood products.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/woods">Woods</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: info@mywoods.website</p>
          <p>Phone: +91 95559 43003</p>
          <p>New Delhi, India</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyWoods. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;