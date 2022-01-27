import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Home.scss';


export default function Home() {
  let navigate = useNavigate();

  async function goToRegister(event) {
    event.preventDefault();
    navigate('../registration');
  }
  
  async function goToLogin(event) {
    event.preventDefault();
    navigate('../login');
  }

  return (
    <>
      <Container fluid className='home'>
        <Row>
          <Col className='left-section'>
            <div>
              <img src='assets/logo-black.png' alt='logo' />
              <div className='main-content'>
                <div className='header'>Welcome!</div>
                <div className='pb-8 fs-24'>Watch movies together with friends</div>
                <div className='pt-16'>
                  <img src='assets/user.png' alt='logo' className='pr-16' />
                  <img src='assets/user.png' alt='logo' className='pr-16' />
                  <img src='assets/user.png' alt='logo' className='pr-16' />
                  <img src='assets/user.png' alt='logo' className='pr-16' />
                </div>
                <div className='d-grid gap-2 pt-98'>
                  <Button variant='primary' size='lg' onClick={goToRegister}>
                    Create Account
                  </Button>
                </div>
                <div className='d-grid gap-2 pt-32'>
                  <Button variant='secondary' size='lg' onClick={goToLogin}>
                    Login Account
                  </Button>
                </div>
                <div className='pt-16'>Brought to you by tormented DEVS</div>
              </div>
            </div>
          </Col>
          <Col className='right-section'>
            <div className='main-content'>
              <img src='assets/play.png' alt='logo' />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
