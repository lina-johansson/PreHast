import { Button, Col, Typography, Row, Table } from "antd";
import '../../App.css';
import { ListVardPersonal, Role } from "../../Interfaces/GeneralInterface";
import { useEffect, useState } from "react";
import axios from "../../api";
import { CloseModal } from "../../../app/reducers/modalSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

const { Text, Title } = Typography;

const Details = (record: ListVardPersonal) => {
    const [Roles, SetRole] = useState<Role[]>([]);
    const dispatch = useDispatch<AppDispatch>();

    const EnableDesableAccount = () => {
        axios.post(`/Account/LockInOut/${record.id}`).then((res) => {
            if (res.data) {
                dispatch(CloseModal(!res.data));
            }
        });
    };

    const SetPassword1 = () => {
        axios.post(`/Account/ResetPassword/${record.id}`).then((res) => {
            if (res.data) {
                dispatch(CloseModal(!res.data));
            }
        });
    };

    useEffect(() => {
        axios.get(`/Account/GetAllRole?userid=${record.id}`).then((res) => {
            SetRole(res.data);
        });
    }, [record.id]);

    const columns = [
        {
            title: 'User Roles',
            dataIndex: 'roleNameSW',
            key: 'roleNameSW',
        },
    ];

    return (
        <div
            style={{
                padding: '24px',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
        >
            <Row gutter={[24, 24]}>
                {/* Info Column */}
                <Col xs={24} md={12}>
                    <Title level={5}>{record.omfatningName} / {record.name}</Title>
                    <Text strong>Person Position:</Text> <span>{record.personPosition}</span><br />
                    <Text strong>Phone Number:</Text> <span>{record.phoneNumber}</span><br />
                    <Text strong>Rsid:</Text> <Text type="danger">{record.email}</Text><br />
                    <Text strong>Created By:</Text> <span>{record.created_by} on {record.created_date.split('T')[0]}</span><br />
                    <Text strong>Updated By:</Text> <span>{record.updated_by} on {record.updated_date.split('T')[0]}</span><br />
                </Col>

                {/* Roles Table */}
                <Col xs={24} md={12}>
                    <Table
                        dataSource={Roles.filter(i => i.isSelected)}
                        columns={columns}
                        rowKey="roleNameSW"
                        pagination={false}
                        bordered
                        size="small"
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                        }}
                    />
                </Col>

                {/* Action Buttons */}
                <Col xs={24}>
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={24} sm={12} md={6}>
                            <Button
                                type="primary"
                                block
                                className="btn-1"
                                onClick={SetPassword1}
                            >
                                Reset Password
                            </Button>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Button
                                danger={record.lockoutEnabled}
                                type="default"
                                block
                                className={record.lockoutEnabled ? "btn-2" : "btn-3"}
                                onClick={EnableDesableAccount}
                            >
                                {record.lockoutEnabled ? "Enable Account" : "Disable Account"}
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Details;
