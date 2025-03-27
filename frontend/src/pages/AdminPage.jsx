import { useState, useEffect } from 'react';
import { 
  Bar, 
  Line, 
  Doughnut 
} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import styles from '../styles/AdminPage.module.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: 1, email: 'user1@dronedash.com', role: 'user', joinDate: '2023-01-15', orders: 12 },
        { id: 2, email: 'user2@dronedash.com', role: 'user', joinDate: '2023-02-20', orders: 5 },
        { id: 3, email: 'admin@dronedash.com', role: 'admin', joinDate: '2023-01-10', orders: 0 },
        { id: 4, email: 'user3@dronedash.com', role: 'user', joinDate: '2023-03-05', orders: 8 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Chart data configurations
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12500, 18900, 17800, 21500, 24568],
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  const deliveryTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Avg Delivery Time (min)',
        data: [18.2, 16.5, 15.8, 15.1, 14.2],
        backgroundColor: 'rgba(46, 204, 113, 0.6)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  const droneEfficiencyData = {
    labels: ['Operational', 'Maintenance', 'Charging'],
    datasets: [
      {
        data: [78, 15, 7],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'New Users',
        data: [320, 450, 380, 510, 620],
        backgroundColor: 'rgba(155, 89, 182, 0.6)',
        borderColor: 'rgba(155, 89, 182, 1)',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    maintainAspectRatio: false
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <div className={styles.adminPage}>
      <div className={styles.header}>
        <h1>DroneDash <span className={styles.highlight}>Admin Portal</span></h1>
        <p>Manage your drone delivery ecosystem</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ System Settings
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics Dashboard
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'users' && (
          <div className={styles.section}>
            <h2>User Management</h2>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.droneLoading}>🛸</div>
                <p>Loading user data...</p>
              </div>
            ) : (
              <div className={styles.userTable}>
                <div className={styles.tableHeader}>
                  <span>Email</span>
                  <span>Role</span>
                  <span>Join Date</span>
                  <span>Orders</span>
                  <span>Actions</span>
                </div>
                {users.map(user => (
                  <div key={user.id} className={styles.userRow}>
                    <span>{user.email}</span>
                    <span>
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={styles.roleSelect}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </span>
                    <span>{user.joinDate}</span>
                    <span>{user.orders}</span>
                    <span>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.section}>
            <h2>System Settings</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingCard}>
                <h3>🛒 Pricing Configuration</h3>
                <div className={styles.settingItem}>
                  <label>Base Delivery Fee</label>
                  <input type="number" defaultValue="5.99" />
                </div>
                <div className={styles.settingItem}>
                  <label>Price per mile</label>
                  <input type="number" defaultValue="0.75" />
                </div>
                <div className={styles.settingItem}>
                  <label>Priority Delivery Multiplier</label>
                  <input type="number" defaultValue="1.5" step="0.1" />
                </div>
                <button className={styles.saveBtn}>Save Pricing</button>
              </div>

              <div className={styles.settingCard}>
                <h3>🛩️ Drone Fleet Settings</h3>
                <div className={styles.settingItem}>
                  <label>Max Flight Range (miles)</label>
                  <input type="number" defaultValue="15" />
                </div>
                <div className={styles.settingItem}>
                  <label>Max Payload Weight (lbs)</label>
                  <input type="number" defaultValue="5" />
                </div>
                <div className={styles.settingItem}>
                  <label>Battery Threshold (%)</label>
                  <input type="number" defaultValue="20" />
                </div>
                <button className={styles.saveBtn}>Save Drone Settings</button>
              </div>

              <div className={styles.settingCard}>
                <h3>🗺️ Route Optimization</h3>
                <div className={styles.settingItem}>
                  <label>Weather Sensitivity</label>
                  <select defaultValue="medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className={styles.settingItem}>
                  <label>No-Fly Zone Buffer (miles)</label>
                  <input type="number" defaultValue="0.5" step="0.1" />
                </div>
                <div className={styles.settingItem}>
                  <label>Max Route Deviation (%)</label>
                  <input type="number" defaultValue="10" />
                </div>
                <button className={styles.saveBtn}>Save Route Settings</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.section}>
            <h2>Analytics Dashboard</h2>
            <div className={styles.analyticsGrid}>
              <div className={styles.metricCard}>
                <h3>📈 Revenue</h3>
                <div className={styles.metricValue}>$24,568</div>
                <div className={styles.metricSubtext}>+12% from last month</div>
                <div className={styles.chartContainer}>
                  <Line data={revenueData} options={chartOptions} />
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3>⏱️ Avg. Delivery Time</h3>
                <div className={styles.metricValue}>14.2 min</div>
                <div className={styles.metricSubtext}>-1.8 min from last month</div>
                <div className={styles.chartContainer}>
                  <Line data={deliveryTimeData} options={chartOptions} />
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3>🛩️ Drone Efficiency</h3>
                <div className={styles.metricValue}>92%</div>
                <div className={styles.metricSubtext}>+3% from last month</div>
                <div className={styles.chartContainer}>
                  <Doughnut data={droneEfficiencyData} options={chartOptions} />
                </div>
              </div>
              <div className={styles.metricCard}>
                <h3>👥 User Growth</h3>
                <div className={styles.metricValue}>1,248</div>
                <div className={styles.metricSubtext}>+18% from last month</div>
                <div className={styles.chartContainer}>
                  <Bar data={userGrowthData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;