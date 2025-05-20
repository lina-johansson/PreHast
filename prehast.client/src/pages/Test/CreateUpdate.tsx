import { useEffect, useState } from "react";
import axios from "../../api";
import { AppDispatch, RootState } from "../../../app/store";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PatientKotrollCreate, ResponseStatus } from "../../Interfaces/GeneralInterface";
import {   FormInstance,   message } from "antd";
import FormTest from "./FormTest";
import { createUpdateAsync } from "../../../app/reducers/craudSlice";
import { setModal } from "../../../app/reducers/modalSlice";
import { useForm } from "antd/es/form/Form";
 

export interface IForm {
    form: FormInstance,
    onFinish: (values: PatientKotrollCreate) => void,
    record: PatientKotrollCreate 
  
}



const CreateUpdate = () => {

    const [patientKotrollCreate, setPatientKotrollCreate] = useState<PatientKotrollCreate>({} as PatientKotrollCreate);
    const { postState } = useSelector((state: RootState) => state.modal);
 
    const { patienId, finallKonId } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [Form1] = useForm<PatientKotrollCreate>();
    const navigate = useNavigate();


    useEffect(() => {
        axios.get(`Kontrolls/GetPatientKontrollToCreate/${patienId}/${finallKonId}`)
            .then((res) => {
                setPatientKotrollCreate(res.data);
            })
            .catch(error => console.log(error))
       // setLoading(false);

    }, [finallKonId, patienId, postState]);


    const onFinish = async (values: PatientKotrollCreate) =>
    { 
        const a: ResponseStatus = (await dispatch(createUpdateAsync({ url: '/Kontrolls', formdata: values }))).payload as ResponseStatus;
         console.log(a)
        if (!a.success) {

            message.error(a.message) 
          
        }
        else { 
               message.success(a.message);
             
                dispatch(setModal(a))
                if (values.sent) {
                    message.warning("Report Send to Vard");
                }

                navigate(`/PatientKontroll/${values.patientData.id}`);
          
         
             

        }
    }

    useEffect(() => {
        if (patientKotrollCreate.patientData?.id === 0)
            Form1.resetFields();

        else {
          
            Form1.setFieldsValue(patientKotrollCreate);
        }



    }, [Form1, patientKotrollCreate]);

  return (
      <FormTest onFinish={onFinish} form={Form1} record={patientKotrollCreate}  />
  );
}

export default CreateUpdate;