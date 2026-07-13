import { useState } from "react";
import React from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  ButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import axios from "axios";
const hostname = window.location.hostname;

const RecipeConfigPage = () => {
  const [dbValues, setDBValue] = useState("0");
  const [graphValue, setGraphValue] = useState("0");

  const dbOption = [
    { name: "Yes", value: "1" },
    { name: "No", value: "0" },
  ];

  const graphOption = [
    { name: "Yes", value: "1" },
    { name: "No", value: "0" },
  ];

  const deviceInfo = localStorage.getItem("device");
  const deviceInfoJSON = JSON.parse(deviceInfo);

  const [values, setValues] = useState({
    recipeId: deviceInfoJSON.recipeid, // มาแก้เอานะ อุอิ
  });

  const DB_ON = async (event) => {
    event.preventDefault();
    await axios
      .get(`http://${hostname}:8080/db/start`)
      .then((res) => {
        // Handle response
        if (res.status === 200) {
          // console.log(res.data);

          alert("Start!!!");
          //localStorage.setItem("device", JSON.stringify(res.data));
        } else {
          console.log("Unexpected status code:", res.status);
        }
      })
      .catch((err) => {
        // Handle errors
        console.error(err);
      });
  };

  const DB_OFF = async (event) => {
    event.preventDefault();
    await axios
      .get(`http://${hostname}:8080/db/stop`)
      .then((res) => {
        // Handle response

        if (res.status === 200) {
          // console.log(res.data);

          alert("Stop!!!");
          //localStorage.setItem("device", JSON.stringify(res.data));
        } else {
          console.log("Unexpected status code:", res.status);
        }
      })
      .catch((err) => {
        // Handle errors
        console.error(err);
      });
  };

  const VI_ON = async (event) => {
    event.preventDefault();
    await axios
      .get(`http://${hostname}:8080/dashboard/start`)
      .then((res) => {
        // Handle response

        if (res.status === 200) {
          // console.log(res.data);

          alert("Start!!!");
          // localStorage.setItem("device", JSON.stringify(res.data));
        } else {
          console.log("Unexpected status code:", res.status);
        }
      })
      .catch((err) => {
        // Handle errors
        console.error(err);
      });
  };

  const VI_OFF = async (event) => {
    event.preventDefault();
    await axios
      .get(`http://${hostname}:8080/dashboard/stop`)
      .then((res) => {
        // Handle response

        if (res.status === 200) {
          // console.log(res.data);

          alert("Stop!!!");
          // localStorage.setItem("device", JSON.stringify(res.data));
        } else {
          console.log("Unexpected status code:", res.status);
        }
      })
      .catch((err) => {
        // Handle errors
        console.error(err);
      });
  };

  return (
    <Container className="mt-4">
      <Card className="mx-auto">
        <Card.Header>
          <div>
            <h2>Recipe</h2>
          </div>
        </Card.Header>
        <Card.Body className="flex-grow-1">
          {/*first layer*/}
          <Row>
            <Col xs={12} md={4}>
              <div>
                <p>Recipe ID</p>
              </div>
            </Col>
            <Col xs={12} md={8}>
              <div>
                <p>{values.recipeId}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <div>
                <p>Server</p>
              </div>
            </Col>
            <Col xs={12} md={8}>
              <div>
                <p>Connect</p>
              </div>
            </Col>
          </Row>
          <hr className="my-2"></hr>
          <br></br>
          {/*second layer*/}
          <Row>
            {/* Database Menu */}
            <Col xs={12} md={4}>
              <div>
                <p>Database</p>
              </div>
            </Col>
            <Col xs={12} md={4}>
              {/* <ButtonGroup>
                                {dbOption.map((db, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`db-${idx}`}
                                        type="radio"
                                        variant={idx % 2 ? 'outline-danger' : 'outline-success'}
                                        name="database"
                                        value={db.value}
                                        checked={dbValues === db.value}
                                        if (db.value ==1){
                                        onChange={(e) => DB_ON(e.currentTarget.value)}
                                            else ()
                                        onChange={(e) => DB_OFF(e.currentTarget.value)}
                                        }
                                        {db.name}
                                    </ToggleButton>
                                ))} 
                            </ButtonGroup> */}

              <Button id="db_on" onClick={DB_ON} variant="secondary">
                ON
              </Button>
              <Button id="db_off" onClick={DB_OFF} variant="secondary">
                OFF
              </Button>
            </Col>
            <Col xs={12} md={4}>
              <div>
                <a href="http://localhost:8086/" target="_blank">
                  InfluxDB
                </a>
              </div>
            </Col>

            {/* Visualization Menu */}
            <Col xs={12} md={4}>
              <div>
                <p>Visualization</p>
              </div>
            </Col>
            <Col xs={12} md={4}>
              {/* <ButtonGroup>
                                {graphOption.map((graph, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`graph-${idx}`}
                                        type="radio"
                                        variant={idx % 2 ? 'outline-danger' : 'outline-success'}
                                        name="visualize"
                                        value={graph.value}
                                        checked={graphValue === graph.value}
                                        onChange={(e) => setGraphValue(e.currentTarget.value)}
                                    >
                                        {graph.name}
                                    </ToggleButton>
                                ))}
                            </ButtonGroup>*/}

              <Button id="vi_on" onClick={VI_ON} variant="secondary">
                ON
              </Button>
              <Button id="vi_off" onClick={VI_OFF} variant="secondary">
                OFF
              </Button>
            </Col>
            <Col xs={12} md={4}>
              <div>
                <a href="http://localhost:3000/" target="_blank">
                  Grafana
                </a>
              </div>
            </Col>
            {/* ML-Box Menu */}
            <Col xs={12} md={4}>
              <div>
                <p>ML-Box</p>
              </div>
            </Col>
          </Row>

          {/* Third Layer */}
          <Row className="mt-2">
            <Col className="text-center mt-auto">
              {/* <Button variant="primary" className="btn-lg rounded-pill" style={{ width: '10%' }}>
                                Save
                            </Button>*/}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RecipeConfigPage;
