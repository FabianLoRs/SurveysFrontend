import { FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Check2Circle } from "react-bootstrap-icons/";
import { createPollReply, getPollWithQuestions } from "../../Services/PollService";
import { PollReplyDetail, Question, UserAnswer } from "../../types";
import ReplyQuestion from './ReplyQuestion';

interface PollProps {
    id: string
}

const Poll:FC<PollProps> = ({ id }) => {
    const [poll, setPoll] = useState<any>(null);
    const [user, setUser] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [userAnswers, setUserAnswers] = useState<any>({});
    const [isPollAnswered, setIsPollAnswered] = useState(false);
    const [sendingData, setSendingData] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPoll = async () => { 
        try {
            const res: any = await getPollWithQuestions(id);
            const data = res.data;
            //console.log(data);
            data.questions = data.questions.sort((a: Question, b: Question) => a.questionOrder - b.questionOrder); // Para ordenar de menor a mayor
            //console.log(data.questions);
            setPoll(data);
        } catch (error: any) {
            if (error.response.status === 500) {
                history.replace("/");
            }
            // TODO redireccionar a pagina principal si encuesta no existe
        }
    }

    const handleQuestionChange = (answer: UserAnswer) => {
        const answers = {...userAnswers};
        switch(answer.type) {
            case "RADIO":
            case "SELECT": {
                answers[answer.questionId] = {questionId: answer.questionId, answerId: answer.answer}
                break;
            }
            case "CHECKBOX": {
                if (answers[answer.questionId]) {
                    const arr = answers[answer.questionId].answers;
                    const index = arr.indexOf(answer.answer);
                    if (index === -1) {
                        arr.push(answer.answer);    
                    } else {
                        arr.length < 2 ? delete answers[answer.questionId]: arr.splice(index, 1);
                    }
                } else {
                    answers[answer.questionId] = {questionId: answer.questionId, answers: [answer.answer]};
                }
                break;
            }
        }
        setUserAnswers(answers);
    }

    const renderQuestions = () => {
        return poll.questions.map((question: Question)  => <ReplyQuestion
        changeCallback={handleQuestionChange}
            question={question} key={question.id}
        ></ReplyQuestion>)
    }
    
    const prepareForm = async () => {
        setErrors({});
        
        if (Object.keys(userAnswers).length !== poll.questions.length) {
            setErrors((current: any) => {
                return {...current, allQuestionsAnswered: "Por favor responda todas las preguntas"}
            });
            return;
        }
        
        let replies: PollReplyDetail[] = [];
        for(let key in userAnswers) {
            if (userAnswers[key].answers) {
                userAnswers[key].answers.forEach((id: number) => replies.push({
                    questionId: userAnswers[key].questionId, answerId: id
                }));
            } else {
                replies.push(userAnswers[key]);
            }
        }
        sendForm(replies);
    }
    
    const sendForm = async (replies: PollReplyDetail[]) => {
        try {
            setSendingData(true);
            await createPollReply({
                pollReplies: replies,
                poll: poll.id,
                user: user
            });
            setSendingData(false);
            setIsPollAnswered(true);
        } catch (errors: any) {
            if (errors.response) {
                errors.response.status === 400 && setErrors(errors.response.data.errors);
            }
            setIsPollAnswered(false);
        }
    }

    return (
        <Container>
            <Row>
                <Col className="mx-auto mt-5 mb-5" sm="10" md="10" lg="8">
                    {
                        isPollAnswered && 
                        <div className="d-flex align-items-center flex-column poll-answered-container">
                            <Check2Circle className="success-icon"></Check2Circle>
                            <Alert show={isPollAnswered} variant="success">Muchas gracias por tus repuestas!</Alert>
                        </div>
                    }
                    {
                        poll && !isPollAnswered && <>
                            <h2>{poll.content}</h2><hr />
                            <Form.Group className="mb-3" controlId="user">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    value={user}
                                    onChange={e => setUser(e.target.value)}
                                    type="text"
                                    placeholder="e.j. Fabian"
                                    isInvalid={!!errors.user}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.user}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <div>
                                {renderQuestions()}
                            </div>
                            <Button onClick={prepareForm}>Responder Encuesta</Button>
                            {
                                errors.allQuestionsAnswered && <Alert className="mt-4" variant="danger">
                                    {errors.allQuestionsAnswered}
                                </Alert>
                            }
                        </> 
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default Poll;