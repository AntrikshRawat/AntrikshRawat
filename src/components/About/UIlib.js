import React from 'react'
import { Col, Row } from "react-bootstrap";

export default function UIlib() {
          return (
                    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
                      <Col xs={4} md={2} className="tech-icons">
                      <p className='purple' style={{fontSize:"3rem"}}>MambaUI</p>
                      </Col>
                      <Col xs={4} md={2} className="tech-icons">
                      <p className='purple' style={{fontSize:"3rem"}}>Uiverse</p>
                      </Col>
                      <Col xs={4} md={2} className="tech-icons">
                      <p className='purple' style={{fontSize:"3rem"}}>Tailblocks</p>
                      </Col>
                    </Row>
                  );
}
