import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    email: '',
    website: '',
    taskDescription: '',
    timeline: '',
    budget: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Update API_URL to match your Flask server
      // For development: 'http://localhost:5000'
      // For production: your deployed API URL
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({
          companyName: '',
          role: '',
          email: '',
          website: '',
          taskDescription: '',
          timeline: '',
          budget: ''
        });
      } else {
        setSubmitStatus('error');
        console.error('Form submission error:', result.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">Sprinttern</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-card">
            <div className="hero-content-wrapper">
              <h1 className="hero-headline">
                Get small business tasks done quickly - without hiring or long-term commitment
              </h1>
              <p className="hero-clarifying-line">
                Short, fixed-scope tasks completed by vetted university students.
              </p>
              <p className="hero-subheadline">
                We're onboarding a small number of businesses to ensure quality during our limited pilot programme.
              </p>
              <a href="#waitlist-form" className="cta-button primary">
                Request pilot access
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="divider-svg">
          <path d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z" fill="var(--bg-alt)"/>
        </svg>
      </div>

      {/* What This Is */}
      <section className="what-this-is">
        <div className="container">
          <h2 className="section-title">What This Is</h2>
          <div className="bullet-list">
            <div className="bullet-item card">
              <div className="bullet-icon-wrapper">
                <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bullet-content">
                <h3>Short, fixed-scope tasks</h3>
                <p>Clear deliverables with defined boundaries</p>
              </div>
            </div>
            <div className="bullet-item card">
              <div className="bullet-icon-wrapper">
                <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bullet-content">
                <h3>Fixed price, low risk</h3>
                <p>Know the cost upfront, no surprises</p>
              </div>
            </div>
            <div className="bullet-item card">
              <div className="bullet-icon-wrapper">
                <svg className="bullet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="bullet-content">
                <h3>Personally managed pilot</h3>
                <p>Direct oversight to ensure quality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider section-divider-reverse">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="divider-svg">
          <path d="M0,60 Q300,100 600,60 T1200,60 L1200,0 L0,0 Z" fill="var(--white)"/>
        </svg>
      </div>

      {/* Why This Model Works */}
      <section className="why-model-works">
        <div className="container">
          <h2 className="section-title">Why this model works</h2>
          <div className="model-content">
            <div className="model-intro">
              <p className="model-text">
                This approach works because students are motivated differently. They care about doing a good job, value feedback, and take small, well-scoped tasks seriously. They're building real experience, not chasing volume.
              </p>
            </div>
            
            <div className="model-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p>Students care about doing a good job</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p>They value feedback</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 9h18M9 21V9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p>They take small, well-scoped tasks seriously</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p>They are building real experience, not chasing volume</p>
              </div>
            </div>

            <div className="model-human-note">
              <p className="human-text">
                For some students, this is their first real piece of paid work. Students build real deliverables they can put on their CV.
              </p>
            </div>

            <div className="model-reassurance">
              <div className="reassurance-content">
                <p className="reassurance-text">
                  <strong>Every task is low-risk:</strong> Students complete a readiness task before working on anything paid. All tasks are fixed-scope and reviewed. You're paying for output, not sponsoring anyone.
                </p>
              </div>
            </div>

            <div className="model-payoff">
              <p className="payoff-text">
                For many businesses, this is also a way to support someone at the start of their career - without hiring risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="divider-svg">
          <path d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z" fill="var(--bg-alt)"/>
        </svg>
      </div>

      {/* Example Tasks */}
      <section className="example-tasks">
        <div className="container">
          <h2 className="section-title">Example Tasks</h2>
          <div className="tasks-grid">
            <div className="task-card">
              <div className="task-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9h18M9 21V9" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Create a simple landing page</h3>
              <p>Professional one-page website for your service or product</p>
            </div>
            <div className="task-card">
              <div className="task-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Draft 5–10 social media posts</h3>
              <p>Ready-to-use content for your social channels</p>
            </div>
            <div className="task-card">
              <div className="task-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Clean and organise sales data</h3>
              <p>Structured spreadsheet with clear categories and formatting</p>
            </div>
            <div className="task-card">
              <div className="task-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Research competitors or suppliers</h3>
              <p>Summary document with key findings and recommendations</p>
            </div>
            <div className="task-card">
              <div className="task-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Create email templates</h3>
              <p>Professional templates for common customer communications</p>
            </div>
            <div className="task-card">
              <div className="task-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Organise customer feedback</h3>
              <p>Compile and categorise feedback into actionable insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="divider-svg">
          <path d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z" fill="var(--bg-alt)"/>
        </svg>
      </div>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Describe the task you need help with</h3>
              <p>Tell us exactly what you need completed</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>We match you with a vetted student</h3>
              <p>Hand-selected based on your specific requirements</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>You receive the completed work and only pay for the task</h3>
              <p>Fixed price, no ongoing commitments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider section-divider-reverse">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="divider-svg">
          <path d="M0,60 Q300,100 600,60 T1200,60 L1200,0 L0,0 Z" fill="var(--white)"/>
        </svg>
      </div>

      {/* Trust & Risk Reduction */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Limited pilot</h3>
              <p>Max 10 businesses</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No long-term commitment</h3>
              <p>Pay per task only</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Fixed scope and pricing</h3>
              <p>Clear upfront costs</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Manual oversight</h3>
              <p>Quality assured</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="divider-svg">
          <path d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z" fill="var(--bg-alt)"/>
        </svg>
      </div>

      {/* Waitlist Form */}
      <section id="waitlist-form" className="waitlist-form">
        <div className="container">
          <div className="form-header">
            <h2 className="section-title">Request Pilot Access</h2>
            <p className="form-helper">Takes ~2 minutes</p>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="taskDescription">
                Describe one specific task you'd like help with in the next 30 days
              </label>
              <textarea
                id="taskDescription"
                name="taskDescription"
                value={formData.taskDescription}
                onChange={handleChange}
                rows="5"
                required
                placeholder="e.g., Create a simple landing page for our new service, including contact form and basic SEO setup..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Your role</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website or LinkedIn</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="timeline">
                  Timeline
                  <span className="info-tooltip">
                    <span className="info-icon">i</span>
                    <span className="info-text">When would you like to be matched with a student by?</span>
                  </span>
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select timeline</option>
                  <option value="this-week">This week</option>
                  <option value="this-month">This month</option>
                  <option value="later">Later</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="budget">Budget range</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select budget</option>
                  <option value="50-75">£50–£75</option>
                  <option value="75-150">£75–£150</option>
                  <option value="150+">£150+</option>
                </select>
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="form-success">
                Thank you for your request. We'll be in touch shortly.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="form-error">
                There was an error submitting your form. Please try again or contact us directly.
              </div>
            )}

            <button
              type="submit"
              className="cta-button primary submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Request pilot access'}
            </button>
          </form>
          
          <div className="founder-credibility">
            <p className="credibility-text">
              Built by a founder who's worked inside high-growth UK tech teams (Monzo, incident.io).
            </p>
            <p className="credibility-text">
              The goal is simple: get real work done for businesses, and real experience for students.
            </p>
            <a href="https://www.linkedin.com/in/anthony-oparaocha-287633271/" target="_blank" rel="noopener noreferrer" className="credibility-link">
              View founder profile →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">Sprinttern</div>
            <p>Limited pilot programme for UK small businesses (1–20 employees)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

