import { Button } from "antd";
 
interface  Iflag {
    flag:number
}
const CustomButton = ({ flag } : Iflag) => {
    return (
        
        flag === 1?
            <Button htmlType="submit" className="btn    btn-outline-primary   w-100">  Save </Button>
            : flag == 2 ? 
                <Button htmlType="submit" className="btn btn-outline-primary   w-100" > Edit</Button>
                : flag == 3 ?
                    <Button className="btn btn-outline-danger bt-delete w-100" >  Delete</Button>
                    : null
            
    )
}
export default CustomButton;