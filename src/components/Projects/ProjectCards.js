import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsGithub } from "react-icons/bs";

function ProjectCards(props) {
  return (
    <Card className="project-card-view">
      <Card.Body>
        <Card.Title  style={{ textAlign: "center" }}>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "justify" }}>
          {props.description}
        </Card.Text>
        <Button variant="primary m-1" href={props.ghLink} target="_blank">
          <BsGithub /> &nbsp;{"GitHub"}
        </Button>
        {props.liveLink && 
          <Button variant="primary m-1" href={props.liveLink} target="_blank">
            {"Live Demo"}
          </Button>
        }
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
