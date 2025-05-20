import { Button, Col, Form, Input, Row, Typography, Alert } from "antd";
import { ILoginResponse, LoginDto } from '../../Interfaces/GeneralInterface';
import { useForm } from "antd/es/form/Form";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { LoginAsync, NotLogin } from '../../../app/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import Loading from "./compontents/loading";
 
const { Title, Text } = Typography;

const Login = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [form] = useForm<LoginDto>();
    const [loginResponse, setloginResponse] = useState<ILoginResponse>({} as ILoginResponse);
    
    const { loading } = useSelector((state: RootState) => state.auth);

    const onFinish = async (values: LoginDto) => {
        try {
            const resultAction = await dispatch(LoginAsync(values));

            if (LoginAsync.fulfilled.match(resultAction)) {
                const loginData = resultAction.payload;
                setloginResponse(loginData);

                if (loginData.loginStatus) {
                    navigate('/');
                } else {
                    dispatch(NotLogin());
                }
            } else {
                // Login failed or rejected
                setloginResponse({} as ILoginResponse);
                dispatch(NotLogin());
            }
        } catch (error) {
            console.error("Login error:", error);
            setloginResponse({} as ILoginResponse);
            dispatch(NotLogin());
        }
    };

    return (
        <div style={{ background: 'linear-gradient(to right, #f8f9fa, #e0e0e0)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading && <Loading />}
            <Row style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                <Col span={24}>
                    <Title level={2} style={{ color: "#de1111 ", fontFamily: 'Amiri-Bold' }}>PREHAST SYSTEM</Title>
                    <Text style={{ fontSize: '16px', color: '#555', fontFamily: 'Amiri-Bold' }}>YOU MUST LOGIN TO CONTINUE</Text>
                    {loginResponse?.message?.length > 10 && <Alert message={loginResponse.message} type="error" showIcon style={{ margin: '10px 0' }} />}
                    <Form
                        form={form}
                        name="login"
                        layout="vertical"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                        style={{ marginTop: '20px' }}
                    >
                        <Form.Item<LoginDto>
                            label="Rsid"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Rsid Requierd',
                                },
                                {
                                    pattern: new RegExp(/^[A-Za-z0-9._%+-]+@liv\.com$/),
                                    message: 'Rsid Must Contains  liv.com@',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<LoginDto>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Password Requierd ' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: "#de1111 ", borderColor: "#72BF78", fontFamily: 'Amiri-Bold' }}>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
