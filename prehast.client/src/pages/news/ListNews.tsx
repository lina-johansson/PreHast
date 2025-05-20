import { useEffect, useState } from "react";
import { DeleteFilled, EditFilled, EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Space, List, Skeleton, Typography, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api";
import Delete from "./Delete";
import CreateUpdate from "./createUpdate";
import { AppDispatch, RootState } from "../../../app/store";
import { setModal } from "../../../app/reducers/modalSlice";
import { SetError } from "../../../app/reducers/craudSlice";
import { NewsDto } from "../../Interfaces/GeneralInterface";

const { Title } = Typography;

const intialvalue: NewsDto = {
    id: 0,
    can: false,
    canAll: false,
    details: "",
    applicationUserId: '',
    id1: 0,
};

const ListNews = () => {
    const [newss, SetNewss] = useState<NewsDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { postState } = useSelector((state: RootState) => state.modal);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        axios.get("/News")
            .then(res => {
                SetNewss(res.data);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }, [postState]);

    const addNews = () => {
        dispatch(SetError())
        dispatch(setModal({
            isOpen: true, content: <CreateUpdate {...intialvalue} />, Width: 500, title: "Add New"
        }));
    };

    const deleteNews = (row: NewsDto) => {
        dispatch(SetError());
        dispatch(setModal({ modalIcon: <DeleteOutlined style={{ color: 'red' }} />, isOpen: true, content: <Delete {...row} />, Width: 500, title: "Delete" }));
    };

    const updateNews = (row: NewsDto) => {
        dispatch(SetError());
        dispatch(setModal({ modalIcon: <EditOutlined style={{ color: 'green' }} />, isOpen: true, content: <CreateUpdate {...row} />, Width: 500, title: "Update" }));
    };

    return (
        <div style={{ padding: '10px' }}>
            <div className="box-title" style={{ padding: '10px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '10px' }}>
                <Space className="w-100" size='small' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0px' }}>
                    <Title level={4} style={{ margin: 0 }}>Newses</Title>
                    <Button size="small" style={{ color: "#fff", background: "#6c757d", border: "none" }} onClick={addNews}>
                        <span> Add News</span>
                        <PlusOutlined />
                    </Button>
                </Space>
            </div>


            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={newss}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Button onClick={() => updateNews(item)} className="btn-border-edit"><EditFilled /></Button>,
                            <Button onClick={() => deleteNews(item)} className="btn-border-delete"><DeleteFilled /></Button>
                        ]}
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
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <Skeleton avatar title={false} loading={loading} active>
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: item.can ? 'green' : 'red' }}>{item.can ? <CheckOutlined /> : <CloseOutlined />}</Avatar>}
                                
                                description={item.details}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ListNews;
