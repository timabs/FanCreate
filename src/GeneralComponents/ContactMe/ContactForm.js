import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button } from "antd";

import "./ContactPage.css";
import { submitEmail } from "../../redux/admin";
import CustomSpinner from "../../utils/Spinner";

const ContactForm = () => {
  const dispatch = useDispatch();
  const submitLoading = useSelector((state) => state.admin.submitLoading);
  const [form] = Form.useForm();
  const onFinish = async (formData) => {
    await dispatch(submitEmail({ formData: formData }));
    form.resetFields();
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
        <Button
          type="primary"
          htmlType="submit"
          style={{ backgroundColor: "#a457fe" }}
        >
          {submitLoading ? (
            <CustomSpinner
              loadingType={submitLoading}
              style={{
                height: "1rem",
                width: "1rem",
                color: "white !important",
              }}
            />
          ) : (
            "Submit"
          )}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ContactForm;
