import { Badge, Card, Col, Divider, Row } from "antd";
import axios from "../src/api";
import { useEffect, useState } from "react";
import Marquee from 'react-fast-marquee';
import { NewsDto } from "./Interfaces/GeneralInterface";
import { BellOutlined } from "@ant-design/icons";
import ListTest from "./pages/Test/ListTest";
 

const Home = () => {
    const [newss, SetNewss] = useState<NewsDto[]>();
 
    useEffect(() => {
        axios.get("/News/GetAllNews")
            .then(res => {
                SetNewss(res.data);
                
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <Row className="d-flex justify-content-between w-100" style={{ minHeight: '82vh', marginTop: '-13px', overflowX: 'hidden', backgroundColor: '#f7f7f7' }}>
            <Col span={24} style={{ zIndex: 2 }}>
               <ListTest/>
            </Col>

            <Col span={24} className="w-100" style={{ zIndex: 1,  borderRadius: '8px', width: '100%', minHeight: '50px', maxHeight: '60px', position: 'fixed', bottom: 50 }}>
                <Marquee className="d-flex flex-row justify-content-center align-items-center" style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }} speed={70} gradient={false} pauseOnHover={true} direction="right">
                    {newss?.map((item) => item.can ? (
                        <div key={item.id} className="p-3" style={{ margin: '0 10px', display: 'flex', justifyContent: 'center', alignItems: 'center',  borderRadius: '10px'  }}>
                            <Badge.Ribbon text="Rapportera" color="#ce0a0a">
                                <Card title={<span style={{ display: 'flex', alignItems: 'left' }}><BellOutlined style={{ marginRight: 8, color: 'red', fontSize:"2rem" }} /><Divider type="vertical" />{item.applicationUserId}</span>} size="small" style={{ backgroundColor: '#fff', border: '1px solid #d9d9d9', borderRadius: '10px', textAlign: 'center', minWidth: '700px', maxWidth: '700px', minHeight: '15vh' }}>
                                    <p style={{textAlign:'left'}}>{item.details}</p>
                                </Card>
                            </Badge.Ribbon>
                        </div>
                    ) : null)}
                </Marquee>
            </Col>
        </Row>
    );
};

export default Home;
