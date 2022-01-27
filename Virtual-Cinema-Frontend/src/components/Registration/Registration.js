import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./Registration.scss";
import UserPool from "../Auth/UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

export default function Registration() {
  let navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = () => {
    const username = nameRef.current.value;
    const useremail = emailRef.current.value;
    const userpassword = passwordRef.current.value;

    const attributes = [
      new CognitoUserAttribute({ Name: "name", Value: username }),
    ];

    UserPool.signUp(useremail, userpassword, attributes, null, (err, data) => {
      if (err) {
        console.error(err);
      }
      navigate("../login");
    });
  };

  async function goToHome(event) {
    event.preventDefault();
    navigate("../");
  }

  return (
    <>
      <Container fluid className="registration">
        <Row>
          <Col className="left-section">
            <div>
              <img src="assets/logo-white.png" alt="logo" />
              <div className="main-content">
                <Row>
                  <Col>Unlimited movie streams</Col>
                  <Col>
                    <img src="assets/check.png" alt="logo" />
                  </Col>
                </Row>
                <Row>
                  <Col>Invited up to 4 friends</Col>
                  <Col>
                    <img src="assets/check.png" alt="logo" />
                  </Col>
                </Row>
                <Row>
                  <Col>Save movie watch history</Col>
                  <Col>
                    <img src="assets/check.png" alt="logo" />
                  </Col>
                </Row>
                <Row>
                  <Col>MacOS, Windows, Linux</Col>
                  <Col>
                    <img src="assets/check.png" alt="logo" />
                  </Col>
                </Row>
                <Row>
                  <Col>Minimal lag and realtime sync</Col>
                  <Col>
                    <img src="assets/check.png" alt="logo" />
                  </Col>
                </Row>
                <div className="pt-98">
                  Focus on movie watching, we’ll handle the rest
                </div>
                <div>
                  All of this completely{" "}
                  <span className="success-text">FREE</span>
                </div>
              </div>
            </div>
          </Col>
          <Col className="right-section">
            <div>
              <img src="assets/back.png" alt="logo" onClick={goToHome}/> Back
            </div>
            <div className="registration-form">
              <div className="header">Create Account</div>
              <div>
                For the purpose of industry regulation, your details are
                required.
              </div>

              <Form onSubmit={(e) => handleSubmit(e)}>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Your fullname*</Form.Label>
                  <Form.Control
                    type="text"
                    size="lg"
                    placeholder="Enter display name"
                    ref={nameRef}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address*</Form.Label>
                  <Form.Control
                    type="email"
                    size="lg"
                    placeholder="Enter email address"
                    ref={emailRef}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Create password*</Form.Label>
                  <Form.Control
                    type="password"
                    size="lg"
                    placeholder="Enter password"
                    ref={passwordRef}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="I agree to terms & conditions"
                  />
                </Form.Group>

                <div className="d-grid gap-2 pt-32">
                  <Button variant="primary" size="lg" onClick={handleSubmit}>
                    Register Account
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
