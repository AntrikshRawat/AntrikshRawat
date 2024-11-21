import React from "react";
import { Container, Row, Col } from "react-bootstrap";
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
              title="Verdant Autobots"
              description="Verdant is an innovative platform designed to promote sustainable living by connecting users with eco-friendly products and resources. Built with React and Node.js, the platform emphasizes a user-friendly interface and smooth navigation. Verdant features curated categories, responsive design, and secure token-based authentication for personalized experiences."
              ghLink="https://github.com/AntrikshRawat/WebBook-F"
              demoLink="https://chatify-49.web.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCards
              isBlog={false}
              title="WebBook"
              description="A personal digital notebook designed to seamlessly blend productivity with creativity. Capture your thoughts, ideas, and inspirations with ease, while planning your projects and managing tasks all in one place. With an intuitive interface and versatile features, it empowers you to stay organized effortlessly and turn your vision into reality."
              ghLink="https://github.com/AntrikshRawat/WebBook-F"
              demoLink="https://chatify-49.web.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCards
              title="NewsBuddy"
              description="
              NewsBuddy is a web application that brings you the latest news from around the world, sourced directly from reliable APIs. Built with React and Axios, it offers a seamless user experience with real-time updates and responsive design. The platform categorizes news into various sections, ensuring users can quickly access topics of interest. I implemented robust API integration to fetch, display, and manage data efficiently."
              ghLink="https://github.com/AntrikshRawat/WebBook-F"
              demoLink="https://chatify-49.web.app/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
