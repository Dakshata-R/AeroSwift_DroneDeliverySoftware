// MyOrders.jsx
import { useState, useEffect } from 'react';
import styles from '../styles/MyOrders.module.css';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [weatherAlert, setWeatherAlert] = useState(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(45); // Starting with some points
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setOrders([
        {
          id: 'DRN-789456',
          status: 'delivered',
          date: '2023-05-15',
          items: 3,
          total: 45.99,
          drone: 'DJI-Phantom-X',
          deliveryTime: '12 minutes',
          trackingNumber: 'TRK-789456123'
        },
        {
          id: 'DRN-123456',
          status: 'in-progress',
          date: '2023-05-18',
          items: 5,
          total: 89.50,
          drone: 'Autel-Evo-II',
          deliveryTime: 'Estimated 8 minutes',
          trackingNumber: 'TRK-123456789',
          weatherDelay: true // Flag for weather delay
        },
        {
          id: 'DRN-456123',
          status: 'scheduled',
          date: '2023-05-20',
          items: 2,
          total: 32.75,
          drone: 'Skydio-2',
          deliveryTime: 'Scheduled for 3:00 PM',
          trackingNumber: 'TRK-456123789'
        },
        {
          id: 'DRN-321654',
          status: 'cancelled',
          date: '2023-05-10',
          items: 4,
          total: 67.25,
          drone: 'DJI-Mavic-3',
          deliveryTime: '--',
          trackingNumber: 'TRK-321654987'
        }
      ]);
      
      // Simulate weather alert for in-progress orders
      const delayedOrder = {
        id: 'DRN-123456',
        delayReason: 'heavy rain',
        estimatedDelay: '25 minutes',
        newDeliveryTime: '3:45 PM'
      };
      setWeatherAlert(delayedOrder);
      
      setLoading(false);
    }, 1000);
  }, []);

  const handleAcceptDelay = () => {
    // Add 10 loyalty points when user accepts delay
    setLoyaltyPoints(prev => prev + 10);
    setWeatherAlert(null);
    alert('Thank you for your patience! +10 loyalty points added to your account.');
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return '✅';
      case 'in-progress': return '🚀';
      case 'scheduled': return '⏱️';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return styles.delivered;
      case 'in-progress': return styles.inProgress;
      case 'scheduled': return styles.scheduled;
      case 'cancelled': return styles.cancelled;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My <span className={styles.highlight}>Drone Deliveries</span></h1>
        <p>Track your orders in real-time as they fly to you</p>
        
        <div className={styles.loyaltyBadge}>
          ✨ {loyaltyPoints} Loyalty Points
        </div>
      </div>

      {/* Weather Alert Banner */}
      {weatherAlert && (
        <div className={styles.weatherAlert}>
          <div className={styles.alertContent}>
            <div className={styles.alertIcon}>⛈️</div>
            <div>
              <h3>Weather Delay Alert</h3>
              <p>
                Your order #{weatherAlert.id} is delayed due to {weatherAlert.delayReason}. 
                New estimated delivery time: {weatherAlert.newDeliveryTime} (+{weatherAlert.estimatedDelay}).
              </p>
              <p className={styles.loyaltyOffer}>
                We've added <strong>+10 loyalty points</strong> to your account for the inconvenience.
              </p>
            </div>
          </div>
          <button 
            className={styles.alertButton}
            onClick={handleAcceptDelay}
          >
            Acknowledge Delay
          </button>
        </div>
      )}

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'in-progress' ? styles.active : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Flight 🚀
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'delivered' ? styles.active : ''}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'scheduled' ? styles.active : ''}`}
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.droneLoading}>🛸</div>
          <p>Scanning the skies for your orders...</p>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order.id} className={`${styles.orderCard} ${getStatusColor(order.status)}`}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderId}>#{order.id}</span>
                  <span className={styles.orderStatus}>
                    {getStatusIcon(order.status)} {order.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className={styles.orderDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date:</span>
                    <span>{order.date}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Items:</span>
                    <span>{order.items}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Drone Model:</span>
                    <span>{order.drone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Delivery Time:</span>
                    <span>
                      {order.weatherDelay ? (
                        <span className={styles.delayedText}>{order.deliveryTime} (Delayed)</span>
                      ) : (
                        order.deliveryTime
                      )}
                    </span>
                  </div>
                </div>
                
                <div className={styles.orderFooter}>
                  <span className={styles.trackingLabel}>Tracking #: {order.trackingNumber}</span>
                  <button 
                    className={styles.trackButton}
                    onClick={() => navigate('/track-order', { state: { trackingId: order.trackingNumber } })}
                  >
                    View Drone Path <span className={styles.buttonIcon}>🗺️</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noOrders}>
              <div className={styles.noOrdersIcon}>🛸</div>
              <h3>No orders found</h3>
              <p>Your delivery sky is clear right now</p>
              <button className={styles.shopButton}>
                Start Shopping <span className={styles.buttonIcon}>🛒</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;