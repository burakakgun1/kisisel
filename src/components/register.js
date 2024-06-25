import React, { useState } from "react";
import { Form, Input, message, Button } from "antd";
import axios from "axios";
import "./register.css";

const Register = ({ onOk }) => {
  const [formData, setFormData] = useState({
    Kullanici_Ad: "",
    Kullanici_Soyad: "",
    Sifre: "",
    Mail: "",
  });

  const addData = () => {
    axios({
      method: "post",
      url:
        "https://v1.nocodeapi.com/yedek/google_sheets/FPFQuKqADSzNJUyD?tabId=sayfa1",
      data: [Object.values(formData)],
    })
      .then((response) => {
        // Kayıt başarılı
        message.success("Kayıt başarılı");
        onOk(); // Modalı kapat
        setFormData({
          Kullanici_Ad: "",
          Kullanici_Soyad: "",
          Sifre: "",
          Mail: "",
        });
      })
      .catch((error) => {
        // Kayıt başarısız
        message.error("Kayıt başarısız");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Kayıt Ol</h2>
      <Form
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={addData}
        autoComplete="off"
      >
        <Form.Item
          className="form-item"
          label="Kullanıcı Adı"
          name="Kullanici_Ad"
          rules={[
            { required: true, message: "Lütfen kullanıcı adınızı giriniz!" },
            {
              pattern: /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/,
              message: "Kullanıcı adınız sadece harflerden oluşmalıdır!",
            },
          ]}
        >
          <Input
            name="Kullanici_Ad"
            value={formData.Kullanici_Ad}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          className="form-item"
          label="Kullanıcı Soyadı"
          name="Kullanici_Soyad"
          rules={[
            { required: true, message: "Lütfen kullanıcı soyadınızı giriniz!" },
            {
              pattern: /^[A-Za-zğüşöçıİĞÜŞÖÇ\s]+$/,
              message: "Kullanıcı soyadınız sadece harflerden oluşmalıdır!",
            },
          ]}
        >
          <Input
            name="Kullanici_Soyad"
            value={formData.Kullanici_Soyad}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          className="form-item"
          label="Şifre"
          name="Sifre"
          rules={[
            { required: true, message: "Lütfen şifrenizi giriniz!" },
            { min: 6, message: "Şifreniz en az 6 karakter olmalıdır!" },
          ]}
        >
          <Input.Password
            name="Sifre"
            value={formData.Sifre}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          className="form-item"
          label="Mail Adresi"
          name="Mail"
          rules={[
            {
              type: "email",
              message: "Lütfen geçerli bir email adresi giriniz!",
            },
            { required: true, message: "Lütfen email adresinizi giriniz!" },
          ]}
        >
          <Input
            name="Mail"
            value={formData.Mail}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item className="form-item">
          <Button className="submit-button" type="primary" htmlType="submit">
            Kayıt Ol
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
