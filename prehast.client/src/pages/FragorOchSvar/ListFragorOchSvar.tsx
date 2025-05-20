import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {  Button, Col, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { FragorDto } from "../../Interfaces/GeneralInterface";
import axios from "../../api";
import { AppDispatch, RootState } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { SetError } from "../../../app/reducers/craudSlice";
import { setModal } from "../../../app/reducers/modalSlice";
import CreateUpdate from "./createUpdate";
import Delete from "./Delete";
import { Spin } from "antd/lib";
function ListFragorOchSvar() {

    //UseStates
    const [loading, setLoading] = useState(true);
    const [Fragors, setFragors] = useState<FragorDto[]>([] as FragorDto[]);
    const { postState } = useSelector((state: RootState) => state.modal);
    const dispatch = useDispatch<AppDispatch>();
    //UseEfects


    //Functions
    useEffect(() => {
        axios.get(`Fragors`)
            .then((res) => {
                setFragors(res.data);
            })
            .catch(error => console.log(error))
        setLoading(false);

    }, [postState]);

    const addRecord = () => {
        dispatch(SetError())
        dispatch(setModal({
            isOpen: true, content: <CreateUpdate {...{ id: 0 } as FragorDto} />, Width: 900, title: "Add Fragor & Svar"
        }))
    };
    const deleteRecord = (row: FragorDto) => {
        dispatch(SetError())
        dispatch(setModal({ modalIcon: <DeleteOutlined style={{ color: 'red' }} />, isOpen: true, content: <Delete  {...row} />, Width: 500, title: "Delete User" })
        )
    };

    const updateRecord = (row: FragorDto) => {
        dispatch(SetError())
        dispatch(setModal({ modalIcon: <EditOutlined style={{ color: 'green' }} />, isOpen: true, content: <CreateUpdate   {...row} />, Width: 900, title: "Edit User Data" })
        )
    };
  return (
      <>
          <Row className="box-title" style={{ marginTop: "-1em" }}>
              <Space className="w-100" size='middle'
                  style={{ display: 'felx', justifyContent: 'space-between' }}  >
                  <div>
                      <h3> Fragor & Svar</h3>
                  </div>
                  <Button size="small" style={{ color: "#fff", background: "#FF4545 " }} onClick={addRecord}>
                      <span> Add New Fragor</span>
                      <PlusOutlined />
                  </Button>

              </Space>
          </Row>


          {loading ? <Spin /> : <Row className="mt-3" style={{ marginBottom: '200px' }}>
              <Col span={24}>
                  <table className="table-fragor">
                      <tbody>
                          {
                              Fragors?.map((item, index) =>
                                  <tr key={`fragor-${index}`}>
                                      <td className="fragor-td" key={`fragor-td-1-${index}`}>
                                          <p className="fragor-name" >{index + 1} . {item.name}</p>
                                          <p className="fragor-des">{item.description}</p>
                                      </td>
                                      <td className="svar-td" key={`fragor-td-2-${index}`}>
                                          {item.hasLeftRight ? <div><p className="td-empty"></p></div> : null}
                                          {item.svarsDto?.map((svar, svarIndex) =>
                                              <div key={`svar-div-${svarIndex}`}>
                                                  <p className="svar-name">{svar.degree} - {svar.name}</p>
                                                  <p className="svar-des">{svar.description}</p>
                                              </div>

                                          )}
                                      </td>
                                      {
                                          item.hasLeftRight ? <>
                                              <td className="svar-td-3" key={`fragor-td-2-${index}`}>
                                                  <div>Hö</div>
                                              </td>
                                              <td className="svar-td-3" key={`fragor-td-3-${index}`}>
                                                  <div>Vä</div>
                                              </td>
                                          </>
                                              :
                                              <td key={`fragor-td-4-${index}`} colSpan={2}></td>
                                      }
                                      <td className="fragor-oprations" key={`fragor-td-5-${index}`}>
                                          <Space size="small">
                                              <Button className="" onClick={() => updateRecord(item)}><EditFilled className="edit-icon" /></Button>
                                              <Button className="" onClick={() => deleteRecord(item)} ><DeleteFilled className="delete-icon" /></Button>
                                          </Space>
                                      </td>
                                  </tr>

                              )
                          }
                      </tbody>

                  </table>

              </Col>
          </Row>
          }
      </>
  );
}

export default ListFragorOchSvar;