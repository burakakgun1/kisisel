import React, { useState } from "react";
import { Form, Input, message, Button } from "antd";
import axios from "axios";

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
      url: "https://v1.nocodeapi.com/murat123/google_sheets/fYwOtwpoorhIdbbH?tabId=sayfa1",
      data: [Object.values(formData)],
    })
      .then((response) => {
        // Registration successful
        message.success("Registration successful");
        onOk(); // Close modal
        setFormData({
          Kullanici_Ad: "",
          Kullanici_Soyad: "",
          Sifre: "",
          Mail: "",
        });
      })
      .catch((error) => {
        // Registration failed
        message.error("Registration failed");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Form layout="vertical">
      <Form.Item
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
        <Input name="Mail" value={formData.Mail} onChange={handleChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={addData}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;