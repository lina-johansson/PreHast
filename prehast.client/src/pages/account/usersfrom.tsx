/* eslint-disable @typescript-eslint/no-unused-vars */

import { Alert,  Col, Form, Input,  Row, Select, Switch, } from "antd";
import { IForm } from "./createUpdate";

import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";


import { useEffect, useState } from "react";

import axios from "../../api";
import {KeyValue, } from "../../Interfaces/GeneralInterface";
import { validateArabicName, validateArabicPosition } from "../validate";
import CustomButton from "./compontents/customButton";
import Password from "antd/es/input/Password";

function Usersform({ form, onFinish, record }: IForm) {
    const { message } = useSelector((state: RootState) => state.craud)

    const [Omfatnings, setOmfatnings] = useState();
 

    const [Departments, setDepartments] = useState<KeyValue[]>([]);

    const GetSpiAutoComplete = () => {
        axios.get('Account/Departments').then(res => setDepartments(res.data))
    }
    useEffect(() => {
        GetSpiAutoComplete();
        GetAllRak();

    }, []);
    const GetAllRak = () => {
        axios.get(`/Account/GetAllOmfatnings`)
            .then(res => setOmfatnings(res.data))

    }

    useEffect(() => {
        
        if (record?.id?.length ==0) {
            form.resetFields();
        }
        else
            form.setFieldsValue(record)
    }, [form, record]);

    return (
        <>
            <Form
                form={form}
                initialValues={record}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
            >
                <Row gutter={[16, 16]}>
                    {message.length > 0 && (
                        <Col span={24}>
                            <Alert
                                type={record.id.length > 0 ? "info" : "success"}
                                message={message}
                            />
                        </Col>
                    )}
                </Row>

                <Row gutter={[24, 24]}>
                    {/* Left: User Details */}
                    <Col xs={24} md={14}>
                        <h4 className="w-100 text-left underline">Users Data</h4>

                        <Form.Item hidden label="ت" name="id">
                            <Input />
                        </Form.Item>

                        <Form.Item
                            hasFeedback
                            label="Department"
                            name="departmentId"
                            validateTrigger="onBlur"
                        >
                            <Select options={Departments} placeholder="Deparments" />
                        </Form.Item>

                        <Form.Item
                            label="Person Number"
                            name="personNo"
                            hasFeedback
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: "Person Number Required" }]}
                        >
                            <Input placeholder="Person Number" />
                        </Form.Item>

                        <Form.Item
                            label="Omfatning"
                            name="omfatningId"
                            hasFeedback
                            validateTrigger="onBlur"
                        >
                            <Select options={Omfatnings} placeholder="Omfatning" />
                        </Form.Item>

                        <Form.Item
                            label="Full Name"
                            name="name"
                            hasFeedback
                            validateTrigger="onBlur"
                            rules={[{ validator: validateArabicName }]}
                        >
                            <Input placeholder="Full Name" />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            hasFeedback
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: "Phone Number Required" }]}
                        >
                            <Input placeholder="*********4" />
                        </Form.Item>

                        <Form.Item
                            label="Rsid"
                            name="email"
                            hasFeedback
                            validateTrigger="onBlur"
                            rules={[
                                { required: true, message: "Rsid Required" },
                                {
                                    pattern: /^[A-Za-z0-9._%+-]+@liv\.com$/,
                                    message: "need liv.com@",
                                },
                            ]}
                        >
                            <Input placeholder="Rsid" />
                        </Form.Item>

                        {record?.id?.length === 0 && (
                            <>
                                <Form.Item label="Password" name="password" hidden>
                                    <Password placeholder="password" />
                                </Form.Item>
                                <Form.Item label="Confirm Password" name="confiremPassword" hidden>
                                    <Password placeholder="Confirm Password" />
                                </Form.Item>
                            </>
                        )}

                        <Form.Item hidden label="Person Position" name="personPosition">
                            <Input placeholder="Person Position" />
                        </Form.Item>

                        <Form.Item>
                            <CustomButton flag={record.id?.toString().length > 0 ? 2 : 1} />
                        </Form.Item>
                    </Col>

                    {/* Right: Roles */}
                    <Col xs={24} md={10}>
                        <div
                            style={{
                                maxHeight: "80vh",
                                overflowY: "auto",
                                padding: "0 8px",
                            }}
                        >
                            <h4 className="w-100 text-center title sticky-top bg-white p-2 z-10 border-b">
                                User Roles
                            </h4>

                            <Form.List name="roles">
                                {(fields) => (
                                    <>
                                        {fields.map((field) => (
                                            <div key={field.key} className="p-2 border-b">
                                                <Form.Item hidden name={[field.name, "roleName"]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item hidden name={[field.name, "roleNameSW"]}>
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item
                                                    name={[field.name, "isSelected"]}
                                                    validateTrigger="onBlur"
                                                    hasFeedback
                                                >
                                                    <Switch
                                                        className="w-100"
                                                        checkedChildren={record.roles[field.name].roleNameSW}
                                                        unCheckedChildren={record.roles[field.name].roleNameSW}
                                                    />
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </div>
                    </Col>
                </Row>
            </Form>

        </>
    )


}

export default Usersform;