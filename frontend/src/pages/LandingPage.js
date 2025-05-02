import { Link } from "react-router-dom";
import "./LandingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faRobot, faFileLines } from "@fortawesome/free-solid-svg-icons";

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">InApply</h1>
        <div className="nav-links">
          <Link to="/login" className="nav-button login">Log In</Link>
          <Link to="/register" className="nav-button signup">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h2>Find & Track Your Dream Job</h2>
        <p>Manage your job applications effortlessly with InApply.</p>
        <Link to="/register" className="cta-button">Get Started</Link>
      </header>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <FontAwesomeIcon icon={faBriefcase} className="feature-icon" />
          <h3>Track Applications</h3>
          <p>Keep all your job applications organized in one place.</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faRobot} className="feature-icon" />
          <h3>Job Matching</h3>
          <p>Get personalized job suggestions based on your resume.</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faFileLines} className="feature-icon" />
          <h3>Resume Parsing</h3>
          <p>Automatically extract job details from your resume.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How InApply Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1</h3>
            <p><strong>Sign Up</strong><br />Create an account to start tracking job applications.</p>
          </div>
          <div className="step">
            <h3>2</h3>
            <p><strong>Upload Resume</strong><br />Upload your resume for personalized job suggestions.</p>
          </div>
          <div className="step">
            <h3>3</h3>
            <p><strong>Track Applications</strong><br />Keep track of all your job applications in one place.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"InApply has been a game changer for my job search. It’s so easy to track applications."</p>
          <p><em>– Emily R.</em></p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
  <h2>Pricing Plans</h2>
  <div className="pricing-cards">
    <div className="pricing-card">
      <h4>Free</h4>
      <div className="price">$0</div>
      <ul>
        <li>✅ Up to 5 job applications</li>
        <li>✅ Basic resume tracking</li>
      </ul>
      <button>Sign Up</button>
    </div>
    <div className="pricing-card">
      <h4>Premium</h4>
      <div className="price">$9.99</div>
      <ul>
        <li>✅ Unlimited job applications</li>
        <li>✅ Advanced resume parsing</li>
      </ul>
      <button>Upgrade</button>
    </div>
  </div>
</section>

    </div>
  );
}

export default LandingPage;
