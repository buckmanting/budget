import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import './App.css';
import ListGroup from "react-bootstrap/ListGroup";
import useLocalStorage from './store/localStorageStore';

function App() {
    const [budget, setBudget] = useLocalStorage('budget', {limit: 0, numberOfWeeks: 1});
    const [remaining, setRemaining] = useLocalStorage('remaining', budget.limit);
    const [spend, setSpend] = useLocalStorage('spend', undefined);
    const [spendHistory, setSpendHistory] = useLocalStorage('spendHistory', []);

    const [showSettings, setShowSettings] = useState(false);
    const [budgetLimit, setBudgetLimit] = useLocalStorage('budgetLimit', {limit: 100, numberOfWeeks: 4});
    const [budgetTimeFrame, setBudgetTimeFrame] = useLocalStorage('budgetTime', {limit: 100, numberOfWeeks: 4});

    const handleClose = () => setShowSettings(false);
    const handleShow = () => setShowSettings(true);

    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};

    const handleSpendSubmit = (event) => {
        event.preventDefault();
        setSpendHistory([...spendHistory, {
            value: Number.parseInt(spend),
            date: Date.now()
        }])
        setSpend(0);
    }

    const handleBudgetSubmit = (event) => {
        event.preventDefault();

        setBudget({
            limit: budgetLimit,
            numberOfWeeks: budgetTimeFrame
        });

        handleClose();
    }

    useEffect(() => {
        setRemaining((budget.limit / budget.numberOfWeeks) - spendHistory.reduce((a, b) => {
            return b.value == null ? a : a + b.value;
        }, 0));
        // save the budget here
    });

    return (

        <Container fluid className="App">
            <Row className="App-header">
                <Col sm={12}><h2>You've got about £{remaining} left</h2></Col>
                <Col sm={12}><p>With £{budget.limit} until the end of the month</p></Col>
            </Row>
            <Form onSubmit={handleSpendSubmit}>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="£10"
                        aria-label="Spent"
                        value={spend}
                        type="number"
                        min="-25000.00"
                        step="0.01"
                        onChange={e => setSpend(e.target.value)}
                        required
                    />
                    <InputGroup.Append>
                        <Button type="submit" variant="outline-primary">Add</Button>
                    </InputGroup.Append>
                </InputGroup>

            </Form>

            <Row>
                <Col><Button variant="outline-secondary"
                             onClick={handleShow}>Configure</Button></Col>
            </Row>

            <Row>
                <Col>
                    <ListGroup variant="flush">
                        {spendHistory.map((item, key) =>
                            <ListGroup.Item
                                className="component--dark-bg"
                                key={item.date}>{new Date(item.date).toLocaleString('en-GB', options)} -
                                £{item.value}</ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            </Row>

            <Modal show={showSettings} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Configure Budget</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleBudgetSubmit}>
                    <Modal.Body>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Budget</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="budgetPrepend">£</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="number"
                                              value={budgetLimit}
                                              onChange={(e) => setBudgetLimit(e.target.value)}
                                              min="0.01"
                                              step="0.01"
                                              placeholder="100"
                                              required/>
                                <Form.Control.Feedback type="invalid">
                                    Please set a budget.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className="text-muted">
                                This for the time frame below
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Over</Form.Label>
                            <InputGroup>
                                <Form.Control type="number"
                                              value={budgetTimeFrame}
                                              onChange={(e) => setBudgetTimeFrame(e.target.value)}
                                              placeholder="1" required/>
                                <InputGroup.Append>
                                    <InputGroup.Text id="timeFrameAppend">Weeks</InputGroup.Text>
                                </InputGroup.Append>
                                <Form.Control.Feedback type="invalid">
                                    Please set a time frame.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className="text-muted">
                                This is in weeks
                            </Form.Text>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" type="submit">Save changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default App;
