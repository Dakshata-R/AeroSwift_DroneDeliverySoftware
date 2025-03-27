import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Home.css';
import droneImg from '../drone.png';

// Import Leaflet marker images
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const center = [12.9716, 77.5946]; // Default to Bangalore

const Home = () => {
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const droneRefs = useRef([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    packageType: 'document',
    packageWeight: '',
    packageDescription: '',
    specialHandling: [],
    senderName: '',
    senderPhone: '',
    senderEmail: '',
    recipientName: '',
    recipientPhone: '',
    otpPreference: 'sms',
    deliveryTime: 'standard',
    estimatedCost: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Drone animation effect
  useEffect(() => {
    if (showBooking) return;

    const animateDrones = () => {
      const drones = droneRefs.current.filter(Boolean);
      if (drones.length === 0) return;

      const droneData = drones.map((_, i) => ({
        x: -200 - (i * 150),
        y: 100 + (i * 100),
        speed: 0.5 + (Math.random() * 0.7),
        amplitude: 15 + (Math.random() * 10),
        frequency: 0.01 + (Math.random() * 0.02),
        rotation: 0,
        rotationSpeed: 0.5 + Math.random() * 1
      }));

      const frame = () => {
        const time = Date.now();

        droneData.forEach((data, index) => {
          data.x += data.speed;
          data.rotation = Math.sin(time * 0.005 * data.rotationSpeed) * 3;
          
          if (data.x > window.innerWidth + 200) {
            data.x = -200;
            data.y = 100 + Math.random() * 200;
          }
          
          const yOffset = Math.sin(time * data.frequency) * data.amplitude;
          drones[index].style.transform = `
            translate(${data.x}px, ${data.y + yOffset}px)
            rotate(${data.rotation}deg)
          `;
        });

        requestAnimationFrame(frame);
      };

      requestAnimationFrame(frame);
    };

    animateDrones();
  }, [showBooking]);

  const getCoordinates = async (place) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
      const response = await axios.get(url);
      if (response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
          address: response.data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const calculateRoute = async () => {
    if (!origin || !destination) {
      alert('Please enter both pickup and drop-off locations');
      return;
    }

    setIsCalculating(true);
    setDistance('');
    setDuration('');
    setEstimatedDeliveryTime('');
    setRoute([]);

    try {
      const originData = await getCoordinates(origin);
      const destinationData = await getCoordinates(destination);
      
      if (originData && destinationData) {
        const routeUrl = `https://router.project-osrm.org/route/v1/driving/${originData.lng},${originData.lat};${destinationData.lng},${destinationData.lat}?overview=full&geometries=geojson`;
        
        const response = await axios.get(routeUrl);
        if (response.data.routes.length > 0) {
          const routeCoords = response.data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
          setRoute(routeCoords);
          
          const dist = (response.data.routes[0].distance / 1000).toFixed(2);
          setDistance(`${dist} km`);
          
          const dur = response.data.routes[0].duration;
          const hours = Math.floor(dur / 3600);
          const minutes = Math.floor((dur % 3600) / 60);
          let durationText = '';
          if (hours > 0) durationText += `${hours} hr${hours > 1 ? 's' : ''} `;
          durationText += `${minutes} min${minutes !== 1 ? 's' : ''}`;
          setDuration(durationText);
          
          const droneSpeed = 40;
          const estimatedMinutes = Math.ceil((dist / droneSpeed) * 60) + 15;
          setEstimatedDeliveryTime(`${estimatedMinutes} minutes`);

          const baseRate = 50;
          const distanceRate = dist * 10;
          const weightRate = formData.packageWeight ? formData.packageWeight * 5 : 0;
          const specialHandlingRate = formData.specialHandling.length * 20;
          
          const totalCost = (baseRate + distanceRate + weightRate + specialHandlingRate)*3;
          setFormData(prev => ({
            ...prev,
            estimatedCost: `₹${totalCost.toFixed(2)}`,
            pickupLocation: originData.address,
            dropoffLocation: destinationData.address
          }));

        } else {
          alert('No route found between these locations');
        }
      } else {
        alert('Could not find coordinates for one or both locations');
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      alert('Failed to calculate route. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBookDelivery = () => {
    setShowBooking(true);
  };

  const handleBackToHome = () => {
    setShowBooking(false);
    setRoute([]);
    setOrigin('');
    setDestination('');
    setDistance('');
    setDuration('');
    setEstimatedDeliveryTime('');
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Ensure weight does not exceed 20kg
    if (name === "packageWeight") {
      const weight = parseFloat(value);
      if (weight > 20) {
        setFormErrors(prev => ({
          ...prev,
          packageWeight: "❌ The package weight exceeds 20kg. Please split your goods or use another transport method."
        }));
        return; // Prevent updating state with an invalid weight
      } else {
        setFormErrors(prev => ({
          ...prev,
          packageWeight: "" // Clear error if within limit
        }));
      }
    }
  
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.senderName.trim()) {
      errors.senderName = 'Sender name is required';
      isValid = false;
    }
    if (!formData.senderPhone.trim()) {
      errors.senderPhone = 'Sender phone is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.senderPhone)) {
      errors.senderPhone = 'Invalid phone number';
      isValid = false;
    }
    if (!formData.senderEmail.trim()) {
      errors.senderEmail = 'Sender email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.senderEmail)) {
      errors.senderEmail = 'Invalid email address';
      isValid = false;
    }

    if (!formData.recipientName.trim()) {
      errors.recipientName = 'Recipient name is required';
      isValid = false;
    }
    if (!formData.recipientPhone.trim()) {
      errors.recipientPhone = 'Recipient phone is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.recipientPhone)) {
      errors.recipientPhone = 'Invalid phone number';
      isValid = false;
    }

    if (!formData.packageWeight) {
      errors.packageWeight = 'Package weight is required';
      isValid = false;
    } else if (parseFloat(formData.packageWeight) > 20) {
      errors.packageWeight = '❌ The package weight exceeds 20kg. Please split your goods or use another transport method.';
      isValid = false;
    }

    if (!formData.packageDescription.trim()) {
      errors.packageDescription = 'Package description is required';
      isValid = false;
    }

    if (!distance) {
      errors.route = 'Please calculate the route first';
      isValid = false;
    }

    setFormErrors(errors); // Update the state with errors
    return isValid;

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigate('/upi-payment', { state: { formData } });
    } else {
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }

  };
  return (
    <div className="home-container">
      {showBooking ? (
        <div className="booking-container">
          <div className="booking-header">
            <h1>Book Your Drone Delivery</h1>
            <p>Fill in the details for your aerial delivery</p>
          </div>

          <div className="map-container-top">
            <MapContainer 
              center={center} 
              zoom={12} 
              style={{ height: '400px', width: '100%' }}
              className="map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {route.length > 0 && (
                <>
                  <Marker position={route[0]}>
                    <Popup>Pickup Location</Popup>
                  </Marker>
                  <Marker position={route[route.length - 1]}>
                    <Popup>Destination</Popup>
                  </Marker>
                  <Polyline 
                    positions={route} 
                    color="blue"
                    weight={5}
                    opacity={0.7}
                  />
                </>
              )}
            </MapContainer>
          </div>

          <div className="location-inputs-container">
            <div className="location-inputs">
              <div className="input-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Dropoff Location</label>
                <input
                  type="text"
                  placeholder="Enter destination address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
              <button 
                onClick={calculateRoute}
                className="calculate-button"
                disabled={!origin || !destination || isCalculating}
              >
                {isCalculating ? 'Calculating...' : 'Calculate Route'}
              </button>
            </div>

            {isCalculating && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Calculating optimal drone route...</p>
              </div>
            )}

            {route.length > 0 && (
              <div className="route-details-container">
                <div className="route-detail-card">
                  <div className="route-detail-icon">📏</div>
                  <div className="route-detail-content">
                    <h3>Distance</h3>
                    <p>{distance}</p>
                  </div>
                </div>
                
                <div className="route-detail-card highlight">
                  <div className="route-detail-icon">🚁</div>
                  <div className="route-detail-content">
                    <h3>Drone Delivery Time</h3>
                    <p>{estimatedDeliveryTime}</p>
                  </div>
                </div>
                
                <div className="route-detail-card">
                  <div className="route-detail-icon">💰</div>
                  <div className="route-detail-content">
                    <h3>Estimated Cost</h3>
                    <p>{formData.estimatedCost}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-section">
              <h2>Sender Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    className={formErrors.senderName ? 'error' : ''}
                  />
                  {formErrors.senderName && <span className="error-message">{formErrors.senderName}</span>}
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                    className={formErrors.senderPhone ? 'error' : ''}
                  />
                  {formErrors.senderPhone && <span className="error-message">{formErrors.senderPhone}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className={formErrors.senderEmail ? 'error' : ''}
                />
                {formErrors.senderEmail && <span className="error-message">{formErrors.senderEmail}</span>}
              </div>
            </div>

            <div className="form-section">
              <h2>Recipient Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                    className={formErrors.recipientName ? 'error' : ''}
                  />
                  {formErrors.recipientName && <span className="error-message">{formErrors.recipientName}</span>}
                </div>
                <div className="form-group">
                  <label>Recipient Phone</label>
                  <input
                    type="tel"
                    name="recipientPhone"
                    value={formData.recipientPhone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                    className={formErrors.recipientPhone ? 'error' : ''}
                  />
                  {formErrors.recipientPhone && <span className="error-message">{formErrors.recipientPhone}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Package Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Package Type</label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    required
                  >
                    <option value="document">Document</option>
                    <option value="parcel">Parcel</option>
                    <option value="food">Food</option>
                    <option value="medical">Medical</option>
                    <option value="electronics">Electronics</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Weight (kg) <span style={{fontSize: '0.8rem', color: '#666'}}>(Max 20kg per drone)</span></label>
                  <input
                    type="number"
                    name="packageWeight"
                    value={formData.packageWeight}
                    onChange={handleChange}
                    placeholder="0.5"
                    min="0.1"
                    max="20"
                    step="0.1"
                    required
                    className={formErrors.packageWeight ? 'error' : ''}
                  />
                  {formErrors.packageWeight && (
                    <div className="error-message">
                      {formErrors.packageWeight}
                      {parseFloat(formData.packageWeight) > 20 && (
                        <div style={{ 
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          background: '#fff8f8',
                          borderLeft: '3px solid #ff6b6b'
                        }}>
                          <strong style={{ display: 'block', marginBottom: '0.3rem' }}>Options:</strong>
                          <ul style={{
                            margin: '0.3rem 0 0 1rem',
                            paddingLeft: '1rem',
                            fontSize: '0.9rem'
                          }}>
                            <li>Split your shipment into multiple packages under 20kg each</li>
                            <li>Use our ground transportation service for heavier items</li>
                            <li>Contact our support team for bulk delivery solutions</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>


              </div>
              <div className="form-group">
                <label>Package Description</label>
                <textarea
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleChange}
                  placeholder="Describe your package contents"
                  rows="3"
                  required
                  className={formErrors.packageDescription ? 'error' : ''}
                />
                {formErrors.packageDescription && <span className="error-message">{formErrors.packageDescription}</span>}
              </div>
              <div className="form-group">
                <label>Package Safety Instructions</label>
                <div className="safety-instructions">
                  <div className="instruction-item">
                    <div className="instruction-icon">📦</div>
                    <div className="instruction-text">
                      <strong>Fragile Items:</strong> Wrap in bubble wrap and use rigid boxes
                    </div>
                  </div>
                  <div className="instruction-item">
                    <div className="instruction-icon">🧊</div>
                    <div className="instruction-text">
                      <strong>Perishable Goods:</strong> Use insulated containers with cooling packs
                    </div>
                  </div>
                  <div className="instruction-item">
                    <div className="instruction-icon">💧</div>
                    <div className="instruction-text">
                      <strong>Liquids:</strong> Double-seal in leak-proof containers
                    </div>
                  </div>
                  <div className="instruction-item">
                    <div className="instruction-icon">🔌</div>
                    <div className="instruction-text">
                      <strong>Electronics:</strong> Use anti-static packaging materials
                    </div>
                  </div>
                  <div className="instruction-item">
                    <div className="instruction-icon">⚠️</div>
                    <div className="instruction-text">
                      <strong>Important:</strong> Ensure package weight is evenly distributed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Delivery Options</h2>
              <div className="form-group">
                <label>OTP Delivery Preference</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="otpPreference"
                      value="sms"
                      checked={formData.otpPreference === 'sms'}
                      onChange={handleChange}
                    />
                    SMS to Mobile
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="otpPreference"
                      value="email"
                      checked={formData.otpPreference === 'email'}
                      onChange={handleChange}
                    />
                    Email
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Payment</h2>
              <div className="form-group">
                <label>Estimated Cost</label>
                <input
                  type="text"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                  placeholder="Will be calculated after route"
                  readOnly
                />
              </div>
              {formErrors.route && (
                <div className="form-group">
                  <span className="error-message">{formErrors.route}</span>
                </div>
              )}
              <div className="button-group">
                <button
                  type="button"
                  onClick={handleBackToHome}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  onClick={() => navigate ('/upi-payment',{state:{formData}})}
                >
                  Confirm & Pay via UPI
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="sky-background">
            {[...Array(5)].map((_, i) => (
              <div key={`cloud-${i}`} className={`cloud cloud-${i % 3}`} 
                   style={{
                     top: `${10 + (i * 15)}%`,
                     left: `${(i * 20)}%`,
                     animationDuration: `${30 + (i * 10)}s`,
                     animationDelay: `${i * 2}s`
                   }} />
            ))}
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={`drone-${i}`} 
                 ref={el => droneRefs.current[i] = el} 
                 className={`drone drone-${i}`}>
              <img 
                src={droneImg} 
                alt="Delivery drone" 
                className="drone-image"
                style={{
                  width: '120px',
                  filter: `hue-rotate(${i * 120}deg) drop-shadow(0 2px 5px rgba(0,0,0,0.3))`
                }} 
              />
            </div>
          ))}

          <div className="home-content">
            <h1 className="main-title">
              <span className="title-part">Aero Swift</span>
            </h1>
            
            <p className="tagline">Your packages delivered by air in minutes, not hours</p>
            
            <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr)',
  gap: '2.5rem',
  margin: '3rem 0'
}}>
   <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '2.5rem 1.5rem', // Reduced horizontal padding
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    height: '250px', // Added fixed height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    ':hover': {
      transform: 'translateY(-10px)',
      background: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
    }
  }}>
    <div style={{
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      color: 'white',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'scale(1.2) rotate(10deg)',
        color: '#ff5e62'
      }
    }}>⚡</div>
    <div>
      <div style={{
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        color: 'white',
        fontWeight: '700',
        background: 'linear-gradient(to right, #fff, #e0f7fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>3x</div>
      <div style={{
        fontSize: '1.4rem',
        marginBottom: '0.5rem',
        color: 'white',
        position: 'relative',
        display: 'inline-block',
        ':after': {
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '2px',
          background: 'white',
          transition: 'width 0.3s ease'
        },
        ':hover:after': {
          width: '50%'
        }
      }}>Faster</div>
      <div style={{
        opacity: '0.9',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: '1rem'
      }}>Than traditional delivery</div>
    </div>
  </div>
  
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '2.5rem 1.5rem',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    ':hover': {
      transform: 'translateY(-10px)',
      background: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
    }
  }}>
    <div style={{
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      color: 'white',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'scale(1.2) rotate(10deg)',
        color: '#ff5e62'
      }
    }}>🌿</div>
    <div>
      <div style={{
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        color: 'white',
        fontWeight: '700',
        background: 'linear-gradient(to right, #fff, #e0f7fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>100%</div>
      <div style={{
        fontSize: '1.4rem',
        marginBottom: '0.5rem',
        color: 'white',
        position: 'relative',
        display: 'inline-block',
        ':after': {
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '2px',
          background: 'white',
          transition: 'width 0.3s ease'
        },
        ':hover:after': {
          width: '50%'
        }
      }}>Eco-Friendly</div>
      <div style={{
        opacity: '0.9',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: '1rem'
      }}>Solar-powered drones</div>
    </div>
  </div>
  
  <div style={{
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '2.5rem 1.5rem',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.4s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    ':hover': {
      transform: 'translateY(-10px)',
      background: 'rgba(255, 255, 255, 0.2)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
    }
  }}>
    <div style={{
      fontSize: '2.5rem',
      marginBottom: '1.5rem',
      color: 'white',
      display: 'inline-block',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'scale(1.2) rotate(10deg)',
        color: '#ff5e62'
      }
    }}>📦</div>
    <div>
      <div style={{
        fontSize: '2.5rem',
        marginBottom: '0.5rem',
        color: 'white',
        fontWeight: '700',
        background: 'linear-gradient(to right, #fff, #e0f7fa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>500+</div>
      <div style={{
        fontSize: '1.4rem',
        marginBottom: '0.5rem',
        color: 'white',
        position: 'relative',
        display: 'inline-block',
        ':after': {
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '2px',
          background: 'white',
          transition: 'width 0.3s ease'
        },
        ':hover:after': {
          width: '50%'
        }
      }}>Deliveries</div>
      <div style={{
        opacity: '0.9',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: '1rem'
      }}>Completed daily</div>
    </div>
  </div>
</div>
                        
            <div className="cta-section">
              <button className="cta-button primary" onClick={handleBookDelivery}>
                Book a Drone Now
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => navigate('/track-order')}
              >
                Track Existing Order
              </button>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔄</div>
                <h3>Real-time Tracking</h3>
                <p>Watch your package fly to you in real-time on our interactive map</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure Delivery</h3>
                <p>OTP protected pickup and drop-off for complete security</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⏱️</div>
                <h3>Instant Notifications</h3>
                <p>Get alerts at every step of the delivery process</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🌦️</div>
                <h3>Weather Adaptive</h3>
                <p>Smart routing to avoid bad weather conditions</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;