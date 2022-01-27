import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './EndParty.scss';

export default function EndParty() {
  let navigate = useNavigate();

  async function handleDashboardSubmit(event) {
    event.preventDefault();
    navigate('../user-dashboard');
  }
  async function handleStreamSubmit(event) {
    event.preventDefault();
    navigate('../create-stream');
  }

  return (
    <Container fluid className='end-party'>
      <div className='main-content'>
        <div className='text-center'>
          <img src='assets/play.png' alt='logo' />
          <div className="pt-32 fs-24">Stream has ended</div>
        </div>
        <Row className="pt-64">
          <Col>
            <div className='d-grid gap-2'>
              <Button variant='primary' size='lg' onClick={handleDashboardSubmit}>
                Return to Dashboard
              </Button>
            </div>
          </Col>
          <Col>
            <div className='d-grid gap-2'>
              <Button variant='secondary' size='lg' onClick={handleStreamSubmit}>
                Create new Stream
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
