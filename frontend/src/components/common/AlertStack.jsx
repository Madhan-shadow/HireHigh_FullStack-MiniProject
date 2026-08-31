import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeAlert } from '../../store/slices/alertSlice';

const classFor = (type) => {
  if (type === 'error') return 'error-banner';
  if (type === 'warning') return 'warning-banner';
  return 'success-banner';
};

// Mounted once in App.js. Renders every active alert; each one schedules
// its own 3000ms dismissal, so several alerts can be visible and expiring
// independently — this is the literal "alert stack" the SRS describes.
const AlertStack = () => {
  const alerts = useSelector((state) => state.alerts.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const timers = alerts.map((a) => setTimeout(() => dispatch(removeAlert(a.id)), 3000));
    return () => timers.forEach(clearTimeout);
  }, [alerts, dispatch]);

  if (alerts.length === 0) return null;

  return (
    <div className="alert-stack">
      {alerts.map((a) => (
        <div key={a.id} className={classFor(a.type)}>
          {a.message}
        </div>
      ))}
    </div>
  );
};

export default AlertStack;