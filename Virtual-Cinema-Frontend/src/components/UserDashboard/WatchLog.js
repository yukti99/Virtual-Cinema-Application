import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getMessagesForEvent} from "../../core/apiClient";
import "./WatchLog.scss";


export default function WatchLog() {
  const [data, setData] = useState();

  useEffect(async () => {
    console.log("Event ID is "+ window.eventID)
    const data = await getMessagesForEvent(window.eventID)
    console.log(data);
    setData(data.data);
  }, []);

  return (
    <>
      <Container fluid className="user-dashboard">
        <Row>
          <Col className="left-section">
            <div>
              <img src="assets/logo-black.png" alt="logo" />
              <div className="main-content">
                <Card border="light">
                  <Card.Header className="primary_header">
                    Chatroom Message History
                  </Card.Header>
                  <Card.Body>
                    {data ? (
                      data.map((x) => {
                        return (
                          <Card.Text>
                            <Row>
                              <Col>{x.user.name}: </Col>
                               <Col>{x.message}</Col>
                               <Col className="text-right">{x.timestamp} </Col>
                              <Col className="text-right">
                              </Col>
                            </Row>
                          </Card.Text>
                        );
                      })
                    ) : (
                      <h5>No chats!...</h5>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
