 
 
import { useDispatch } from "react-redux";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
 
import { FragorCrudDto, FragorDto} from "../../Interfaces/GeneralInterface";
import { AppDispatch } from "../../../app/store";
 
import { createUpdateAsync } from "../../../app/reducers/craudSlice";
import { setModal } from "../../../app/reducers/modalSlice";

import { message } from "antd";
import FormComponent from "./FormComponent";

 

export interface IForm {
    form: FormInstance,
    onFinish: (values: FragorCrudDto) => void,
    record: FragorCrudDto
}


function CreateUpdate(record: FragorDto) {
    const dispatch = useDispatch<AppDispatch>();
    const [Form1] = useForm<FragorCrudDto>();
    const [formData, setFormData] = useState<FragorCrudDto>({} as FragorCrudDto);

    const onFinish = async (value: FragorCrudDto) => {

        const a = (await dispatch(createUpdateAsync({ url: '/Fragors', formdata: value }))).payload ;
         
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

            else {
                setFormData({
                    id: record.id,
                    description: record.description,
                    name: record.name,
                    sort: record.sort,
                    svarsCrudDto: record.svarsDto,
                    hasLeftRight:record.hasLeftRight
                });
                Form1.setFieldsValue(record);
            }
               


        }, [Form1, record]);
   
   

    return (
        <>
            <FormComponent onFinish={onFinish} form={Form1} record={formData} /> 
        </>
    );


}

export default CreateUpdate;