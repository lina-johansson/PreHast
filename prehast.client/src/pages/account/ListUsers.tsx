import {
    Avatar,
    Button,
    Col,
    List,
    Row,
    Skeleton,
    Input,
} from "antd";
import {
    CalendarOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteFilled,
    EditFilled,
    PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ListVardPersonal } from "../../Interfaces/GeneralInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import axios from "../../api";
import { setModal } from "../../../app/reducers/modalSlice";
import CreateUpdate from "./createUpdate";
import Delete from "./Delete";
import { SetError } from "../../../app/reducers/craudSlice";
import Details from "./Details";

const { Search } = Input;

const Users = () => {
    const [users, SetUsers] = useState<ListVardPersonal[]>([]);
    const [filter, Setfilter] = useState<ListVardPersonal[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch<AppDispatch>();
    const { postState } = useSelector((state: RootState) => state.modal);

    const GetUSERS = () => {
        setLoading(true);
        axios.get("account/GetAllUser")
            .then((res) => {
                SetUsers(res.data);
                Setfilter(res.data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        GetUSERS();
    }, [postState]);

    const addUsers = () => {
        dispatch(SetError());
        dispatch(setModal({
            isOpen: true,
            content: <CreateUpdate {...{ id: "" } as ListVardPersonal} />,
            Width: 900,
            title: "Lägg till nytt",
        }));
    };

    const deleteUsers = (row: ListVardPersonal) => {
        dispatch(SetError());
        dispatch(setModal({
            modalIcon: <DeleteFilled style={{ color: 'red' }} />,
            isOpen: true,
            content: <Delete {...row} />,
            Width: 500,
            title: "Delete User",
        }));
    };

    const updateUsers = (row: ListVardPersonal) => {
        dispatch(SetError());
        dispatch(setModal({
            modalIcon: <EditFilled style={{ color: 'green' }} />,
            isOpen: true,
            content: <CreateUpdate {...row} />,
            Width: 900,
            title: "Edit User Data",
        }));
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        const filteredItems = users.filter(item =>
            item.name.toLowerCase().includes(value)
        );
        Setfilter(filteredItems);
    };

    const DetailsUsers = (row: ListVardPersonal) => {
        dispatch(SetError());
        dispatch(setModal({
            modalIcon: <CalendarOutlined style={{ color: 'green' }} />,
            isOpen: true,
            content: <Details {...row} />,
            Width: 1000,
            title: "Details",
        }));
    };

    return (
        <>
            {/* Title and Button */}
            <Row className="box-title" gutter={[16, 16]} align="middle" style={{maxWidth:'100%'} }>
                <Col xs={24} sm={12}>
                    <h3>Användar Data</h3>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                    <Button
                        size="small"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={addUsers}
                    >
                        Lägg till användare
                    </Button>
                </Col>
            </Row>

            {/* Search */}
            <Row style={{ marginTop: '1em' }}>
                <Col xs={24}>
                    <Search
                        placeholder="Forskning..."
                        onChange={handleSearch}
                        allowClear
                    />
                </Col>
            </Row>

            {/* User List */}
            <Row className="mt-3" style={{ marginBottom: '200px' }}>
                <Col xs={24}>
                    <List
                        loading={loading}
                        itemLayout="vertical"
                        dataSource={filter}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button onClick={() => updateUsers(item)} icon={<EditFilled />} />,
                                    <Button onClick={() => deleteUsers(item)} icon={<DeleteFilled />} danger />,
                                    <Button onClick={() => DetailsUsers(item)} icon={<CalendarOutlined />} />,
                                ]}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    padding: '20px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    cursor: 'pointer',
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
                                <Skeleton avatar title={true} loading={loading} active>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar style={{ backgroundColor: !item.lockoutEnabled ? 'green' : 'red' }}>
                                                {!item.lockoutEnabled ? <CheckOutlined /> : <CloseOutlined />}
                                            </Avatar>
                                        }
                                        title={
                                            <p className="text-danger" style={{ fontSize: '16px' }}>
                                                {item.omfatningName} / {item.name}
                                            </p>
                                        }
                                        description={
                                            <div>
                                                <p><strong>Email:</strong> {item.email}</p>
                                                <p><strong>Position:</strong> {item.personPosition}</p>
                                                <p><strong>Department:</strong> {item.departmentName}</p>
                                                <p><strong>Last Login:</strong> {item.lastLogin.split('T')[0]}</p>
                                                <p><strong>Created By:</strong> {item.created_by} on {item.created_date.split('T')[0]}</p>
                                                <p><strong>Updated By:</strong> {item.updated_by} on {item.updated_date.split('T')[0]}</p>
                                            </div>
                                        }
                                    />
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </>
    );
};

export default Users;
