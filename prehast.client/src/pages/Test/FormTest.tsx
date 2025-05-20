
import { Alert, Button, Col, Form, Input, InputNumber, Row, Switch, Modal } from "antd";
import { IForm } from "./CreateUpdate";
import { useSelector } from "react-redux";
import {   RootState } from "../../../app/store";
import { useCallback, useEffect, useState } from "react";
import { produce } from "immer"
import { KontrollVard, ManyAnswers, PatientKotrollCreate } from "../../Interfaces/GeneralInterface";
import axios from "../../api";
import { PlusIcon } from "lucide-react";
import Search from "antd/lib/input/Search";
import { RULES } from "../../Interfaces/roles";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
 
const { confirm } = Modal;
const FormTest = ({ form, onFinish, record }: IForm) => {
    const { userRoles } = useSelector((state: RootState) => state.auth.loginResponse);
    const navigate = useNavigate();
    const Nurses: boolean = userRoles?.includes(RULES.Nurses);

    const { message } = useSelector((state: RootState) => state.craud);
    const [formData, setFormData] = useState<PatientKotrollCreate>({} as PatientKotrollCreate);
    const [vards, setVards] = useState<KontrollVard[]>([]);
    const [vardsFilter, setVardsFilter] = useState<KontrollVard[]>([]);
    //const { postState } = useSelector((state: RootState) => state.modal);
   // const dispatch = useDispatch<AppDispatch>();
    const [svarSum, setSvarSum] = useState<number>(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [isModalOpen3, setIsModalOpen3] = useState(false);
     

    useEffect(() => {
        setFormData(record);
        setSvarSum(record.sumSvar)
    }, [record]);

    useEffect(() => {
        form.setFieldsValue(formData)
        console.log(formData)
    }, [form, formData])

    useEffect(() => {
        axios.get(`Kontrolls/GetVards`)
            .then((res) => {
                setVards(res.data)
                setVardsFilter(res.data) 
            })

    }, [])


    const getDegreeColor = (degree: number): string => {
        if (degree >= 10 && degree <= 50)
            return " degree-3";
        if (degree >= 6 && degree <= 10)
            return "  degree-2";

        return " degree-1";
    }

    const ComputeSumSvar = useCallback((): number => {
        let sum = 0;
        formData?.fragors?.forEach(item => {
            if (item.hasLeftRight) {
                item.manyAnswers.forEach(subsvar => {
                    const svarLeft = item.svars.find((svar) => svar.id === subsvar.svarAnswerLeft);
                    const svarRight = item.svars.find((svar) => svar.id === subsvar.svarAnswerRight);
                    if (svarLeft)
                        sum += svarLeft.degree;
                    if (svarRight)
                        sum += svarRight.degree;
                });
            }
            else {
                const svarItem = item.svars.find((svar) => svar.id === item.svarAnswerLeft);
                if (svarItem) {
                    sum += svarItem.degree;
                }
            }

        })

        return sum;

    }, [formData.fragors]);

    useEffect(() => {
        setSvarSum(ComputeSumSvar);
    }, [ComputeSumSvar, form, formData])

    const handleOptionChange = (id: number, selectedOption: number, hasLeftRight: boolean, left: boolean) => {
     

        setFormData((currentFormData) =>
            produce(currentFormData, (draft) => {
                const formItem = draft.fragors.find((item) => item.id === id);
                if (formItem) {
                   
                    if (hasLeftRight) {
                        
                            if (left) {
                                const subLeft = formItem.manyAnswers.find((subitem) => subitem.svarAnswerLeft == selectedOption);
                                if (subLeft) {
                                    subLeft.svarAnswerLeft = selectedOption;
                                } else {
                                    const subRight = formItem.manyAnswers.find((subitem) => subitem.svarAnswerRight == selectedOption);
                                    if (subRight) {
                                        subRight.svarAnswerLeft = selectedOption;
                                    }
                                    else {

                                        const answer = {
                                            svarAnswerLeft: selectedOption,
                                            svarAnswerRight: 0
                                        } as ManyAnswers;

                                        formItem.manyAnswers.push(answer);
                                    }
                                }

                                formItem.manyAnswers.forEach(i => {
                                    if (i.svarAnswerLeft !== selectedOption)
                                        i.svarAnswerLeft = 0;
                                });
                            }
                        
                        else {

                            const subRight = formItem.manyAnswers.find((subitem) => subitem.svarAnswerRight == selectedOption);
                            if (subRight) {
                                subRight.svarAnswerRight = selectedOption;
                            }
                            else {
                                const subLeft = formItem.manyAnswers.find((subitem) => subitem.svarAnswerLeft == selectedOption);
                                if (subLeft) {
                                    subLeft.svarAnswerRight = selectedOption;
                                }
                                else {
                                    const answer = {
                                        svarAnswerLeft: 0,
                                        svarAnswerRight: selectedOption
                                    } as ManyAnswers;

                                    formItem.manyAnswers.push(answer);
                                }
                            }
                        }
                        formItem.manyAnswers.forEach(i => {
                            if (i.svarAnswerRight!==selectedOption)
                                i.svarAnswerRight = 0;
                        });

                      formItem.manyAnswers = formItem.manyAnswers.filter((item) => !shouldRemove(item));

                    }
                    else {
                        formItem.svarAnswerLeft = selectedOption;
                        formItem.svarAnswerRight = 0;
                    }


                }

                draft.sumSvar = ComputeSumSvar();
            })
        );
       
    };

    const handleSubmit = () => {
        const sum: number = ComputeSumSvar();
        setSvarSum(sum);
        form.setFieldValue("sent", false);
        form.setFieldValue("sumSvar", svarSum);
       // const data = form.getFieldsValue();
        setIsModalOpen(true);
         
        
    };

    const saveData = (sent:boolean) => {
        // Perform form submission
        form.setFieldValue("sent", sent);
        form.setFieldValue("sumSvar", svarSum);
        const data = form.getFieldsValue();

        if (sent) {
            setIsModalOpen3(sent);


        }
        else {
              onFinish(data);
              setIsModalOpen(false);
        }
      
    };

    const cancelSubmit = () => {
        setIsModalOpen(false); // Close modal without submitting
    };
    const cancelSent = () => {
        setIsModalOpen3(false); // Close modal without submitting
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredItems: KontrollVard[] = vards.filter(item =>
            item.rsid.toString().toLowerCase().includes(event.target.value.toLowerCase()) || item.vardName.toLowerCase().includes(event.target.value.toLowerCase())
        );

        setVardsFilter(filteredItems)
    };
    const SentAndSave = (vard: KontrollVard)=>{
        confirm({
            title: `Do you want sent Report To ${vard.vardOmfiting} : ${ vard.vardName}`,
            content: `Report Degree is : ${svarSum}`,
            onOk() {
                form.setFieldValue("vardToSent", vard.vardId);
                form.setFieldValue("sent", true);
                form.setFieldValue("sumSvar", svarSum);
                const data = form.getFieldsValue();
                onFinish(data);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
 
    const shouldRemove = (item: ManyAnswers) => item.svarAnswerLeft === 0 && item.svarAnswerRight === 0;


    const handleBack = () => {
        navigate(-1)
    }
    return (
        formData.patientData ?
            <Row className="kontroll-test p-0 m-0">
                <Col span={24}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="link"
                        onClick={handleBack}
                        style={{ paddingLeft: 0, marginBottom: '12px' }}
                    >
                        Back
                    </Button>
                    {formData.id == 0 ?
                       <Row className="w-100 p-0 m-0">
                        <Col span={24} className="d-flex justify-content-between card-1">
                            <Row className="w-100">
                                <Col span={12}>
                                    <p className="person-number">{formData.patientData.personNummer}</p>
                                    <p className="person-name-1">{formData.patientData.name}</p>
                                </Col>
                                <Col span={12} className="">
                                    <p className="person-date">{formData.date}</p>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                        : 
                        <Row className="w-100 p-0 m-0">
                            <Col span={24} className="d-flex justify-content-between card-2">
                                        <span className="person-number">{formData.patientData.personNummer}</span>
                                        <span className="person-name">{formData.patientData.name}</span>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col span={24} className="form-container">
                            <div style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                                {formData.id == 0 ? <div className="vard-info-container">
                                    <p className="vard-info">
                                        {formData.vardData?.vardOmfatning} / {formData.vardData?.vardName}
                                    </p>
                                </div> : null}
                                <Form className="form-test" form={form} initialValues={formData} name="trigger" onFinish={onFinish} autoComplete="off" layout="vertical">
                                    {message.length > 0 && (
                                        <Row className="m-1">
                                            <Col span={24}>
                                                {formData.id > 0 ? <Alert type="info" message={message} /> : <Alert type="success" message={message} />}
                                            </Col>
                                        </Row>
                                    )}

                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                hidden
                                                name='id'
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name='vardToSent'
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name='sumSvar'
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name='sent'
                                                valuePropName="checked"
                                            >
                                                <Switch/>
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name={['patientData', 'id']}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name={['patientData', 'name']}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name={['patientData', 'personNummer']}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24}>
                                            <Form.Item
                                                hidden
                                                name={['vardData', 'vardId']}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name={['vardData', 'vardOmfatning']}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                hidden
                                                name={['vardData', 'vardName']}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                        </Col>

                                        <Col span={24}>
                                            <Form.List name={['fragors']}  >
                                                {(fields) => (
                                                    <Row className="w-100 p-3" style={{ borderRadius: "12px" }}>
                                                        <Col span={24}>
                                                            <Row>
                                                                <Col span={24}>
                                                                    {fields.map(({ key, name }) => (
                                                                        <Row key={key} className="p-0 m-0 d-flex justify-content-between  mb-5">
                                                                            <Col>
                                                                                <Form.Item
                                                                                    hidden
                                                                                    name={[name, 'id']}
                                                                                >
                                                                                    <InputNumber />
                                                                                </Form.Item>
                                                                                <Form.Item
                                                                                    hidden
                                                                                    name={[name, 'name']}
                                                                                >
                                                                                    <Input />
                                                                                </Form.Item>
                                                                                <Form.Item
                                                                                    hidden
                                                                                    name={[name, 'description']}
                                                                                >
                                                                                    <Input />
                                                                                </Form.Item>
                                                                            </Col>
                                                                            <Col span={24}>
                                                                                {
                                                                                    <div className="fragor-container">
                                                                                        <p className="fragor-name">
                                                                                            {name + 1}.{formData.fragors[name].name}
                                                                                        </p>
                                                                                        <p className="fragor-description">
                                                                                            ({formData.fragors[name].description})
                                                                                        </p>
                                                                                    </div>
                                                                                }
                                                                            </Col>
                                                                            <Col span={24} style={{ marginTop: '-5px' }}>

                                                                                {formData.fragors[name].svars?.map((option, index) => (
                                                                                    <div key={index} className="labels-radio-container">
                                                                                        {formData.fragors[name].hasLeftRight ?
                                                                                            <div className="labels-radio-sub-1">
                                                                                                {option.degree} - {option.name}
                                                                                                <div className="labels-radio-sub-2">
                                                                                                    <label style={{ display: 'flex', flexDirection: 'column', fontSize: '10px' }}>

                                                                                                        <input
                                                                                                            type="radio"
                                                                                                            name={`left-${name}-${Math.random()}`}
                                                                                                            value={option.id}
                                                                                                            checked={formData.fragors[name].manyAnswers.some((item) => item.svarAnswerLeft === option.id)}
                                                                                                            onChange={() => Nurses? handleOptionChange(formData.fragors[name].id, option.id, formData.fragors[name].hasLeftRight, true):null}
                                                                                                            //onClick={(e) => handleOptionClick(formData.fragors[name].id, option.id, true,true, e) }
                                                                                                        />
                                                                                                    </label>
                                                                                                    <label style={{ display: 'flex', flexDirection: 'column', fontSize: '10px' }}>

                                                                                                        <input
                                                                                                            type="radio"
                                                                                                            name={`right-${name}-${Math.random()}`}
                                                                                                            value={option.id}
                                                                                                            checked={formData.fragors[name].manyAnswers.some((item) => item.svarAnswerRight === option.id)}
                                                                                                            onChange={() => Nurses?handleOptionChange(formData.fragors[name].id, option.id, formData.fragors[name].hasLeftRight, false):null}
                                                                                                            //onClick={(e) => handleOptionClick(formData.fragors[name].id, option.id, true, false, e)}
                                                                                                        />
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                            :
                                                                                            <div className="labels-radio-sub-1">
                                                                                                {option.degree} - {option.name}
                                                                                                <div className="labels-radio-sub-2">
                                                                                                    <label>

                                                                                                        <input
                                                                                                            type="radio"
                                                                                                            name={`left-2-${name}-${Math.random()}`}
                                                                                                            value={option.id}
                                                                                                            checked={formData.fragors[name].svarAnswerLeft === option.id}
                                                                                                            onChange={() => Nurses?handleOptionChange(formData.fragors[name].id, option.id, formData.fragors[name].hasLeftRight, true):null}
                                                                                                        />
                                                                                                    </label>
                                                                                                </div>
                                                                                            </div>
                                                                                        }



                                                                                    </div>
                                                                                ))
                                                                                }

                                                                            </Col>
                                                                        </Row>
                                                                    ))}
                                                                </Col>
                                                            </Row>

                                                        </Col>

                                                    </Row>

                                                )}
                                            </Form.List>
                                        </Col>


                                    </Row>
                                    {formData.id > 0 ?
                                    <Row className="">
                                            <div className="test-history-container-2">
                                                <div>
                                                <p className="vard-name">{formData.vardData.vardOmfatning}:{formData.vardData.vardName}</p>
                                                <p className="test-date">{formData.date}</p>
                                                </div>
                                                <div
                                                    className={`test-degree ${getDegreeColor(svarSum)}`}
                                                > {svarSum}</div>
                                            </div>
                                    </Row> : null}
                                </Form>
                                <Col span={24} className="text-center">
                                    {Nurses ? <Button onClick={handleSubmit} className="control-btn ">  AVSLUTA </Button>
                                        : <Button onClick={handleBack} className="control-btn ">  Back </Button>
                                }
                                </Col>
                            </div>
                        </Col>
                    </Row>
                </Col>
                {isModalOpen && (
                    <div className="model-save">
                        <div className="card">
                            <div className="close-icon" onClick={cancelSubmit }>X</div>
                            <div   className={`number ${getDegreeColor(svarSum) }`}> {svarSum} </div>
                            <div className="text">
                               Confirm saving the data and send a copy
                             </div>
                            <div className="button-container">
                                <button className="save-button"
                                    onClick={()=>saveData(false) }

                                >
                                    <PlusIcon style={{color:'green'}} />
                                    SPARA</button>
                                <button className="send-button"
                                    onClick={()=>saveData(true) }
                                >SKICKA</button>
                            </div>
                        </div>
                    </div>
                )}
                {/*{isModalOpen2 && (*/}
                {/*    <div className="model-save">*/}
                {/*        <div className="card">*/}
                            
                {/*            <div className="number-1">*/}
                {/*                <CheckOutlined />*/}
                {/*            </div>*/}
                {/*            <div className="text-1">*/}
                {/*                Skickad*/}
                {/*             </div>*/}
                          
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
                {isModalOpen3 && (
                    <div className="model-save-3">
                        <div className="card-3">
                            <div className="close-icon" onClick={cancelSent}>X</div>
                            
                            <Row className="card-3-search">
                                <Col span={24}>
                                    <Search
                                        placeholder="Forskning..."
                                        onChange={(e) => handleSearch(e)}
                                        
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20} className="m-3 d-flex">
                                <span className="">Valj Lakara...</span>
                                </Col>
                            </Row>
                            {vardsFilter?.length !== 0 ? <div className="text">
                                {vardsFilter?.map((vard, index) =>
                                    <div className="vard-kontroll-container" key={`vard-container-${index}`} onClick={()=>SentAndSave(vard) }>
                                        <span className="rsid">RSID: {vard.rsid.split('@')[0]}</span>
                                        <span className="vard-k-name">{vard.vardOmfiting}: {vard.vardName}</span>
                                        <span className="vard-status" style={vard.vardIsActive ? { backgroundColor: 'green' } : { backgroundColor: 'red' }}></span>

                                    </div>

                                )}
                            </div> : null}

                        </div>
                    </div>
                )}
            </Row>
            : <h1>Loading.....</h1>
    );
}

export default FormTest;