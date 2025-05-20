import { useEffect, useState } from "react";
import { DectorTest, IPatientTest, KontrollVard, PatientDto } from "../../Interfaces/GeneralInterface";
import {  useSelector } from "react-redux";
import {  RootState } from "../../../app/store";
import axios from "../../api";
import { Button, Col, List, Row, Skeleton } from "antd";
import Search from "antd/lib/input/Search";
import { useNavigate } from "react-router-dom";
import { RULES } from "../../Interfaces/roles";
import { ArrowLeftOutlined } from "@ant-design/icons";
function ListTest() {
    const [loading, setLoading] = useState(true);
    const [patients, setPatient] = useState<PatientDto[]>([] as PatientDto[]);
    const [patientsFilter, setPatientFilter] = useState<PatientDto[]>([] as PatientDto[]);
    const [patientTest, setPatientTest] = useState<IPatientTest[]>([] as IPatientTest[]);
    const [patientTestFilter, setPatientTestFilter] = useState<IPatientTest[]>([] as IPatientTest[]);
    const [dectorTest, setDectorTest] = useState<DectorTest>({} as DectorTest);
    const [kontrollVard, setKontrollVard] = useState<KontrollVard>({} as KontrollVard);

    const { postState } = useSelector((state: RootState) => state.modal);
    const { userRoles } = useSelector((state: RootState) => state.auth.loginResponse);
    const navigate = useNavigate();
    // const dispatch = useDispatch<AppDispatch>() ;
   // const Admin: boolean = userRoles?.includes(RULES.Admin);
    //const Manager: boolean = userRoles?.includes(RULES.Manager);
    const Doctors: boolean = userRoles?.includes(RULES.Doctors);
    const Nurses: boolean = userRoles?.includes(RULES.Nurses);

    useEffect(() => {
        axios.get(`Kontrolls`)
            .then((res) => {
                setPatient(res.data);
                setPatientFilter(res.data);
            })
            .catch(error => console.log(error))
        setLoading(false);

    }, [postState]);


    useEffect(() => {

        axios.get(`Kontrolls/GetDoctorTests`)
            .then((res) => {
                setDectorTest(res.data)
                setKontrollVard(res.data.kontrollVard);
            })

    }, [])

    useEffect(() => {
        setPatientTest(dectorTest.patientsTests);
        setPatientTestFilter(dectorTest.patientsTests);
    }, [dectorTest.patientsTests]);


    const handleSearchDoctor = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredItems: IPatientTest[] = patientTest.filter(item =>
            item.vardData.vardName.toString().toLowerCase().includes(event.target.value.toLowerCase()) || item.testDate.toLowerCase().includes(event.target.value.toLowerCase())
        );

        setPatientTestFilter(filteredItems)
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filteredItems: PatientDto[] = patients.filter(item =>
            item.personNummer.toString().toLowerCase().includes(event.target.value.toLowerCase()) || item.name.toLowerCase().includes(event.target.value.toLowerCase())
        );

        setPatientFilter(filteredItems)
    };
    const GoToPatientKontrol = (row: PatientDto) => {
        navigate(`/PatientKontroll/${row.id}`);
    }
    const getDegreeColor = (degree: number): string => {
        if (degree >= 10 && degree <= 22)
            return "test-degree degree-3";
        if (degree >= 6 && degree <= 10)
            return "test-degree degree-2";

        return "test-degree degree-1";
    }
    const KontrollPatient = (test: IPatientTest) => {
        navigate(`/CreateUpdate/${test.patientId}/${test.id}`)
    }
   
    return (
        <>
            {Nurses && 

                <div style={{ padding: '16px' }}>
                   
                   

                    {/* Search Input */}
                    <Row gutter={[0, 16]} className="w-100">
                        <Col xs={24}>
                            <Search
                                placeholder="Forskning..."
                                onChange={(e) => handleSearch(e)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>

                    {/* List */}
                    <Row gutter={[0, 16]} className="w-100 mt-2" style={{ marginBottom: '200px' }}>
                        <Col xs={24}>
                            <List
                                loading={loading}
                                itemLayout="horizontal"
                                dataSource={patientsFilter}
                                renderItem={(item) => (
                                    <List.Item
                                        style={{
                                            backgroundColor: '#fff',
                                            borderRadius: '10px',
                                            marginBottom: '10px',
                                            padding: '20px',
                                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                                            e.currentTarget.style.cursor = 'pointer';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                                        }}
                                        onClick={() => GoToPatientKontrol(item)}
                                    >
                                        <Skeleton avatar title={true} loading={loading} active>
                                            <List.Item.Meta
                                                description={
                                                    <Row className="m-0">
                                                        <Col
                                                            xs={24}
                                                            className="d-flex justify-content-between align-items-center list-Person"
                                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                                        >
                                                            <span className="person-number">{item.personNummer}</span>
                                                            <span className="person-name">{item.name}</span>
                                                        </Col>
                                                    </Row>
                                                }
                                            />
                                        </Skeleton>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </div>
            }
            {Doctors && <div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-3">
                        <div className="vard-dector flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <span className="rsid text-sm sm:text-base">
                                RSID: {kontrollVard?.rsid?.split('@')[0]}
                            </span>
                            <span className="vard-k-name text-sm sm:text-base">
                                {kontrollVard?.vardOmfiting}: {kontrollVard?.vardName}
                            </span>
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-3">
                        <Search
                            placeholder="Forskning..."
                            onChange={(e) => handleSearchDoctor(e)}
                            style={{ width: '100%' }}
                        />
                    </Col>

                    <Col xs={24}>
                        {patientTestFilter?.length > 0 ? (
                            patientTestFilter?.map((item, index) => (
                                <Row
                                    className="test-history-container test-container-2 cursor-pointer mb-2 p-2 rounded shadow-sm hover:bg-gray-100"
                                    key={`test-history-${index}`}
                                    onClick={() => KontrollPatient(item)}
                                >
                                    <Col xs={24} sm={12} className="vard-name text-sm sm:text-base">
                                        {item.vardData.vardOmfatning}:{item.vardData.vardName}
                                    </Col>
                                    <Col xs={12} sm={6} className="test-date text-xs sm:text-sm">
                                        {item.testDate}
                                    </Col>
                                    <Col  className={`${getDegreeColor(item.testDegree)} text-right`}>
                                        {item.testDegree}
                                    </Col>
                                </Row>
                            ))
                        ) : (
                            <h4 className="no-data text-center text-gray-500">No Test Data</h4>
                        )}
                    </Col>
                </Row>


            </div>

            }
      </>

  );
}

export default ListTest;