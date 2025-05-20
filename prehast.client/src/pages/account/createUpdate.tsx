 
 
import { useDispatch } from "react-redux";
 

import { useEffect, useState } from "react";
 
import {  CrudVardPersonal, ListVardPersonal, Role } from "../../Interfaces/GeneralInterface";
import { AppDispatch } from "../../../app/store";
 
import { createUpdateAsync } from "../../../app/reducers/craudSlice";
import { setModal } from "../../../app/reducers/modalSlice";
import UsersForm from "./usersfrom";
import axios from "../../api";
import { FormInstance, message } from "antd";
import useForm from "antd/es/form/hooks/useForm";
 
 
 

export interface IForm {
    form: FormInstance,
    onFinish: (values: CrudVardPersonal) => void,
    record: CrudVardPersonal
}


function CreateUpdate(record: ListVardPersonal) {
    const dispatch = useDispatch<AppDispatch>();
    const [form] = useForm<CrudVardPersonal>();
    const [Roles, SetRole] = useState<Role[]>([] as Role[]);
    const [newRecord, SetNewRecord] = useState<CrudVardPersonal>({} as CrudVardPersonal);

  
    useEffect(() => {
        axios.get(`/Account/GetAllRole?userid=${record.id}`)
            .then(res => SetRole(res.data))
      
    }, [record])

   
    useEffect(() => {
        SetNewRecord({...record,roles:Roles});
    }, [record, Roles])


    const onFinish = async (values: CrudVardPersonal) => {
    
   

        const a = (await dispatch(createUpdateAsync({ url: '/Account', formdata: values }))).payload as object;
        if (!a) {

            message.error("حدث خطأ")
           
        }
        else {
            message.success("Done")
            dispatch(setModal(a))

        }
       
    }

    useEffect(() => {
        if (Object.keys(newRecord).length === 0) {

            form.resetFields();
        }
        else {
            form.setFieldsValue(newRecord);
        }
    }, [form, newRecord]);


   
   

    return (
        
        <UsersForm onFinish={onFinish} form={form} record={newRecord} /> 
         
    );


}

export default CreateUpdate;