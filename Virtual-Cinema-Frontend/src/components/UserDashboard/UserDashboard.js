import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {getEventsForUser, getUserInfo, storeUserInfo} from "../../core/apiClient";
import "./UserDashboard.scss";
window.msg_data = "";
window.eventID = "";
window.userName = "User"


export default function UserDashboard() {
  let navigate = useNavigate();
  const [data, setData] = useState();
  const [userData, setData1] = useState();
  useEffect(async () => {
    const data = await getEventsForUser();
    setData(data.data.body);
  }, []);

    useEffect( async () => {
    const userStoreResponse = storeUserInfo();
    console.log("User Info Stored Successfully!")
    console.log("userStoreResponse"+ userStoreResponse)
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
    console.log("handleWatchLogSubmit ");
    console.log(event.x);
    console.log("getting message from aws = ");
  }

   const getWatchLog = (x) => {
    console.log("getWatchLog Button ");
    const eventID = x.eventID
    window.eventID = eventID
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
         <div>
         <img src="assets/logo-black.png" alt="logo" className="logoclass" />
         </div>
         <div>
           <div className="upStreamsClass">
             <Button variant='primary' size='lg' onClick={handleSubmit}>
                      Start Watch Party
                    </Button>
          
           </div>
        <div >
         <Card border="light" className="upStreamsClass">
                  <Card.Header className="primary_header">
                  {window.userName}'s Upcoming Streams
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
                              <Col> <span className="textClass"> Event: {x.event_title}  </span> </Col>
                              <Col>
                                <span className="textClass">
                                  Invited by {x.user[0].userName}
                                </span>
                              </Col>

                              <Col className="text-right">
                                <Button
                                  variant="outline-dark"
                                  size="large" 
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
                      <h4> Loading... </h4>
                    )}
                  </Card.Body>
                </Card>
                <Card border="light" className="upStreamsClass">
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
                              <Col> <span className="textClass"> Event: {x.event_title}  </span> </Col>
                              <Col className="text-right">
                                <Button type="button" variant="outline-dark" size="large" onClick={() =>getWatchLog(x)}>
                                  View Watch Log
                                </Button>
                              </Col>
                            </Row>
                          </Card.Text>
                        );
                      })
                    ) : (
                      <h5> Loading... </h5>
                    )}
                  </Card.Body>
                </Card>
                </div>
         </div>
      
       </Row>
      </Container>
    </>
  );
}
