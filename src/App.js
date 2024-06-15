import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import Login from './components/login.js';
import Register from './components/register.js';

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ Kullanici_Ad: '', Kullanici_Soyad: '' });

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const showRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLoginOk = (userData) => {
    setIsLoggedIn(true);
    setUserInfo(userData); // Kullanıcı bilgilerini userInfo'ye ata
    setIsLoginModalOpen(false);
    message.success('Giriş başarılı!');
  };

  const handleRegisterOk = () => {
    setIsRegisterModalOpen(false);
  };

  const handleCancel = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo({ Kullanici_Ad: '', Kullanici_Soyad: '' }); // Kullanıcı çıkış yaptığında userInfo'yi sıfırla
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        {isLoggedIn ? (
          <div>
            <span style={{ marginRight: '10px' }}>
              Hoşgeldiniz , {userInfo?.Kullanici_Ad} {userInfo?.Kullanici_Soyad}
            </span>
            <Button type="primary" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </div>
        ) : (
          <div>
            <Button type="primary" onClick={showLoginModal} style={{ marginRight: '10px' }}>
              Giriş Yap
            </Button>
            <Button type="primary" onClick={showRegisterModal}>
              Kayıt Ol
            </Button>
          </div>
        )}
      </div>
      <Modal
        title="Giriş Yap"
        visible={isLoginModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Login onOk={handleLoginOk} />
      </Modal>
      <Modal
        title="Kayıt Ol"
        visible={isRegisterModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Register onOk={handleRegisterOk} />
      </Modal>
    </>
  );
};

export default App;
