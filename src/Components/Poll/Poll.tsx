import { useState } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ToastContainer  from "react-bootstrap/ToastContainer";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { usePollDispatch, usePollState } from "../../context/pollContext";
import Question from "./Question";
import { savePoll } from '../../Services/PollService';

const Poll = () => {

    const [showToast, setShowToast] = useState(false);
    const [sendingData, setSendingData] = useState(false);

    const poll = usePollState();
    const pollDispatch = usePollDispatch();

    const errors: any = poll.errors;

    const renderQuestions = () => {
        return poll.questions.map((question, index) => {
            return <Draggable key={question.id} draggableId={question.id} index={index}>
                {
                    (provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <Question index={index}></Question>
                            {/*<Question key={question.id} index={index}></Question>*/}
                        </div>
                    )
                }
            </Draggable>
        });
    };

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        if (result.source.index === result.destination.index) return;

        pollDispatch({
            type: "orderquestions",
            payload: {
                source: result.source.index,
                destination: result.destination.index
            }
        });
    };

    const createPoll = async () => {
        const data = {
            content: poll.content,
            opened: poll.opened,
            questions: poll.questions
        };
        
        try {
            setSendingData(true);
            await savePoll(data);
            pollDispatch({
                type: "resetformpoll"
            });
            setShowToast(true);
            setSendingData(false);
        } catch (errors: any) {
            if (errors.response && errors.response.status === 400) {
                pollDispatch({
                    type: 'seterrors',
                    errors: errors.response.data.errors
                });
            };
            setSendingData(false);
        };
    };
    
    return (
        <Container className="mt-5 mb-5">
            <Row>
                <Col className="mx-auto" sm="10" md="10" lg="8">
                    <FloatingLabel controlId="poll-content" label="Título de la encuesta">
                        <Form.Control 
                        value={poll.content}
                        onChange={(e) => pollDispatch({
                            type: "pollcontent",
                            content: e.target.value
                        })}
                        size="lg"
                        type="text"
                        placeholder="Título de la encuesta"
                        isInvalid={!!errors?.content}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors?.content}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId={uuid()}>
                            {
                                (provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {renderQuestions()}
                                        {provided.placeholder}
                                    </div>
                                )
                            }
                        </Droppable>
                    </DragDropContext>
                    
                    <Button 
                        className="mt-5"
                        size="lg"
                        variant="outline-primary"
                        onClick={createPoll}
                    >
                        { sendingData ? <>
                            <Spinner 
                                animation="border"
                                as="span"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            ></Spinner>&nbsp;
                            <span>Creando encuesta...</span>
                        </> :
                            <>Crear encuesta</>
                        }
                    </Button>
                </Col>
            </Row>
            
            <ToastContainer position="bottom-center">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide>
                    <Toast.Header closeButton={false}>
                        <span>La encuesta a sido creada</span>
                    </Toast.Header>
                    <Toast.Body>Puedes copiar el enlace desde el panel</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default Poll;