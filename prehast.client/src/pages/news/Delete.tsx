import { Alert, Col, Input, Popconfirm, Space } from "antd"
 
 
 

import { NewsDto } from "../../Interfaces/GeneralInterface";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
 
 
import { DeleteAsync } from "../../../app/reducers/craudSlice";
import { setModal } from "../../../app/reducers/modalSlice";
import CustomButton from "../account/compontents/customButton";
 
 



const Delete = (record: NewsDto) => {
   
    const dispatch = useDispatch<AppDispatch>();
    const { message } = useSelector((state: RootState) => state.craud)


    const delete1 = async () => {
        
        const a = ( await dispatch(DeleteAsync({ url: '/News', formdata: record }))).payload
        if (Object.keys({ a }).length > 2) {
            console.log(a);
        }
        else {
            dispatch(setModal(a))
        }
    }
   




    return (
        <>
            <h6>
                {message && <Alert type="error" message={message}/> }
                <Space size="middle">
                    <span> Details:</span>
                    <span>{record.details}</span>
                </Space>
            </h6>

            <form>
                <Input hidden id="id" value={record.id} />
                <Popconfirm
                    title="Delete"
                    description="Do you want to continue deleting?"
                    onConfirm={delete1}
                    
                        
                    okText="Yes"
                    cancelText="No"
                >

                    <Col span={24} className="text-center mt-3">
                        <CustomButton flag={3} />
                    </Col>

                </Popconfirm>


            </form>
        </>
    )
};
export default Delete