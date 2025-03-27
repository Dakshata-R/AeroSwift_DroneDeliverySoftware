import { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'General Inquiry'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        message: '',
        subject: 'General Inquiry'
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact <span className={styles.highlight}>AeroSwift</span></h1>
        <p className={styles.subtitle}>Have questions? Our team is ready to help you with any inquiries about our drone delivery service.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.contactInfo}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>✉️</div>
            <h3>Email Us</h3>
            <p>support@aeroswift.com</p>
            <p>business@aeroswift.com</p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📱</div>
            <h3>Call Us</h3>
            <p>Customer Support: +1 (555) 123-4567</p>
            <p>Business Inquiries: +1 (555) 765-4321</p>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>📍</div>
            <h3>Visit Us</h3>
            <p>AeroSwift Headquarters</p>
            <p>123 Skyway Blvd, Suite 500</p>
            <p>San Francisco, CA 94107</p>
          </div>
        </div>

        <div className={styles.contactForm}>
          <h2 className={styles.formTitle}>Send us a message</h2>
          
          {submitStatus === 'success' && (
            <div className={styles.successMessage}>
              🚀 Thanks for contacting us! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Delivery Issue">Delivery Issue</option>
                <option value="Business Partnership">Business Partnership</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <span className={styles.buttonIcon}>✈️</span>
            </button>
          </form>
        </div>
      </div>

      <div className={styles.socialSection}>
        <h2>Connect With Us</h2>
        <div className={styles.socialLinks}>
          <a href="#" className={styles.socialLink} aria-label="Twitter">
            <span>🐦</span> Twitter
          </a>
          <a href="#" className={styles.socialLink} aria-label="Facebook">
            <span>👍</span> Facebook
          </a>
          <a href="#" className={styles.socialLink} aria-label="Instagram">
            <span>📷</span> Instagram
          </a>
          <a href="#" className={styles.socialLink} aria-label="LinkedIn">
            <span>💼</span> LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;