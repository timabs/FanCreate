import React from "react";
import { Form, Input, Button } from "antd";
import "./ContactPage.css";

const ContactForm = () => {
  const [form] = Form.useForm();
  const onFinish = (formData) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://portfolio-backend-zlwq.onrender.com/form");

    xhr.setRequestHeader("content-type", "application/json");
    xhr.onload = function () {
      if (xhr.responseText === "success") {
        form.resetFields();
      } else {
        alert("Something went wrong!");
      }
    };
    xhr.send(JSON.stringify(formData));
  };

  return (
    <Form onFinish={onFinish} form={form}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item
        name="content"
        rules={[{ required: true, message: "Please input your message!" }]}
      >
        <Input.TextArea rows={4} placeholder="Message" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ContactForm;
