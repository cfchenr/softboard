import React, { useState } from "react";

import Navigationbar from "../Components/Navigationbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function Exercise(props) {
  const [subheadingCount, setSubheadingCount] = useState(0);
  const [search_string, setSearch] = useState("");

  const addSubheading = () => {
    const div = document.getElementById("subheadings");
    var subheading = document.createElement("div");
    subheading.setAttribute("id", "subheading_" + subheadingCount);
    subheading.setAttribute("style", "margin-bottom: 50px");
    var title = document.createElement("h3");
    title.innerHTML = "Alínea " + (subheadingCount + 1);
    subheading.appendChild(title);
    var formGroup = document.createElement("div");
    formGroup.setAttribute("class", "form-group row");
    var label = document.createElement("label");
    label.setAttribute("class", "form-label col-form-label col-sm-2");
    label.innerHTML = "Identificação";
    var col = document.createElement("div");
    col.setAttribute("class", "col-sm-10");
    var textArea = document.createElement("input");
    textArea.setAttribute("class", "form-control");
    textArea.setAttribute("name", "subheading_order_" + subheadingCount);
    textArea.setAttribute("required", true);
    formGroup.appendChild(label);
    col.appendChild(textArea);
    formGroup.appendChild(col);
    subheading.appendChild(formGroup);

    formGroup = document.createElement("div");
    formGroup.setAttribute("class", "form-group row");
    label = document.createElement("label");
    label.setAttribute("class", "form-label col-form-label col-sm-2");
    label.innerHTML = "Questão";
    col = document.createElement("div");
    col.setAttribute("class", "col-sm-10");
    textArea = document.createElement("textarea");
    textArea.setAttribute("rows", 3);
    textArea.setAttribute("class", "form-control");
    textArea.setAttribute("name", "subheading_question_" + subheadingCount);
    textArea.setAttribute("required", true);
    formGroup.appendChild(label);
    col.appendChild(textArea);
    formGroup.appendChild(col);
    subheading.appendChild(formGroup);

    formGroup = document.createElement("div");
    formGroup.setAttribute("class", "form-group row");
    label = document.createElement("label");
    label.setAttribute("class", "form-label col-form-label col-sm-2");
    label.innerHTML = "Tags";
    col = document.createElement("div");
    col.setAttribute("class", "col-sm-10");
    textArea = document.createElement("input");
    textArea.setAttribute("class", "form-control");
    textArea.setAttribute("name", "subheading_tags_" + subheadingCount);
    formGroup.appendChild(label);
    col.appendChild(textArea);
    formGroup.appendChild(col);
    subheading.appendChild(formGroup);

    formGroup = document.createElement("div");
    formGroup.setAttribute("class", "form-group row");
    label = document.createElement("label");
    label.setAttribute("class", "form-label col-form-label col-sm-2");
    label.innerHTML = "Sugestão";
    col = document.createElement("div");
    col.setAttribute("class", "col-sm-10");
    textArea = document.createElement("textarea");
    textArea.setAttribute("rows", 3);
    textArea.setAttribute("class", "form-control");
    textArea.setAttribute("name", "subheading_suggestion_" + subheadingCount);
    formGroup.appendChild(label);
    col.appendChild(textArea);
    formGroup.appendChild(col);
    subheading.appendChild(formGroup);

    formGroup = document.createElement("div");
    formGroup.setAttribute("class", "form-group row");
    label = document.createElement("label");
    label.setAttribute("class", "form-label col-form-label col-sm-2");
    label.innerHTML = "Solução";
    col = document.createElement("div");
    col.setAttribute("class", "col-sm-10");
    textArea = document.createElement("textarea");
    textArea.setAttribute("rows", 3);
    textArea.setAttribute("class", "form-control");
    textArea.setAttribute("name", "subheading_solution_" + subheadingCount);
    formGroup.appendChild(label);
    col.appendChild(textArea);
    formGroup.appendChild(col);
    subheading.appendChild(formGroup);

    div.appendChild(subheading);
    setSubheadingCount(subheadingCount + 1);
  };

  const removeSubheading = () => {
    const temp = document.getElementById("subheadings");
    temp.removeChild(temp.lastChild);
    setSubheadingCount(subheadingCount - 1);
  };

  return (
    <>
      <div className="background">
        <Navigationbar search_string={search_string} setSearch={setSearch} />
        <div className="content-body">
          <div className="content">
            <Container>
              <Form
                onSubmit={event => {
                  event.preventDefault();
                  console.log(event.target.elements);
                }}
              >
                <h3>Exercício</h3>
                <Form.Group as={Row} controlId="ControlInput1">
                  <Form.Label column sm="2">
                    Título
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control name="title" type="text" required />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="ControlTextarea1">
                  <Form.Label column sm="2">
                    Problema
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      name="problem"
                      as="textarea"
                      rows="3"
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="ControlInput2">
                  <Form.Label column sm="2">
                    Tags
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control name="tags" type="text" required />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="ControlTextarea2">
                  <Form.Label column sm="2">
                    Sugestão
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control name="suggestion" as="textarea" rows="3" />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="ControlTextarea3">
                  <Form.Label column sm="2">
                    Solução
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control name="solution" as="textarea" rows="3" />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="ControlTextarea4">
                  <Form.Label column sm="2">
                    Resolução
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control name="resolution" as="textarea" rows="3" />
                  </Col>
                </Form.Group>
                <div id="subheadings" style={{ marginTop: 100 }}></div>
                <Button onClick={addSubheading}>Adicionar alínea</Button>
                {subheadingCount > 0 && (
                  <Button
                    className="ml-4"
                    variant="danger"
                    onClick={removeSubheading}
                  >
                    Remover alínea
                  </Button>
                )}
                <Button type="submit" className="ml-4" variant="success">
                  Submeter
                </Button>
              </Form>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
