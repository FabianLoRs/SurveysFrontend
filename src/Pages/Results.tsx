import { FC, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import palette from "google-palette";
import { getPollResults } from "../Services/PollService";
import { ChartType, PollResult } from "../types";
import { PollChartData } from '../types/index';
import ResultChart from "../Components/Results/ResultCharts";

interface RouteParams {
    id: string
}

interface ResultProps extends RouteComponentProps<RouteParams> {

}

const Results:FC<ResultProps> = (props) => {
    const pollId = props.match.params.id;

    const [chartData, setChartData] = useState<PollChartData[]>([]);
    const [pollTitle, setPollTitle] = useState("");
    const [chartType, setChartType] = useState<ChartType>("PIE");

    const history = useHistory();

    useEffect(() => {
        fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchResults = async () => {
        try {
            const res: any = await getPollResults(pollId);
            const results:  PollResult[] = res.data.results;
            formatData(results);
            setPollTitle(res.data.content);
            // console.log(results)
            // console.log(res.data);
        } catch (error) {
            history.replace("/");
        }
    }

    const renderResultsChart = () => {
        return chartData.map(data => 
            <ResultChart chartType={chartType} chartData={data} key={data.questionId}></ResultChart>
        );
    }

    const formatData = (results: PollResult[]) => {
        const pollChartData: PollChartData[] = [];

        try {
            for(let key in results) {
                let chartData: any = {
                    data: {
                        labels: [],
                        datasets: [{data: []}]
                    },
                    title: results[key].question,
                    questionId: key
                }
                
                results[key].details.forEach(detail => {
                    chartData.data.labels?.push(detail.answer);
                    chartData.data.datasets[0].data.push(detail.result);
                });
                
                chartData.data.datasets[0].backgroundColor = palette('cb-Dark2', results[key].details.length).map((color: any) => '#' + color);
                pollChartData.push(chartData);
            }
        } catch (error) {
            console.log(error);
        }

        setChartData(pollChartData);
        // console.log(pollChartData);
    }
    return (
        <Container>
            <Row>
                <Col lg="6" md="10" sm="10" className="mx-auto mt-5">
                    <div className="header">
                        <h4>{pollTitle}</h4><hr />
                        <div className="mb-3">
                            <Form.Check 
                                inline
                                label="Gráfico de tortas"
                                name="chart"
                                type="radio"
                                id="chart-pie"
                                checked={chartType === "PIE"}
                                onChange={() => setChartType("PIE")}
                            />
                            <Form.Check 
                                inline
                                label="Gráfico de barras"
                                name="chart"
                                type="radio"
                                id="chart-bar"
                                checked={chartType === "BAR"}
                                onChange={() => setChartType("BAR")}
                            />
                        </div>
                    </div>
                    {renderResultsChart()}
                </Col>
            </Row>
        </Container>
    );
}

export default Results;