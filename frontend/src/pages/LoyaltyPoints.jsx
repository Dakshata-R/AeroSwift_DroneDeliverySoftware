import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoyaltyPoints.module.css';

const LoyaltyPoints = () => {
  const [userData, setUserData] = useState({
    points: 0,
    streak: 3,
    ordersThisMonth: 4,
    delayedOrders: 1,
    pointsToFreeDelivery: 15,
  });

  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // Animate points counter
    const animatePoints = () => {
      let current = 0;
      const target = userData.points;
      const increment = target / 30;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedPoints(Math.floor(current));
      }, 20);

      return () => clearInterval(timer);
    };

    // Animate progress bar
    const finalPercentage = (userData.points / 50) * 100;
    let currentWidth = 0;
    const increment = finalPercentage / 30;

    const progressTimer = setInterval(() => {
      currentWidth += increment;
      if (currentWidth >= finalPercentage) {
        currentWidth = finalPercentage;
        clearInterval(progressTimer);
      }
      setProgressWidth(currentWidth);
    }, 20);

    animatePoints();

    return () => {
      clearInterval(progressTimer);
    };
  }, [userData.points]);

  useEffect(() => {
    setTimeout(() => {
      setUserData({
        points: 35,
        streak: 3,
        ordersThisMonth: 4,
        delayedOrders: 1,
        pointsToFreeDelivery: 15,
      });
    }, 300);
  }, []);

  const potentialStreakPoints = userData.streak > 0 ? userData.streak * 5 : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>
          <span className={styles.titleHighlight}>Your</span> Loyalty Rewards
        </h1>
        <p className={styles.headerSubtitle}>
          Earn points with every order and unlock <span className={styles.highlight}>dicounts in deliveries</span>!
        </p>
      </div>

      <div className={styles.pointsContainer}>
        <div className={`${styles.pointsCard} ${styles.glowEffect}`}>
          <div className={styles.pointsValue}>
            <span className={styles.pointsNumber}>{animatedPoints}</span>
            <span className={styles.pointsLabel}>Loyalty Points</span>
          </div>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>
          <div className={styles.pointsTarget}>
            <span>0</span>
            <span className={styles.targetText}>Rs.50 offer at 50 points</span>
            <span>50</span>
          </div>
        </div>

        <div className={styles.nextReward}>
          <div className={`${styles.rewardCard} ${styles.pulseAnimation}`}>
            <div className={styles.rewardIcon}>🚀</div>
            <div className={styles.rewardContent}>
              <h4>Discounts</h4>
              <p>Only {userData.pointsToFreeDelivery} more points to go!</p>
              <div className={styles.rewardProgress}>
                <div 
                  className={styles.rewardProgressBar}
                  style={{ width: `${(userData.points / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.breakdownSection}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>✨</span> How You Earn Points
        </h3>
        <div className={styles.breakdownGrid}>
          <div className={`${styles.breakdownItem} ${styles.hoverEffect}`}>
            <div className={styles.breakdownIcon}>📦</div>
            <div className={styles.breakdownContent}>
              <h4>Per Order</h4>
              <p>10 points per delivery</p>
              <div className={styles.breakdownStats}>
                <span>{userData.ordersThisMonth} orders</span>
                <span className={styles.pointsGain}>+{userData.ordersThisMonth * 10} pts</span>
              </div>
            </div>
          </div>

          <div className={`${styles.breakdownItem} ${styles.hoverEffect}`}>
            <div className={styles.breakdownIcon}>⛈️</div>
            <div className={styles.breakdownContent}>
              <h4>Weather Compensation</h4>
              <p>10 points for delayed/canceled orders</p>
              <div className={styles.breakdownStats}>
                <span>{userData.delayedOrders} incidents</span>
                <span className={styles.pointsGain}>+{userData.delayedOrders * 10} pts</span>
              </div>
            </div>
          </div>

          <div className={`${styles.breakdownItem} ${styles.hoverEffect}`}>
            <div className={styles.breakdownIcon}>🔥</div>
            <div className={styles.breakdownContent}>
              <h4>Order Streak</h4>
              <p>5 points per consecutive day</p>
              <div className={styles.breakdownStats}>
                <span className={styles.streakText}>{userData.streak} day streak</span>
                <span className={styles.pointsGain}>+{potentialStreakPoints} pts</span>
              </div>
              {userData.streak > 2 && (
                <div className={styles.streakBadge}>
                  🔥 {userData.streak} Day Streak!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ctaContainer}>
        <Link to="/home" className={styles.ctaButton}>
          <span className={styles.buttonIcon}>🛒</span> Place Another Order
        </Link>
        <p className={styles.ctaSubtext}>
          {userData.streak >= 3 
            ? `Maintain your ${userData.streak}-day streak for bonus points!` 
            : 'Start a streak with your next delivery!'}
        </p>
      </div>
    </div>
  );
};

export default LoyaltyPoints;