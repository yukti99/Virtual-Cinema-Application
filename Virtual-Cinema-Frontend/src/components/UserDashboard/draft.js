import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {getEventsForUser, getMessagesForEvent, getUserInfo} from "../../core/apiClient";
import "./UserDashboard.scss";
window.msg_data = "";
window.eventID = "";
window.userName = "User";

export default function UserDashboard() {
  let navigate = useNavigate();
  const [data, setData] = useState();
  const [userData, setData1] = useState();
  useEffect(async () => {
    const data = await getEventsForUser();
    setData(data.data.body);
  }, []);


  useEffect( async ()=> {
    const userData = await getUserInfo();
    setData1(userData.data.body);
    try {
      window.userName = userData.data.body.name
    }
    catch(err) {
      console.log("Error assigning name! token issue", userData.data);
    }
    
  },);


  async function handleWatchLogSubmit(event) {
    event.preventDefault();
    // const data = await getMessagesForEvent(obj);
    console.log("getting message from aws = ");
  }

   const getWatchLog = (x) => {
    console.log("getWatchLog Button ");
    const eventID = x.eventID
    window.eventID = eventID
    // this.props.history.push('../watch-log', {eventID})
    // const data = await getMessagesForEvent(x.eventID);
    // console.log(data)
    //  var msg = "";
    // for (let i = 0; i < data.data.length; i++) {
    // msg += data.data[i].message + "\n" + data.data[i].timestamp + "\n"+ "sent by "+ data.data[i].user.name + "\n\n\n";
    // }
    // window.msg_data = data
    // msg+="\n\n";
    navigate("../watch-log")
  }

  async function handleSubmit(event) {
    event.preventDefault();
    navigate("../create-stream");
  }

  const buttonHandler = (isHistory, eventID) => {
    navigate(`../watch-video-on?eventID=${eventID}`);
  };

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
                  <h6> {window.userName}'s Upcoming Streams</h6>
                  </Card.Header>
                  <Card.Body>
                    {data ? (
                      data.map((x) => {
                        const now = new Date();
                        if (x.startEventTime <= now.getTime()) return <></>;
                        return (
                          <Card.Text>
                            <Row>
                              <Col>{x.startEventTime}</Col>
                              <Col> <span className="fs-16"> Event: {x.event_title}  </span> </Col>
                              <Col>
                                <span className="fs-16">
                                  Invited by {x.user[0].userName}
                                </span>
                              </Col>

                              <Col className="text-right">
                                <Button
                                  variant="outline-dark"
                                  size="sm"
                                  onClick={() =>
                                    buttonHandler(false, x.eventID)
                                  }
                                >
                                  Join Now
                                </Button>
                              </Col>
                            </Row>
                          </Card.Text>
                        );
                      })
                    ) : (
                      <h4>No chats!...</h4>
                    )}
                  </Card.Body>
                </Card>

              </div>

            </div>

          </Col>
           <Card border="light">
                  <Card.Header className="primary_header">
                    {window.userName}'s Watch History
                  </Card.Header>
                  <Card.Body>
                    {data ? (
                      data.map((x) => {
                        const now = new Date();
                        if (x.startEventTime <= now.getTime()) return <></>;
                        return (
                          <Card.Text>
                            <Row>
                              <Col>{x.startEventTime}</Col>
                              <Col> <span className="fs-16"> Event: {x.event_title}  </span> </Col>
                              <Col className="text-right">
                                <Button type="button" variant="outline-dark" size="sm" onClick={() =>getWatchLog(x)}>
                                  View Watch Log
                                </Button>
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
          <Col className="right-section">
            <div>
              <Row>
                <Col></Col>
                <Col className="text-right">
                  <img
                    src="assets/notification.png"
                    alt="logo"
                    className="pr-64"
                  />
                  <img src="assets/profile-photo.png" alt="logo" />
                </Col>
              </Row>
              <div className='d-grid gap-2 pt-64'>
                    <Button variant='primary' size='lg' onClick={handleSubmit}>
                      Start Watch Party
                    </Button>
                </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
