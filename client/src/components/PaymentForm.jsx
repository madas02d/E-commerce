import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { 
  MdCreditCard, 
  MdVisibility, 
  MdVisibilityOff,
  MdCalendarToday,
  MdSecurity
} from 'react-icons/md';
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCcDiscover,
  FaCcPaypal
} from 'react-icons/fa';

const PaymentForm = ({ paymentInfo, setPaymentInfo, errors = {} }) => {
  const [showCvv, setShowCvv] = useState(false);
  const [cardType, setCardType] = useState('visa');
  const [expiryDate, setExpiryDate] = useState(null);

  // Card type detection based on card number
  useEffect(() => {
    const number = paymentInfo.cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) {
      setCardType('visa');
    } else if (number.startsWith('5')) {
      setCardType('mastercard');
    } else if (number.startsWith('3')) {
      setCardType('amex');
    } else if (number.startsWith('6')) {
      setCardType('discover');
    } else {
      setCardType('generic');
    }
  }, [paymentInfo.cardNumber]);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    if (cardType === 'amex') {
      // Amex format: XXXX XXXXXX XXXXX
      for (let i = 0, len = match.length; i < len; i += 4) {
        if (i === 4) {
          parts.push(match.substring(i, i + 6));
          i += 2;
        } else {
          parts.push(match.substring(i, i + 4));
        }
      }
    } else {
      // Standard format: XXXX XXXX XXXX XXXX
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiryDate = (date) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

  // Handle expiry date change
  const handleExpiryDateChange = (date) => {
    setExpiryDate(date);
    if (date) {
      setPaymentInfo({
        ...paymentInfo,
        expiryDate: formatExpiryDate(date)
      });
    }
  };

  // Get card icon based on type
  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <FaCcVisa className="w-8 h-8 text-blue-600" />;
      case 'mastercard':
        return <FaCcMastercard className="w-8 h-8 text-red-600" />;
      case 'amex':
        return <FaCcAmex className="w-8 h-8 text-green-600" />;
      case 'discover':
        return <FaCcDiscover className="w-8 h-8 text-orange-600" />;
      default:
        return <MdCreditCard className="w-8 h-8 text-gray-600" />;
    }
  };

  // Get card background color
  const getCardBgColor = () => {
    switch (cardType) {
      case 'visa':
        return 'bg-gradient-to-br from-blue-500 to-blue-700';
      case 'mastercard':
        return 'bg-gradient-to-br from-red-500 to-red-700';
      case 'amex':
        return 'bg-gradient-to-br from-green-500 to-green-700';
      case 'discover':
        return 'bg-gradient-to-br from-orange-500 to-orange-700';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div className="mb-6">
        <div className={`${getCardBgColor()} rounded-lg p-6 text-white shadow-lg`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              {getCardIcon()}
              <span className="text-sm font-medium opacity-90">Credit Card</span>
            </div>
            <MdSecurity className="w-6 h-6 opacity-80" />
          </div>
          
          <div className="mb-4">
            <p className="text-lg font-mono tracking-wider">
              {paymentInfo.cardNumber || '•••• •••• •••• ••••'}
            </p>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-80 mb-1">Cardholder Name</p>
              <p className="font-medium">
                {paymentInfo.cardName || 'YOUR NAME'}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-80 mb-1">Expires</p>
              <p className="font-medium">
                {paymentInfo.expiryDate || 'MM/YY'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({
              ...paymentInfo,
              cardNumber: formatCardNumber(e.target.value)
            })}
            placeholder="1234 5678 9012 3456"
            className={`w-full p-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={cardType === 'amex' ? 17 : 19}
            required
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {getCardIcon()}
          </div>
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          name="cardName"
          value={paymentInfo.cardName}
          onChange={(e) => setPaymentInfo({
            ...paymentInfo,
            cardName: e.target.value
          })}
          placeholder="JOHN DOE"
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.cardName ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {errors.cardName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
        )}
      </div>

      {/* Expiry Date and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <div className="relative">
            <DatePicker
              selected={expiryDate}
              onChange={handleExpiryDateChange}
              dateFormat="MM/yy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="MM/YY"
              className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.expiryDate ? 'border-red-500' : 'border-gray-300'
              }`}
              minDate={new Date()}
              maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 10))}
            />
            <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          {errors.expiryDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <div className="relative">
            <input
              type={showCvv ? "text" : "password"}
              name="cvv"
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({
                ...paymentInfo,
                cvv: e.target.value.replace(/\D/g, '').slice(0, cardType === 'amex' ? 4 : 3)
              })}
              placeholder={cardType === 'amex' ? "1234" : "123"}
              className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={cardType === 'amex' ? 4 : 3}
              required
            />
            <button
              type="button"
              onClick={() => setShowCvv(!showCvv)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCvv ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
            </button>
          </div>
          {errors.cvv && (
            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <MdSecurity className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Secure Payment</p>
            <p className="text-xs text-blue-600 mt-1">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 