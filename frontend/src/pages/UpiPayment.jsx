import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  SafetyOutlined,
  BankOutlined,
  CreditCardOutlined,
  MobileOutlined,
  LoadingOutlined,
  TagOutlined
} from '@ant-design/icons';
import { Button, Input, Divider, Card, Typography, Alert, Space, Badge, Modal, Select } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

const UPIPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [branch, setBranch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [countdown, setCountdown] = useState(180);
  const [isFocused, setIsFocused] = useState(false);
  const [activeMethod, setActiveMethod] = useState('upi');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [originalAmount, setOriginalAmount] = useState(350);
  const [discountedAmount, setDiscountedAmount] = useState(350);
  const [showSparkle, setShowSparkle] = useState(false);
  
  const orderDetails = location.state?.orderDetails || {
    amount: '₹350.00',
    orderId: 'DRONE-' + Math.floor(Math.random() * 1000000),
    description: 'Premium Drone Delivery Service',
    items: [
      { name: 'Delivery', price: '₹250.00' },
      { name: 'Safe Delivery', price: '₹100.00' }
    ]
  };

  const handlePayment = () => {
    if (activeMethod === 'upi' && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
      Alert.error({
        message: 'Invalid UPI ID',
        description: 'Please enter a valid UPI ID (e.g., name@oksbi)',
        placement: 'top'
      });
      return;
    }
    
    if (activeMethod === 'card' && (!cardNumber || !expiryDate)) {
      Alert.error({
        message: 'Incomplete Card Details',
        description: 'Please enter both card number and expiry date',
        placement: 'top'
      });
      return;
    }
    
    if (activeMethod === 'netbanking' && (!accountNumber || !ifscCode || !branch)) {
      Alert.error({
        message: 'Incomplete Bank Details',
        description: 'Please enter all bank account details',
        placement: 'top'
      });
      return;
    }
    
    setPaymentStatus('processing');
    
    // Simulate API call
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => navigate('/my-orders', { state: { orderDetails } }), 1500);
    }, 1500);
  };

  const applyCoupon = () => {
    setShowCouponModal(true);
  };

  const confirmCoupon = (apply) => {
    setShowCouponModal(false);
    if (apply) {
      setCouponApplied(true);
      setDiscountedAmount(originalAmount - 50);
      
      // Show sparkle effect
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 1000);
    }
  };

  useEffect(() => {
    let timer;
    if (paymentStatus === 'processing') {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStatus('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          Back
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card 
          style={styles.paymentCard}
          bodyStyle={{ padding: '32px' }}
        >
          <div style={styles.header}>
            <Title level={3} style={styles.title}>
              Secure Payment Gateway
            </Title>
            <Badge 
              status="processing" 
              text={
                <Text type="secondary" style={styles.secureBadge}>
                  <SafetyOutlined /> Secured
                </Text>
              } 
            />
          </div>
          
          <Divider style={styles.divider} />
          
          <div style={styles.orderSummary}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong style={styles.orderId}>Order #: {orderDetails.orderId}</Text>
              {orderDetails.items.map((item, index) => (
                <div key={index} style={styles.orderItem}>
                  <Text>{item.name}</Text>
                  <Text>{item.price}</Text>
                </div>
              ))}
            </Space>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <div style={styles.totalAmount}>
              <div>
                <Text strong>Total Amount</Text>
                {couponApplied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Text delete style={{ color: '#ff4d4f', fontSize: '14px', display: 'block' }}>
                      ₹{originalAmount}.00
                    </Text>
                  </motion.div>
                )}
              </div>
              <motion.div
                animate={showSparkle ? { 
                  scale: [1, 1.1, 1],
                  color: ['#1a1a1a', '#52c41a', '#1a1a1a']
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <Title level={3} style={styles.amount}>
                  ₹{discountedAmount}.00
                </Title>
              </motion.div>
            </div>

            <Button 
              type="dashed" 
              icon={<TagOutlined />} 
              onClick={applyCoupon}
              style={{ width: '100%', marginTop: '12px' }}
              disabled={couponApplied}
            >
              {couponApplied ? 'Coupon Applied' : 'Apply Coupon'}
            </Button>
          </div>

          <Divider style={styles.divider} />

          <div style={styles.paymentMethods}>
            <div style={styles.methodTabs}>
              <Button
                type={activeMethod === 'upi' ? 'primary' : 'text'}
                icon={<MobileOutlined />}
                onClick={() => setActiveMethod('upi')}
                style={styles.methodTab}
              >
                UPI
              </Button>
              <Button
                type={activeMethod === 'card' ? 'primary' : 'text'}
                icon={<CreditCardOutlined />}
                onClick={() => setActiveMethod('card')}
                style={styles.methodTab}
              >
                Card
              </Button>
              <Button
                type={activeMethod === 'netbanking' ? 'primary' : 'text'}
                icon={<BankOutlined />}
                onClick={() => setActiveMethod('netbanking')}
                style={styles.methodTab}
              >
                Net Banking
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {activeMethod === 'upi' && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={styles.paymentForm}>
                    <Text strong style={styles.inputLabel}>Enter UPI ID</Text>
                    <Input
                      placeholder="name@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      style={{
                        ...styles.upiInput,
                        borderColor: isFocused ? '#1890ff' : '#d9d9d9',
                        boxShadow: isFocused ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none'
                      }}
                      size="large"
                      suffix={
                        isFocused && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              e.g., name@oksbi
                            </Text>
                          </motion.div>
                        )
                      }
                    />
                    <div style={styles.upiApps}>
                      <div style={styles.upiApp}><div style={{ ...styles.upiAppIcon, background: '#00BFA5' }}>GPay</div></div>
                      <div style={styles.upiApp}><div style={{ ...styles.upiAppIcon, background: '#5C2D91' }}>Paytm</div></div>
                      <div style={styles.upiApp}><div style={{ ...styles.upiAppIcon, background: '#0D47A1' }}>PhonePay</div></div>
                      <div style={styles.upiApp}><div style={{ ...styles.upiAppIcon, background: '#FF6D00' }}>BHIM</div></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMethod === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={styles.paymentForm}>
                    <Text strong style={styles.inputLabel}>Card Number</Text>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      style={styles.cardInput}
                      size="large"
                    />
                    
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={styles.inputLabel}>Expiry Date</Text>
                        <Input
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              let formatted = value;
                              if (value.length > 2) {
                                formatted = `${value.substring(0, 2)}/${value.substring(2)}`;
                              }
                              setExpiryDate(formatted);
                            }
                          }}
                          maxLength={5}
                          style={styles.cardInput}
                          size="large"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong style={styles.inputLabel}>CVV</Text>
                        <Input.Password
                          placeholder="•••"
                          maxLength={3}
                          style={styles.cardInput}
                          size="large"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMethod === 'netbanking' && (
                <motion.div
                  key="netbanking"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={styles.paymentForm}>
                    <Text strong style={styles.inputLabel}>Bank Account Number</Text>
                    <Input
                      placeholder="Enter your account number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      style={styles.cardInput}
                      size="large"
                    />
                    
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <Text strong style={styles.inputLabel}>IFSC Code</Text>
                        <Input
                          placeholder="Enter IFSC code"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                          style={styles.cardInput}
                          size="large"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text strong style={styles.inputLabel}>Branch</Text>
                        <Input
                          placeholder="Enter branch name"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          style={styles.cardInput}
                          size="large"
                        />
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '16px' }}>
                      <Text strong style={styles.inputLabel}>Select Bank</Text>
                      <Select
                        placeholder="Select your bank"
                        style={{ width: '100%' }}
                        size="large"
                      >
                        <Option value="sbi">State Bank of India</Option>
                        <Option value="hdfc">HDFC Bank</Option>
                        <Option value="icici">ICICI Bank</Option>
                        <Option value="axis">Axis Bank</Option>
                        <Option value="kotak">Kotak Mahindra Bank</Option>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {paymentStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  message={
                    <div style={styles.statusMessage}>
                      {paymentStatus === 'processing' && (
                        <>
                          <LoadingOutlined style={{ ...styles.statusIcon, color: '#1890ff' }} />
                          <div>
                            <Text strong>Processing Payment</Text>
                            <Text type="secondary" style={styles.timerText}>
                              Approx. {formatTime(countdown)} remaining
                            </Text>
                          </div>
                        </>
                      )}
                      {paymentStatus === 'success' && (
                        <>
                          <CheckCircleFilled style={{ ...styles.statusIcon, color: '#52c41a' }} />
                          <Text strong>Payment Successful!</Text>
                        </>
                      )}
                      {paymentStatus === 'failed' && (
                        <>
                          <CloseCircleFilled style={{ ...styles.statusIcon, color: '#ff4d4f' }} />
                          <Text strong>Payment Failed</Text>
                        </>
                      )}
                    </div>
                  }
                  type={
                    paymentStatus === 'processing' ? 'info' :
                    paymentStatus === 'success' ? 'success' : 'error'
                  }
                  showIcon={false}
                  style={styles.statusAlert}
                  banner
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="primary"
              block
              size="large"
              onClick={handlePayment}
              loading={paymentStatus === 'processing'}
              disabled={
                (activeMethod === 'upi' && !upiId) ||
                (activeMethod === 'card' && (!cardNumber || !expiryDate)) ||
                (activeMethod === 'netbanking' && (!accountNumber || !ifscCode || !branch)) ||
                paymentStatus
              }
              style={styles.payButton}
              shape="round"
            >
              {paymentStatus === 'processing' ? (
                <span>Processing Payment...</span>
              ) : (
                <span>Pay ₹{discountedAmount}.00</span>
              )}
            </Button>
          </motion.div>

          <div style={styles.securityInfo}>
            <SafetyOutlined style={styles.securityIcon} />
            <Text type="secondary">
              Your payment is secured with 256-bit encryption. We don't store your payment details.
            </Text>
          </div>
        </Card>
      </motion.div>

      <Modal
        title="Apply Coupon"
        visible={showCouponModal}
        onOk={() => confirmCoupon(true)}
        onCancel={() => confirmCoupon(false)}
        okText="Yes, Apply"
        cancelText="No Thanks"
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <TagOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '16px' }} />
          <Title level={4} style={{ marginBottom: '8px' }}>Use your 50 points?</Title>
          <Text type="secondary">You have 100 loyalty points available. Applying this coupon will deduct 50 points and give you ₹50 discount.</Text>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '520px',
    margin: '0 auto',
    padding: '24px 16px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  backButton: {
    marginBottom: '16px',
    paddingLeft: 0,
    fontWeight: 500
  },
  paymentCard: {
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f0f0f0',
    flex: 1
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  title: {
    margin: 0,
    color: '#1a1a1a',
    fontWeight: 600
  },
  secureBadge: {
    fontSize: '13px',
    color: '#52c41a'
  },
  divider: {
    margin: '20px 0',
    borderColor: '#f0f0f0'
  },
  orderSummary: {
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  },
  orderId: {
    color: '#595959',
    fontSize: '13px',
    marginBottom: '12px'
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '8px'
  },
  totalAmount: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  amount: {
    color: '#1a1a1a',
    margin: 0,
    fontWeight: 600
  },
  paymentMethods: {
    marginBottom: '24px'
  },
  methodTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    overflowX: 'auto',
    paddingBottom: '4px'
  },
  methodTab: {
    flex: 1,
    borderRadius: '8px',
    fontWeight: 500
  },
  paymentForm: {
    marginTop: '16px'
  },
  inputLabel: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px'
  },
  upiInput: {
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '12px',
    transition: 'all 0.3s'
  },
  cardInput: {
    borderRadius: '8px',
    padding: '12px 16px',
    transition: 'all 0.3s'
  },
  upiApps: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px'
  },
  upiApp: {
    flex: 1,
    textAlign: 'center'
  },
  upiAppIcon: {
    borderRadius: '6px',
    padding: '6px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 500
  },
  statusAlert: {
    borderRadius: '8px',
    marginBottom: '24px',
    border: 'none'
  },
  statusMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusIcon: {
    fontSize: '20px'
  },
  timerText: {
    display: 'block',
    marginTop: '4px',
    fontSize: '13px'
  },
  payButton: {
    height: '48px',
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #1890ff, #096dd9)'
  },
  securityInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#8c8c8c',
    fontSize: '13px',
    justifyContent: 'center',
    textAlign: 'center'
  },
  securityIcon: {
    color: '#52c41a'
  }
};

export default UPIPaymentPage;