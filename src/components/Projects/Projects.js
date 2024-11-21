import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import webbook from '../Images/webbook.png'
import Particle from "../Particle";
import ProjectCards from "./ProjectCards";
function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCards
              imgPath={webbook}
              isBlog={false}
              title="WebBook"
              description="A personal digital notebook designed to seamlessly blend productivity with creativity. Capture your thoughts, ideas, and inspirations with ease, while planning your projects and managing tasks all in one place. With an intuitive interface and versatile features, it empowers you to stay organized effortlessly and turn your vision into reality."
              ghLink="https://github.com/soumyajit4419/Chatify"
              demoLink="https://chatify-49.web.app/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
