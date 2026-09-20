import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="landing">
      <div className="hero-icon">
        {/* Stethoscope icon */}
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 3v6.5a4.5 4.5 0 0 0 9 0V3M9 3H4.5M13.5 3H9M18 9.5v2a5.5 5.5 0 0 1-11 0v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="19.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      </div>
      <h1>Book Doctor Appointments Online</h1>
      <p>Find available doctors, book a slot instantly, and manage your appointments in one place.</p>
      {user ? (
        <Link className="cta-btn" to="/dashboard">Go to Dashboard</Link>
      ) : (
        <Link className="cta-btn" to="/signup">Get Started</Link>
      )}

      <div className="feature-row">
        <div className="feature-card">
          <div className="feature-icon">
            {/* Calendar icon */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Easy Booking</h3>
          <p>Pick a time that works for you in a few clicks.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            {/* Doctor / hospital cross icon */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Trusted Doctors</h3>
          <p>Browse verified doctors across specialties.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            {/* Pill / medicine icon */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="10.5" width="18" height="7" rx="3.5" transform="rotate(-30 12 14)" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M12 10.2l3.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Manage Anywhere</h3>
          <p>Track and cancel appointments anytime, anywhere.</p>
        </div>
      </div>
    </div>
  )
}
