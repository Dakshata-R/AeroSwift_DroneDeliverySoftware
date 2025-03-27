import styles from '../styles/HowItWorks.module.css';

const HowItWorks = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>How <span className={styles.highlight}>AeroSwift</span> Works</h1>
        <p className={styles.heroSubtitle}>Revolutionizing deliveries with our drone-powered system</p>
        <div className={styles.droneAnimation}>🛸</div>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Our Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Lightning Fast Delivery</h3>
            <p>Get your packages delivered in under 30 minutes with our high-speed drone network</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌱</div>
            <h3>Eco-Friendly</h3>
            <p>Zero-emission deliveries that help reduce your carbon footprint</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure Delivery</h3>
            <p>Biometric authentication ensures your package reaches only you</p>
          </div>
        </div>
      </div>

      <div className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineNumber}>1</div>
            <div className={styles.timelineContent}>
              <h3>Place Your Order</h3>
              <p>Select items from our app and choose drone delivery at checkout</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineNumber}>2</div>
            <div className={styles.timelineContent}>
              <h3>Drone Dispatch</h3>
              <p>Our automated system assigns the nearest available drone</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineNumber}>3</div>
            <div className={styles.timelineContent}>
              <h3>In-Flight Tracking</h3>
              <p>Watch your delivery in real-time through our app</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineNumber}>4</div>
            <div className={styles.timelineContent}>
              <h3>Secure Drop-off</h3>
              <p>Drone verifies your identity before releasing the package</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.loyaltySection}>
        <h2 className={styles.sectionTitle}>Loyalty Points System</h2>
        <div className={styles.loyaltyCards}>
          <div className={styles.loyaltyCard}>
            <div className={styles.loyaltyHeader}>
              <div className={styles.loyaltyIcon}>🏆</div>
              <h3>Earn Points</h3>
            </div>
            <ul className={styles.loyaltyList}>
              <li>10 points per delivery</li>
              <li>5 bonus points per consecutive day</li>
              <li>20 points for weather delays</li>
            </ul>
          </div>
          <div className={styles.loyaltyCard}>
            <div className={styles.loyaltyHeader}>
              <div className={styles.loyaltyIcon}>🎁</div>
              <h3>Redeem Rewards</h3>
            </div>
            <ul className={styles.loyaltyList}>
              <li>50 points = Free delivery</li>
              <li>100 points = Priority service</li>
              <li>200 points = Exclusive discounts</li>
            </ul>
          </div>
          <div className={styles.loyaltyCard}>
            <div className={styles.loyaltyHeader}>
              <div className={styles.loyaltyIcon}>📈</div>
              <h3>Streak Bonuses</h3>
            </div>
            <ul className={styles.loyaltyList}>
              <li>3-day streak = 2x points</li>
              <li>7-day streak = 3x points</li>
              <li>30-day streak = VIP status</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <h2>Ready to Experience the Future of Delivery?</h2>
        <button className={styles.ctaButton}>
          Start Ordering Now <span className={styles.ctaIcon}>🚀</span>
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;