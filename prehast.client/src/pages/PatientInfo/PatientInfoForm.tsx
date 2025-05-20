import { Alert,   Col, Form, Input, InputNumber, Row } from "antd";
import { IForm } from "./createUpdate";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
 
import { useEffect } from "react";
import CustomButton from "../account/compontents/customButton";

function PatientInfoForm({ form, onFinish, record }: IForm) {
    const { message } = useSelector((state: RootState) => state.craud);
 

   
    useEffect(() => {
        if (record.id === 0) {
            form.resetFields();
            
        } else {
            form.setFieldsValue(record);
            
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
                        <Form.Item
                            label="Name"
                            name="name"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: 'يرجى إدخال تفاصيل التبليغ' }]}
                        >
                            <Input  placeholder="namehhhhhy" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Personnummer"
                            name="personNummer"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: 'يرجى إدخال تفاصيل التبليغ' }]}
                        >
                            <InputNumber placeholder="namehhhhhy" />
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

export default PatientInfoForm;
