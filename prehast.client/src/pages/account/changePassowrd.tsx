import { Button, Col, Form, Input, Row, Typography } from "antd";
import { resetPass } from '../../Interfaces/GeneralInterface';
import { useForm } from "antd/es/form/Form";
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useNavigate } from 'react-router-dom';
import axios from "../../api";
import Loading from "./compontents/loading";
import { useState } from "react";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";

const { Title, Text } = Typography;

const ChangePassword = () => {
    const navigate = useNavigate();
    const [form] = useForm<resetPass>();
    const { loading, loginResponse } = useSelector((state: RootState) => state.auth);
    const [error, setError] = useState<boolean>(false);

    const onfinish = (values: resetPass) => {
        values.token = loginResponse.token;
        axios.post(`/Account/PasswordNew`, values)
            .then(res => {

                if (res.data.length === 0) {
                    navigate('/login');
                    setError(false);
                }
                else
                    setError(true);
            })

    };

    return (
        <div style={{ background: 'linear-gradient(to right, #8e9eab, #eef2f3)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px' }}>
            {loading && <Loading />}
            <Row style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '30px 20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                <Col span={24}>
                    <Title level={2} style={{ color: "#ac70e4", fontFamily: 'Amiri-Bold', marginBottom: '20px' }}>PRE HAST SYSTEM</Title>
                    <Text style={{ fontSize: '16px', color: '#555', fontFamily: 'Amiri-Bold', marginBottom: '20px', display: 'block' }}>YOU MUST CHANGE PASSWORD TO CONTINUE</Text>
                    {error && (
                        <Row className="w-100 d-flex justify-content-center">
                            <div style={{ width: '100%', fontWeight: 900 }}>
                                <h4 className="text-danger bold">Weak Password</h4>
                                <ul className="w-100">
                                    <li className="text-danger bold">Must include uppercase and lowercase letters</li>
                                    <li className="text-danger bold">Must include numbers</li>
                                    <li className="text-danger bold">Must include special characters</li>
                                    <li className="text-danger bold">Cannot contain the word "Password" or any part of it</li>
                                </ul>
                            </div>
                        </Row>
                    )}

                    <Form
                        form={form}
                        name="trigger"
                        layout="vertical"
                        onFinish={onfinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[{ required: true, message: 'Enter New Password' }]}
                        >
                            <Input.Password size="large" prefix={<LockOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm new password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Enter  Confirm New Password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('كلمتا المرور غير متطابقتين'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" prefix={<LockOutlined />} />
                        </Form.Item>

                        <Form.Item<resetPass>
                            label="user"
                            name="token"
                            hidden
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: 'lightskyblue', borderColor: 'lightskyblue', fontFamily: 'Amiri-Bold' }}>
                                Change Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default ChangePassword;
