import { Alert, Checkbox, Col, Form, Input, InputNumber, Row } from "antd";
import { IForm } from "./createUpdate";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import CustomButton from "../account/compontents/customButton";

function NewsForm({ form, onFinish, record }: IForm) {
    const { message } = useSelector((state: RootState) => state.craud);
    const [can, setCan] = useState<boolean>(false);

    const canChange = (e: CheckboxChangeEvent) => {
        setCan(e.target.checked);
    };

    useEffect(() => {
        if (record.id === 0) {
            form.resetFields();
            setCan(false);
        } else {
            form.setFieldsValue(record);
            setCan(record.can);
        }
    }, [form, record]);

    return (
        <div style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <Form form={form} initialValues={record} name="trigger" onFinish={onFinish} autoComplete="off" layout="vertical">
                {message.length > 0 && (
                    <Row className="m-1">
                        <Col span={24}>
                            {record.id > 0 ? <Alert type="info" message={message} /> : <Alert type="success" message={message} />}
                        </Col>
                    </Row>
                )}

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item hidden name="id">
                            <InputNumber />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item hidden name="applicationUserId">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Details"
                            name="details"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: 'Please Add Details' }]}
                        >
                            <TextArea rows={6} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Show News"
                            name="can"
                            valuePropName="checked"
                            validateTrigger="onBlur"
                        >
                            <Checkbox onChange={canChange}>
                                {can ? <span><CheckOutlined style={{ fontSize: '22px', color: 'green' }} /> Yes </span> : <span><CloseOutlined style={{ fontSize: '22px', color: 'red' }} /> No </span>}
                            </Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item hidden name="canAll" valuePropName="checked">
                            <Input type="checkbox" />
                        </Form.Item>
                    </Col>
                    <Col span={24} className="text-center">
                        <CustomButton flag={record.id>0?2:1} />
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default NewsForm;
