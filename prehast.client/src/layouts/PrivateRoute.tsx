import { Navigate, Outlet, useLocation } from "react-router-dom";
import { IRules, ILoginResponse } from "../Interfaces/GeneralInterface";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
 
 
function PrivateRoute({ allowedRules }: IRules) {
    const location = useLocation();
    const auth: ILoginResponse= useSelector((state:RootState)=>state.auth.loginResponse)
  
    return ( 
         auth?.loginStatus && !auth.passwordChange?
        <Navigate to="/changePassowrd" state={{ from: location }} replace /> 
        :
            auth?.loginStatus && auth.userRoles.find((role: string) => allowedRules.includes(role))
            ? <Outlet />
  
                :auth.loginStatus
                ? <Navigate to="/accessdenied" state={{from:location}} replace/>
                : <Navigate to="/login" state={{ from: location }} replace />  
    );
}
export default PrivateRoute; 