 
 
import { useDispatch } from "react-redux";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useEffect } from "react";
 
import { NewsDto } from "../../Interfaces/GeneralInterface";
import { AppDispatch } from "../../../app/store";
 
import { createUpdateAsync } from "../../../app/reducers/craudSlice";
import { setModal } from "../../../app/reducers/modalSlice";
import NewsForm from "./NewsForm";
import { message } from "antd";
 

export interface IForm {
    form: FormInstance,
    onFinish: (values: NewsDto) => void,
    record: NewsDto
}


function CreateUpdate(record: NewsDto) {
    const dispatch = useDispatch<AppDispatch>();
    const [Form1] = useForm<NewsDto>();


    const onFinish = async (value: NewsDto) => {

        const a = (await dispatch(createUpdateAsync({ url: '/News', formdata: value }))).payload ;
         
        if (Object.keys( {a} ).length > 2) {

            message.error("حدث خطأ")
        
        }
        else {
            message.success("Done")
            dispatch(setModal(a))

        }
    }

        useEffect(() => {
            if (Object.keys(record).length === 0)
                Form1.resetFields();

            else
                Form1.setFieldsValue(record);


        }, [Form1, record]);
   
   

    return (
        <>
             < NewsForm onFinish={onFinish} form={Form1} record={record} /> 
        </>
    );


}

export default CreateUpdate;