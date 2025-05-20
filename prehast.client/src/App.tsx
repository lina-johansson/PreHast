 
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Home';
 
 
 
import { Route, Routes } from 'react-router-dom';
 
 
import MainLayout from './layouts/MainLayout';
 
import Accessdenied from './Accessdenied';
import Login from './pages/account/Login';
 
import {  useDispatch, useSelector } from 'react-redux';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CloseModal } from '../app/reducers/modalSlice';
import { Modal } from 'antd';

import { AppDispatch, RootState } from '../app/store';
import Users from './pages/account/ListUsers';
import "react-form-wizard-component/dist/style.css";
import './App.css'
import PrivateRoute from './layouts/PrivateRoute';
import AnonymousLayout from './layouts/AnonymousLayout';
import ChangePassowrd from './pages/account/changePassowrd';
 
import Loading from './pages/account/compontents/loading';
import ListNews from './pages/news/ListNews';
import { RULES } from './Interfaces/roles';
import ListFragorOchSvar from './pages/FragorOchSvar/ListFragorOchSvar';
import ListPatientInfo from './pages/PatientInfo/ListPatientInfo';
import ListTest from './pages/Test/ListTest';
import PatientKontroll from './pages/Test/PatientKontroll';
import CreateUpdate from './pages/Test/CreateUpdate';
 



function App() {

    const { modalIcon, content, isOpen, Width, title, loading } = useSelector((state: RootState) => state.modal)
   
    const dispatch = useDispatch<AppDispatch>();
 
  
    return (
        <>

            <Modal
               
                key={Math.random()}
                className="my-custom-class"
                title={<span style={{ fontSize: '20px' }}>{title}{modalIcon}</span>}
                centered
                open={isOpen}
                onCancel={() => dispatch(CloseModal(false))}
                footer=""
                width={Width}
               
            >
             

                <div style={{ maxHeight: 600, overflowY: "auto", overflowX: "hidden" }}>
                    {content}
                    {loading && <Loading />}
                </div>

              
            </Modal>

            <Routes>
             
                <Route path='/' element={<MainLayout />}>
                    <Route path='/' element={<PrivateRoute allowedRules={[RULES.Admin, RULES.Doctors, RULES.Manager, RULES.Nurses]} />}>
                      <Route path='/' element={<Home />} />  
                    </Route>
                    <Route path='/' element={<PrivateRoute allowedRules={[RULES.Admin]} />}>
                         
                        <Route path='ListFragorOchSvar' element={<ListFragorOchSvar />} />  
                        <Route path='ListPatientInfo' element={<ListPatientInfo />} />  
                    </Route>
                    <Route path='/' element={<PrivateRoute allowedRules={[RULES.Doctors, RULES.Nurses]} />}>
                        <Route path='CreateUpdate/:patienId/:finallKonId' element={<CreateUpdate />} />  
                    </Route>
                    <Route path='/' element={<PrivateRoute allowedRules={[RULES.Doctors]} />}>
                        <Route path='ListTest' element={<ListTest />} />
                        <Route path='Aviseringar' element={<ListNews />} />
                    </Route>
                    <Route path='/' element={<PrivateRoute allowedRules={[RULES.Admin, RULES.Manager]} />}>
                        
                        <Route path='Users' element={<Users />} />
                    </Route>
                    <Route path='/' element={<PrivateRoute allowedRules={[RULES.Nurses]} />}>
                        
                        <Route path='ListTest' element={<ListTest />} />
                        <Route path='Aviseringar' element={<ListNews />} />
                        <Route path='PatientKontroll/:patienId' element={<PatientKontroll />} />  
                    </Route>
                     

                </Route>

                <Route path='/' element={<AnonymousLayout />}>

                    <Route path='login' element={<Login/>} />
                    <Route path='changePassowrd' element={<ChangePassowrd />} />
                    <Route path='accessdenied' element={<Accessdenied />} />
                </Route>

           </Routes>
        </>
           );
              }
export default App;