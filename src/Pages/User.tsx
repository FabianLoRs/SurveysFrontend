import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import ToastContainer from "react-bootstrap/ToastContainer";
import { confirmAlert } from "react-confirm-alert";
import ReactTooltip from "react-tooltip";
import ReactPaginate from "react-paginate";
import copy from "copy-to-clipboard";
import { List, Share, Trash } from "react-bootstrap-icons";
import { deletePoll, getUserPolls, togglePollOpened } from "../Services/PollService";
import Switch from "../Components/UI/Switch";
import { BASE_URL } from "../utils/constants";

const User = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [polls, setPolls] = useState<any>([]);

    useEffect(() => {
        fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);
    
    const fetchPolls = async () => {
        const res: any = await getUserPolls(currentPage);
        setPolls(res.data.polls);
        setTotalPages(res.data.totalPages);
        ReactTooltip.rebuild();
        setTotalRecords(res.data.totalRecords);
        /* console.log(res.data.polls);
        console.log(res); */
    }

    const handlePollToggle = async (id: number) => {
        const _polls = [...polls];
        const poll =  _polls.find(poll => poll.id === id);
        poll.opened = !poll.opened;
        setPolls(_polls);
        await togglePollOpened(poll.pollId);
    }

    const handleDeletePoll = (pollId: string) => {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div className="custom-ui">
                        <h2>Eliminar encuesta</h2>
                        <p>¿Quieres eliminar esta encuesta?</p>
                        <Button variant="outline-primary" size="sm" className="me-2"
                            onClick={ async () => {
                                await deletePoll(pollId);
                                currentPage === 0 ? fetchPolls() : setCurrentPage(0);
                                onClose();
                            }}
                        >
                            Si, eliminar!
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={onClose}>No</Button>
                    </div>
                );
            }
        });
    }

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected);
        console.log(selectedItem.selected);
    }

    const renderTable = () => { 
        return <Table className="mt-4 polls-table" striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Recibir mas respuestas</th>
                    <th>Acciones</th>
                </tr>                
            </thead>
            <tbody>
                {
                    polls.map((poll: any) => {
                        return (
                            <tr key={poll.id}>
                                <td>{ poll.content }</td>
                                <td>
                                    <Switch
                                        id={poll.pollId}
                                        onChange={() => {handlePollToggle(poll.id)}}
                                        label={!!poll.opened ? "Activado" : "Desactivado"}
                                        checked={!!poll.opened}
                                    ></Switch>
                                </td>
                                <td className="polls-table-controls">
                                    <span data-tip="Compartir encuesta"
                                        onClick={() => {
                                            copy(`${BASE_URL}/replypoll/${poll.pollId}`);
                                            setShowToast(true);
                                        }}
                                    ><Share></Share></span>
                                    <span data-tip="Ver resultados"><List></List></span>
                                    <span data-tip="Eliminar encuesta"
                                        onClick={() => handleDeletePoll(poll.pollId)}
                                    ><Trash></Trash></span>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </Table>
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col sm="10" md="10" lg="8" className="mx-auto">
                <h5>Mis encuestas</h5>
                    {
                        totalRecords > 0 && polls ?
                        <>
                            {renderTable()}
                            <ReactPaginate
                                pageCount={totalPages}
                                forcePage={currentPage}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={2}
                                previousLabel="Anterior"
                                nextLabel="Siguiente"
                                containerClassName="pagination justify-content-end"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                activeClassName="active"
                                breakLabel="..."
                                onPageChange={handlePageChange}
                            ></ReactPaginate>
                            <ReactTooltip place="top" effect="solid"></ReactTooltip>
                            <ToastContainer position="bottom-center">
                                <Toast show={showToast} delay={3000} autohide onClose={() => setShowToast(false)}>
                                    <Toast.Header closeButton={false}>Compartido!</Toast.Header>
                                    <Toast.Body>Enlace copiado al portapapeles</Toast.Body>
                                </Toast>
                            </ToastContainer>
                        </>
                        :
                        <span className="d-block mt-5">No tienes encuestas <Link to="/createpoll">comienza</Link> a crear</span>
                    }
                </Col>
            </Row>
        </Container>   
    );
}

export default User;