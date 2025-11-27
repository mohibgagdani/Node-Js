import { Bus, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Bus size={32} />
              <span>BusBooking</span>
            </div>
            <p>Your trusted partner for comfortable and safe bus travel across the country.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/register">Register</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <Mail size={16} />
              <span>mohib.gagdani1@gmail.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+91123456789</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 BusBooking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;