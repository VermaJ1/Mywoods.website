import { useEffect, useState } from "react";
import HomeDetail from "../features/Home";
import Layout from "../layout/page";
import CardData from "../sampleData/cardData";
import { Col, Container, Row } from "react-bootstrap";
import Card from "../components/molecule/card";

const Home = () => {

    return (
        <>
            <HomeDetail data={CardData} />


            <Container fluid>
                <Row>

                    {/* {CardData.map((item) => (
                        <Col>
                            <Card key={item.id} item={item} />
                        </Col>
                    ))} */}


                    <Col md={1} className="column_b">
                    
                    </Col>

                    <Col md={8} className="column_b">
                    
                    </Col>

                    <Col md={1} className="column_b">
                    
                    </Col>

<Col md={2} className="column_b">
                   
                    </Col>

<Col md={2} className="column_b">
                    
                    </Col>

                </Row>
            </Container>
        </>
    );
};

export default Home;