import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './TrackOrder.css';
import { useNavigate } from 'react-router-dom';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom green dot icon for the drone
const GreenDotIcon = L.divIcon({
  className: 'green-dot-icon',
  iconSize: [15, 15],
  iconAnchor: [7.5, 7.5]
});

// Coimbatore coordinates
const gandhipuramCoords = [11.0168, 76.9558]; // Gandhipuram coordinates
const kumaraguruCoords = [11.0009, 76.9628]; // Kumaraguru College coordinates

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingError, setTrackingError] = useState('');
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const mapRef = useRef(null);
  const dotMarkerRef = useRef(null);
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();
  
  // Generate a route with more points for smoother animation
  const generateRoute = () => {
    const route = [];
    const start = gandhipuramCoords;
    const end = kumaraguruCoords;

    // Calculate the exact 60% point
    const startLat = start[0] + (end[0] - start[0]) * 0.6;
    const startLng = start[1] + (end[1] - start[1]) * 0.6;

    // Create points from 60% to 100%
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const lat = startLat + (end[0] - startLat) * progress;
      const lng = startLng + (end[1] - startLng) * progress;
      route.push([lat, lng]);
    }

    return route;
  };

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId) {
      setTrackingError('Please enter a tracking ID');
      return;
    }

    setIsTracking(true);
    setTrackingError('');
    setIsOtpGenerated(false);
    setCurrentPositionIndex(0);
    setOtp('');
    setGeneratedOtp('');
    setIsOtpEnabled(false);
    setAnimationComplete(false);
   
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      // Mock tracking data
      const mockTrackingData = {
        id: trackingId,
        status: 'OTP Verification Pending',
        progress: 98, // Start at 98%
        pickupLocation: 'Gandhipuram, Coimbatore, Tamil Nadu',
        dropoffLocation: 'Kumaraguru College of Technology, Coimbatore, Tamil Nadu',
        pickupCoords: gandhipuramCoords,
        dropoffCoords: kumaraguruCoords,
        route: generateRoute(),
        estimatedDelivery: '5 minutes',
        droneId: 'DRN-2023-4567',
        packageDetails: {
          type: 'Electronics',
          weight: '1.2 kg',
          description: 'Smartphone and accessories'
        },
        sender: 'John Doe',
        recipient: 'Jane Smith',
        timestamp: new Date().toISOString()
      };

      setTrackingData(mockTrackingData);
    } catch (error) {
      console.error('Tracking error:', error);
      setTrackingError('Failed to track package. Please check your tracking ID and try again.');
    } finally {
      setIsTracking(false);
    }
  };

  // Animate green dot movement (runs only once)
  useEffect(() => {
    if (!trackingData || animationComplete) return;
    
    let step = 0;
    const route = trackingData.route;
    const totalSteps = route.length - 1;
    const animationDuration = 18000; // 18 seconds
    const stepDuration = animationDuration / totalSteps;
  
    const moveDot = () => {
      if (step <= totalSteps) {
        setCurrentPositionIndex(step);
        
        // Enable OTP when the dot reaches the last step
        if (step === totalSteps) {
          setIsOtpEnabled(true);
          setAnimationComplete(true); // Mark animation as complete
        }
    
        step++;
        if (step <= totalSteps) {
          setTimeout(moveDot, stepDuration);
        }
      }
    };
      
    moveDot();
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Clear any pending timeouts if component unmounts
      clearTimeout(moveDot);
    };
  }, [trackingData, animationComplete]);

  const handleGenerateOtp = () => {
    // Generate a random 4-digit OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setIsOtpGenerated(true);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setTrackingData(prev => ({
        ...prev,
        status: 'Delivered',
        progress: 100
      }));
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="trackorder-container">
      <div className="trackorder-header">
        <h1>Track Your Delivery</h1>
        <p>Monitor your package in real-time as it flies to you</p>
      </div>

      <form onSubmit={handleTrackSubmit} className="tracking-form">
        <div className="input-group tracking-input-group">
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Enter your tracking ID (e.g., AERO-1234)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
          />
          <button
            type="submit"
            className="track-button"
            disabled={isTracking}
          >
            {isTracking ? (
              <>
                <span className="spinner"></span>
                Tracking...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
                Track Package
              </>
            )}
          </button>
        </div>
        {trackingError && <p className="error-message">{trackingError}</p>}
      </form>

      {trackingData ? (
        <div className="tracking-details">
          <div className="tracking-map-container">
            <MapContainer
              center={trackingData.route[0]}
              zoom={15}
              style={{ height: '400px', width: '100%' }}
              className="tracking-map"
              whenCreated={(map) => { mapRef.current = map; }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
             
              <Marker position={trackingData.pickupCoords}>
                <Popup>Pickup Location</Popup>
              </Marker>
              <Marker position={trackingData.dropoffCoords}>
                <Popup>Destination</Popup>
              </Marker>
              {trackingData && (
                <Marker 
                  position={trackingData.route[currentPositionIndex]} 
                  icon={GreenDotIcon}
                >
                  <Popup>Current Drone Location</Popup>
                </Marker>
              )}

              <Polyline
                positions={[trackingData.pickupCoords, trackingData.dropoffCoords]}
                color="blue"
                weight={5}
                opacity={0.7}
              />
            </MapContainer>
          </div>

          <div className="otp-section">
              <h3>Delivery Verification</h3>
              <p>Please generate and verify OTP to complete delivery.</p>
              <div className="otp-form">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="otp-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={!isOtpGenerated}
                />
                <button
                  type="button"
                  className="otp-button"
                  onClick={handleGenerateOtp}
                  disabled={!isOtpEnabled}
                >
                  Generate OTP
                </button>
                <button
                  type="button"
                  className="otp-button"
                  onClick={handleVerifyOtp}
                  disabled={!isOtpGenerated}
                >
                  Verify OTP
                </button>
              </div>
              {isOtpGenerated && (
                <p style={{ marginTop: '10px', color: '#4a6bff' }}>
                  Your OTP is: {generatedOtp}
                </p>
              )}
            </div>
          <div className="tracking-info-container">
            
            <div className="tracking-status-card">
              <div className="status-header">
                <h2>Delivery Status</h2>
                <span className={`status-badge status-${trackingData.status.toLowerCase().replace(' ', '-')}`}>
                  {trackingData.status}
                </span>
              </div>
              <div className="progress-container">
                <div className="progress-labels">
                  <span>Pickup</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${trackingData.progress}%` }}
                  ></div>
                  <div className="progress-marker" style={{ left: `${trackingData.progress}%` }}>
                    <div className="marker-pulse"></div>
                  </div>
                </div>
                <div className="progress-percent">{trackingData.progress}% complete</div>
              </div>
            </div>

            <div className="tracking-stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5 0 1.12-.38 2.18-1.03 3.04L12 15.28l-3.97-4.24C7.38 10.18 7 9.12 7 8c0-2.76 2.24-5 5-5z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Pickup Location</h3>
                  <p>{trackingData.pickupLocation}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1 11.5h-2v-6h2v6zm3 0h-2v-6h2v6z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Dropoff Location</h3>
                  <p>{trackingData.dropoffLocation}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Estimated Delivery</h3>
                  <p>{trackingData.estimatedDelivery}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm4.29-9.81c-.4-2.01-2.16-3.52-4.29-3.52-1.69 0-3.15.96-3.88 2.36C6.36 9.21 5 10.7 5 12.5 5 14.43 6.57 16 8.5 16h7.58c1.38 0 2.5-1.12 2.5-2.5 0-1.24-.91-2.26-2.09-2.45z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>Drone ID</h3>
                  <p>{trackingData.droneId}</p>
                </div>
              </div>
            </div>

            <div className="package-details">
              <h3>Package Details</h3>
              <div className="package-details-content">
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{trackingData.packageDetails.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Weight:</span>
                  <span className="detail-value">{trackingData.packageDetails.weight}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{trackingData.packageDetails.description}</span>
                </div>
              </div>
            </div>

            <div className="contact-details">
              <div className="contact-card">
                <h3>Sender</h3>
                <p>{trackingData.sender}</p>
              </div>
              <div className="contact-card">
                <h3>Recipient</h3>
                <p>{trackingData.recipient}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="tracking-placeholder">
          {isTracking ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Locating your package...</p>
            </div>
          ) : (
            <div className="tracking-instructions">
              <h3>How to track your delivery</h3>
              <ol>
                <li>Enter your tracking ID (provided in your confirmation email)</li>
                <li>Click "Track Package" to see real-time location</li>
                <li>Watch your delivery's progress on the interactive map</li>
              </ol>
              <div className="tracking-example">
                <p>Example tracking ID: <code>AERO-1234</code></p>
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{ 
  marginTop: '40px', 
  textAlign: 'center',
  paddingBottom: '40px'
}}>
  <button 
    onClick={() => navigate('/home')}
    style={{
      padding: '12px 24px',
      backgroundColor: '#4a6bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 10px rgba(74, 107, 255, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a56d4'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4a6bff'}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
    Back to Home
  </button>
</div>
    </div>
  );
};

export default TrackOrder;