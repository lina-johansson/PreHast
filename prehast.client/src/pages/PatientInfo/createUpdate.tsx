 
 
import { useDispatch } from "react-redux";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useEffect } from "react";
 
import {  PatientCrudDto, PatientDto } from "../../Interfaces/GeneralInterface";
import { AppDispatch } from "../../../app/store";
 
import { createUpdateAsync } from "../../../app/reducers/craudSlice";
import { setModal } from "../../../app/reducers/modalSlice";

import { message } from "antd";
import PatientInfoForm from "./PatientInfoForm";
 

export interface IForm {
    form: FormInstance,
    onFinish: (values: PatientCrudDto) => void,
    record: PatientDto
}


function CreateUpdate(record: PatientDto) {
    const dispatch = useDispatch<AppDispatch>();
    const [Form1] = useForm<PatientCrudDto>();


    const onFinish = async (value: PatientCrudDto) => {

        const a = (await dispatch(createUpdateAsync({ url: '/Patients', formdata: value }))).payload ;
         
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
             <PatientInfoForm onFinish={onFinish} form={Form1} record={record} /> 
        </>
    );


}

export default CreateUpdate;