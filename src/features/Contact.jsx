

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! Our timber experts will contact you shortly.");
  };

  return (
    <section className="contact">
      <div className="contact-container">

        <div className="contact-info">
          <h2>Get in Touch</h2>

          <p>
            Have questions about timber grading, custom orders, or shipping logistics? 
            Reach out to our experts and we'll help you source the perfect wood.
          </p>

          <div className="info-box">
            <h4>📍 Headquarters</h4>
            <p>12, Barakhamba Road, Connaught Place, New Delhi, India</p>
          </div>

          <div className="info-box">
            <h4>📧 Email</h4>
            <p>support@mywoods.website</p>
          </div>

          <div className="info-box">
            <h4>📞 Phone</h4>
            <p>+91 95559 43003</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send Message</h2>

          <input type="text" placeholder="Your Name" required />

          <input type="email" placeholder="Your Email" required />

          <input type="text" placeholder="Subject" required />

          <textarea
            rows="6"
            placeholder="Tell us about your timber requirements..."
            required
          ></textarea>

          <button type="submit">Send Inquiry</button>
        </form>

      </div>
    </section>
  );
}