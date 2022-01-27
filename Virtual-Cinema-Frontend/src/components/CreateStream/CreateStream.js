import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { postNewEvent} from "../../core/apiClient";
import './CreateStream.scss';
import {useRef} from "react";
window.event_id = "";

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


export default function CreateStream() {
   let navigate = useNavigate();
   const user1email = useRef();
   const user2email = useRef();
   const user3email = useRef();
   const starteventtime = useRef();
   const url = useRef();
   const event_title_ref = useRef();

  async function handleSubmit(event) {
    event.preventDefault();
    const email1 = user1email.current.value;
    const email2 = user2email.current.value;
    const email3 = user3email.current.value;
    const time = starteventtime.current.value;
    const videoURL = url.current.value;
    const event_title = event_title_ref.current.value;
    const eventID = create_UUID()
    var obj = new Object();
    obj.videoURL = videoURL
    obj.eventID = eventID
    obj.event_title = event_title
    const master_email = "masteruser@abc"
    let master_json = `{"email": "${master_email}"}`
    let user2 = `{"email": "${email1}"}`
    let user3 = `{"email": "${email2}"}`
    let user4 = `{"email": "${email3}"}`

    const master = JSON.parse(master_json)
    const objuser2 = JSON.parse(user2);
    const objuser3 = JSON.parse(user3);
    const objuser4 = JSON.parse(user4);

    obj.user = [master, objuser2, objuser3, objuser4]
    obj.startEventTime= time
    const data = await postNewEvent(eventID, obj);
    navigate('../user-dashboard');
  };

  async function goToDashboard(event) {
    event.preventDefault();
    navigate("../user-dashboard");
  };

  return (
    <>
      <Container fluid className='create-stream'>
        <Row>
          <Col className='left-section'>
            <img src='assets/logo-white.png' alt='logo' />
            <div className='main-content'>
              <img src='assets/play.png' alt='logo' />
            </div>
          </Col>
          <Col className='right-section'>
            <div>
              <img src='assets/back.png' alt='logo' onClick={goToDashboard}/> Back
            </div>
            <div className='create-stream-form'>
              <div className='header'>Create Stream</div>

              <Form>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>URL of movie</Form.Label>
                  <Form.Control type='text' size='lg' placeholder='Netflix, Youtube URL' ref={url}/>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Title</Form.Label>
                  <Form.Control type='text' size='lg' placeholder='Coldplay, Squid Games etc.' ref={event_title_ref}/>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Schedule a time</Form.Label>
                  <Form.Control type='time' size='lg' placeholder='9:00 PM, Nov 2nd, 2021' ref={starteventtime}/>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Label>Invite users by email</Form.Label>
                  <Form.Control type='email' size='lg' placeholder='User 1 email' ref={user1email} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Control type='email' size='lg' placeholder='User 2 email (optional)' ref={user2email} />
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicPassword'>
                  <Form.Control type='email' size='lg' placeholder='User 3 email (optional)' ref={user3email}/>
                </Form.Group>

                <div className='d-grid gap-2 pt-32'>
                  <Button variant='primary' size='lg' onClick={handleSubmit}>
                    Schedule Event
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
