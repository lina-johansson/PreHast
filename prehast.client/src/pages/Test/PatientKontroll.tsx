import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import axios from "../../api";
import { IPatientKotroll, IPatientTest } from "../../Interfaces/GeneralInterface";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const PatientKontroll = () => {
    const [loading, setLoading] = useState(true);
    const [patientKotroll, setPatientKotroll] = useState<IPatientKotroll>({} as IPatientKotroll);
    const { postState } = useSelector((state: RootState) => state.modal);
    const { patienId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`Kontrolls/GetPatientKontroll/${patienId}`)
            .then((res) => {
                setPatientKotroll(res.data);
            })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false)); // Corrected to wait for request to finish
    }, [patienId, postState]);

    const OpenCreateUpdateTest = (id: number) => {
        navigate(`/CreateUpdate/${id}/0`);
    };

    const KontrollPatient = (test: IPatientTest) => {
        navigate(`/CreateUpdate/${patienId}/${test.id}`);
    };

    const getDegreeColor = (degree: number): string => {
        if (degree >= 10 && degree <= 50) return "test-degree degree-3";
        if (degree >= 6 && degree <= 10) return "test-degree degree-2";
        return "test-degree degree-1";
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!patientKotroll.patientData) return <h1>Loading...</h1>;

    return (
        <Row gutter={[16, 16]} style={{ padding: '0px',maxWidth:'100%' }} className="d-flex justify-content-center" >
            <Col span={22}>
                {/* Back Button */}
                <Button
                    icon={<ArrowLeftOutlined />}
                    type="link"
                    onClick={handleBack}
                    style={{ paddingLeft: 0, marginBottom: '12px' }}
                >
                    Back
                </Button>

                {/* Patient Info */}
                <Row>
                    <Col
                        xs={24}
                        className="d-flex justify-content-between align-items-center card-1"
                        style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
                    >
                        <span className="person-number">{patientKotroll.patientData.personNummer}</span>
                        <span className="person-name">{patientKotroll.patientData.name}</span>
                    </Col>
                </Row>

                {/* Control Button */}
                <Row className="">
                    <Col xs={24} className="btn-container" style={{ marginTop: '16px' }}>
                        <Button
                            loading={loading}
                            size="small"
                            className="control-btn"
                            onClick={() => OpenCreateUpdateTest(patientKotroll.patientData.id)}
                        >
                            CONTROL
                        </Button>
                    </Col>

                    {/* Test History */}
                    <Col xs={24}>
                        {patientKotroll.patientTests.length > 0 ? (
                            patientKotroll.patientTests.map((item, index) => (
                                <Row
                                    className="test-history-container test-container-2 cursor-pointer mb-2 p-2 rounded shadow-sm hover:bg-gray-100 d-flex   align-items-center"
                                    key={`test-history-${index}`}
                                    onClick={() => KontrollPatient(item)}
                                >
                                    <Col xs={24} sm={12} className="vard-name text-sm sm:text-base">
                                        {item.vardData.vardOmfatning}:{item.vardData.vardName}
                                    </Col>
                                    <Col xs={12} sm={6} className="test-date text-xs sm:text-sm">
                                        {item.testDate}
                                    </Col>
                                    <Col className={`${getDegreeColor(item.testDegree)} text-right`}>
                                        {item.testDegree}
                                    </Col>
                                </Row>
                            ))
                        ) : (
                            <h4 className="no-data" style={{ textAlign: 'center', color: '#999' }}>
                                No Test Data
                            </h4>
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default PatientKontroll;
