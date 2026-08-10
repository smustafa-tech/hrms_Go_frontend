import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';

const SettingsTest = () => {
  const { 
    notificationSettings, 
    securitySettings, 
    setNotificationSettings,
    setSecuritySettings 
  } = useSettingsStore();

  const testNotifications = () => {
    console.log('Current notification settings:', notificationSettings);
    setNotificationSettings({
      ...notificationSettings,
      emailNotifications: !notificationSettings.emailNotifications
    });
  };

  const testSecurity = () => {
    console.log('Current security settings:', securitySettings);
    setSecuritySettings({
      ...securitySettings,
      twoFactorAuth: !securitySettings.twoFactorAuth
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Settings Test Component</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Notification Settings</h4>
        <pre>{JSON.stringify(notificationSettings, null, 2)}</pre>
        <button onClick={testNotifications}>Toggle Email Notifications</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Security Settings</h4>
        <pre>{JSON.stringify(securitySettings, null, 2)}</pre>
        <button onClick={testSecurity}>Toggle 2FA</button>
      </div>
    </div>
  );
};

export default SettingsTest;