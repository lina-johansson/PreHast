import { Alert, Button, Col, Form, Input, InputNumber, Row, Switch } from "antd";
import { IForm } from "./createUpdate";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import CustomButton from "../account/compontents/customButton";

function FormComponent({ form, onFinish, record }: IForm) {
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
                            label="Fragor"
                            name="name"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: 'Enter Fragor Name' }]}
                        >
                            <Input  placeholder="Fragor" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: 'Enter Fragor description' }]}
                        >
                            <TextArea placeholder="Description" style={{ resize: 'none' }} rows={3} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Fragor Sort"
                            name="sort"
                            validateTrigger="onBlur"
                            rules={[{ required: true, message: 'Enter Fragor Sort' }]}
                        >
                            <InputNumber placeholder="Fragor Sort" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="hasLeftRight"
                            valuePropName="checked"
                            style={{ minWidth: '100%' }}
                            validateTrigger="onBlur"
                            hasFeedback
                        >
                            <Switch checkedChildren="Has To Side" unCheckedChildren="Has One Side" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <p className="svar-title">Svars</p>
                        <Form.List name="svarsCrudDto" >
                            {(fields, { add, remove }) => (
                                <Row className="w-100 p-3" style={{ backgroundColor: "#FAF6F0", borderRadius: "12px" }}>
                                    <Col span={24}>
                                        <Row>
                                            <Col span={24}>
                                                {fields.map(({ key, name }) => (
                                                    <Row key={key} className="p-0 m-0 d-flex justify-content-between border-bottom mb-2">

                                                        <Form.Item
                                                            hidden
                                                            hasFeedback
                                                            name={[name, 'id']}
                                                        >
                                                            <InputNumber />
                                                        </Form.Item>
                                                        <Col span={24}>
                                                            <Form.Item
                                                                name={[name, 'name']}
                                                                rules={[{ required: true, message: 'Enter Svar ' }]}
                                                            >
                                                                <Input className="w-100" placeholder="Svar" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Form.Item
                                                                name={[name, 'description']}
                                                             >
                                                                <TextArea className="w-100" placeholder="Svar description" style={{ resize: 'none' }} rows={3} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Row className="p-0 m-0 d-flex justify-content-between border-bottom">
                                                                <Col span={6}>
                                                                    <Form.Item
                                                                        name={[name, 'degree']}
                                                                        rules={[{ required: true, message: 'Enter Svar degree' }]}
                                                                    >
                                                                        <InputNumber className="w-100" placeholder="Svar degree" />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={6}>
                                                                    <Form.Item
                                                                        name={[name, 'sort']}
                                                                        rules={[{ required: true, message: 'Enter Svar sort' }]}
                                                                    >
                                                                        <InputNumber className="w-100" placeholder="Svar sort" />
                                                                    </Form.Item>
                                                                </Col>
                                                             
                                                                <Col span={2}>
                                                                    {name > 0 && <MinusCircleOutlined className="text-danger btn-remove" onClick={() => remove(name)} />}
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                       
                                                    </Row>
                                                ))}
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col span={24}>
                                        <Form.Item className="w-100 p-4 pt-0 pb-0" style={{ marginRight: '-10px' }}>
                                            <Button type="dashed" className="btn btn-sm btn-light" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Add Svar
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Form.List>
                    </Col>
                    <Col span={24} className="text-center">
                        <CustomButton flag={record.id===0?1:2} />
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default FormComponent;
