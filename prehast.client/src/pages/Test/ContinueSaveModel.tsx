import { Button, Col, Row } from "antd";
import { IForm } from "./CreateUpdate";

const ContinueSaveModel = ({  record }: IForm) => {

    const SubmitForm = () => {
        console.log(record)
    }
  return (
      <Row>

          <Col span={24} className="text-center">
              <Button onClick={SubmitForm} className="control-btn ">  AVSLUTA </Button>
          </Col>
      </Row>
  ); 
}

export default ContinueSaveModel;