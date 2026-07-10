

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo">
          <h2>Mywoods</h2>
          <p>
            Creating modern, responsive, and user-friendly web experiences.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/Woods">Woods</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: phaltukam1@gmail.com</p>
          <p>Phone: +91 9555943003</p>
          <p>India</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyWebsite. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;