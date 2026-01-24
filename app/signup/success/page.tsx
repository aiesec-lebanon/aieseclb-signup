"use client";
import './page.css';

export default function SignupSuccessPage() {
  return (
    <div className="success-container">
        <div className="success-card">
            <div className="success-icon">✓</div>

            <h1>Signup Successful</h1>

            <p>Thank you for signing up with <strong>AIESEC</strong>.</p>

            <p>
            Your account has been created successfully. You can now log in using the
            credentials you just created.
            </p>

            <p>
            Visit <strong>aiesec.org</strong> to explore and apply for exchange
            opportunities worldwide.
            </p>

            <a href="https://aiesec.org" target="_blank">
            Go to aiesec.org
            </a>

            <small>
            You will need to log in using the email and password you registered with.
            </small>
        </div>
    </div>

  );
}
