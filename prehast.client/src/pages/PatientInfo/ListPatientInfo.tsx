import   { useEffect, useState } from 'react';
import axios from "../../api";
import { Row, Space, Table ,Button, Col} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PatientDto } from '../../Interfaces/GeneralInterface';
import { EditFilled, DeleteFilled,  DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import CreateUpdate from './createUpdate';
import Delete from './Delete';

import { AppDispatch, RootState } from "../../../app/store";
import { setModal } from "../../../app/reducers/modalSlice";
import { SetError } from "../../../app/reducers/craudSlice";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';





const PatientsTable = () => {
    const [dataSource, setDataSource] = useState<PatientDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { postState } = useSelector((state: RootState) => state.modal);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('/Patients');
                setDataSource(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [postState]);



    const addRecord = () => {
        dispatch(SetError())
        dispatch(setModal({
            isOpen: true, content: <CreateUpdate {...{ id: 0 } as PatientDto} />, Width: 900, title: "اLägg till nytt"
        }))
    };
    const deleteRecord = (row: PatientDto) => {
        dispatch(SetError())
        dispatch(setModal({ modalIcon: <DeleteOutlined style={{ color: 'red' }} />, isOpen: true, content: <Delete  {...row} />, Width: 500, title: "Delete User" })
        )
    };

    const updateRecord = (row: PatientDto) => {

        dispatch(SetError())
        dispatch(setModal({ modalIcon: <EditOutlined style={{ color: 'green' }} />, isOpen: true, content: <CreateUpdate   {...row} />, Width: 900, title: "Edit User Data" })
        )
    };
    const columns: ColumnsType<PatientDto> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Personnummer',
            dataIndex: 'personNummer',
            key: 'personnumer',
        },
        {
            title: 'actions',
            render: (_, record) => <> <Space size="small">
                <Button onClick={() => updateRecord(record)} className=""><EditFilled className="edit-icon" /></Button>
                <Button onClick={() => deleteRecord(record)} className=""><DeleteFilled className="delete-icon" /></Button>
                
            </Space></>
        }
        // Add more columns based on the API response
    ];

    return<>
       <Row className="box-title" style={{ marginTop: "-1em" }}>
                <Space className="w-100" size='middle'
                    style={{ display: 'felx', justifyContent: 'space-between' }}  >
                    <div>
                        <h3> Användar Data</h3>
                    </div>
                <Button size="small" style={{ color: "#fff", background: "#3B1E54 " }} onClick={addRecord}  >
                        <span> Lägg till användare</span>
                        <PlusOutlined />
                    </Button>

                </Space>
        </Row>
        <Row>
            <Col span={24 } className="p-2">
                <Table dataSource={dataSource} columns={columns} loading={loading} rowKey="id" />
            </Col>
        </Row>
    </>


};

export default PatientsTable;

 
 