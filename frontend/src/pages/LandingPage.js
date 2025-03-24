import { Link } from "react-router-dom";
import "./LandingPage.css"; // Import the CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1 className="logo">InApply</h1>
        <div className="nav-links">
          <Link to="/login" className="nav-button">
            <FontAwesomeIcon icon={faSignIn} className="icon" />
            Login
          </Link>
          <Link to="/register" className="nav-button signup">
            <FontAwesomeIcon icon={faUserPlus} className="icon" />
            Sign Up
          </Link>
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
          <h3><i className="fa-solid fa-file"></i> Track Applications</h3>
          <p>Keep all your job applications organized in one place.</p>
        </div>
        <div className="feature">
          <h3><i className="fa-solid fa-robot"></i> AI Job Matching</h3>
          <p>Get personalized job suggestions based on your resume.</p>
        </div>
        <div className="feature">
          <h3><i className="fa-solid fa-file-invoice"></i> Smart Resume Parsing</h3>
          <p>Automatically extract key details from your resume.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How InApply Works</h2>
        <div className="step">
          <h3>Step 1: Sign Up</h3>
          <p>Create an account to start managing your job applications.</p>
        </div>
        <div className="step">
          <h3>Step 2: Upload Your Resume</h3>
          <p>Upload your resume to get personalized job suggestions.</p>
        </div>
        <div className="step">
          <h3>Step 3: Track Applications</h3>
          <p>Keep track of all your job applications in one place.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial">
          <p>"InApply has been a game-changer for my job search. It's so easy to track applications!"</p>
          <p>— Emily R.</p>
        </div>
        <div className="testimonial">
          <p>"The AI job matching feature is incredibly helpful. I found my dream job through InApply!"</p>
          <p>— David K.</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <h2>Pricing Plans</h2>
        <div className="plan">
          <h3>Free</h3>
          <p>Track up to 5 job applications</p>
          <p>Basic resume parsing</p>
          <Link to="/register" className="plan-button">Sign Up</Link>
        </div>
        <div className="plan premium">
          <h3>Premium</h3>
          <p>Track unlimited job applications</p>
          <p>Advanced resume parsing</p>
          <p>AI job matching</p>
          <Link to="/register" className="plan-button">Upgrade</Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>2025 InApply. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
