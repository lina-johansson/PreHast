import { Button } from "antd/lib";
import { useNavigate } from "react-router-dom";
import { logout } from "../app/reducers/authSlice";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
 
 
function Accessdenied() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/")
    }

    const logout1 = async () => {
        const x = await dispatch(logout())

        if (x.payload) {
            if (localStorage.getItem("token") !== null) {
                localStorage.removeItem('token');
            }
            if (localStorage.getItem("refresh_token") !== null) {
                localStorage.removeItem('refresh_token');
            }
            if (localStorage.getItem("refresh_token_expiry") !== null) {
                localStorage.removeItem('refresh_token_expiry');
            }



            navigate('/login')
        }
    }
    return (
        <>
            <div style={{position:'absolute',top:10,left:'48%'} }>
            <Button onClick={handleBack} className="btn btn-sm btn-primary ">  Home </Button>|
            <Button onClick={() => logout1()} className="btn btn-sm btn-danger ">  Logout </Button>
          
            </div>
             <img src={'./assets/z.s.a.png'}  style={{ marginTop: "0px",width:'100%',height:'100%' }} /> 
        </>
           );
              }
export default Accessdenied;