import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="section">
      <div className="container">
        <div className="card text-center fade-in-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🚌</div>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#333', marginBottom: '1rem' }}>
            404 - Route Not Found
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
            Oops! Looks like this bus route doesn't exist. 
            <br />
            Let's get you back on track!
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/" 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Home size={20} />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;