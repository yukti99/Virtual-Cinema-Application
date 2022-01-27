import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../Auth/UserPool";

import "./Login.scss";

export default function Login() {
  let navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = () => {
    const useremail = emailRef.current.value;
    const userpassword = passwordRef.current.value;

    const user = new CognitoUser({
      Username: useremail,
      Pool: UserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: useremail,
      Password: userpassword,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        window.localStorage.setItem('jwt', data.accessToken.jwtToken)
        navigate('../user-dashboard')
      },
      onFailure: (err) => {
        console.error("onFailure: ", err);
      },
      newPasswordRequired: (data) => {
        console.log("newPasswordRequired: ", data);
      },
    });
  };

  async function goToHome(event) {
    event.preventDefault();
    navigate("../");
  }

  return (
    <>
      <Container fluid className="login">
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
              <img src="assets/back.png" alt="logo" onClick={goToHome} /> Back
            </div>
            <div className="login-form">
              <div className="header">Login</div>

              <Form onSubmit={(e) => handleSubmit(e)}>
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
                  <Form.Label>Password*</Form.Label>
                  <Form.Control
                    type="password"
                    size="lg"
                    placeholder="Enter Password"
                    ref={passwordRef}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <div className="d-grid gap-2 pt-32">
                  <Button variant="primary" size="lg" onClick={handleSubmit}>
                    Login
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
