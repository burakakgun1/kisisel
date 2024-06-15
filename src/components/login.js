import React from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";

const Login = ({ onOk }) => {
  const onFinish = (values) => {
    // API'ye GET isteği göndererek kullanıcıları al
    axios({
      method: "get",
      url:
        "https://v1.nocodeapi.com/burakakgun/google_sheets/XLNzAUdGuVXdwxuJ?tabId=sayfa1",
    })
      .then((response) => {
        const users = response.data.data;

        // Kullanıcı doğrulaması
        const user = users.find(
          (user) => user.Mail === values.email && user.Sifre === values.password
        );

        if (user) {
          // Başarı durumunda onOk fonksiyonunu çağır ve kullanıcı bilgilerini geçir
          onOk({
            Kullanici_Ad: user.Kullanici_Ad,
            Kullanici_Soyad: user.Kullanici_Soyad,
          });
        } else {
          // Hata mesajı göster
          message.error("Geçersiz email veya şifre. Lütfen tekrar deneyin.");
        }
      })
      .catch((error) => {
        console.error("Hata:", error);
        message.error("Giriş yapılamadı. Email ve şifrenizi kontrol edin.");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Başarısız:", errorInfo);
    message.error("Lütfen tüm zorunlu alanları doldurun.");
  };

  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Lütfen emailinizi girin!" },
          { type: "email", message: "Geçerli bir email girin!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Şifre"
        name="password"
        rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Giriş Yap
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
