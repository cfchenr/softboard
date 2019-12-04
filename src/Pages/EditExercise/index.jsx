import React, { useState, useEffect } from "react";

import Navigationbar from "../Components/Navigationbar";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { put, get, remove, post } from "../../services/api";

export default function EditExercise(props) {
  const [show, setShow] = useState(false);
  const [processing, setProcessing] = useState(true);

  const [subheadingCount, setSubheadingCount] = useState(0);
  const [search_string, setSearch] = useState("");

  const handleClose = () => setShow(false);

  const getExercise = () => {
    get(
      "/exercise/" + props.match.params.id + "/",
      {},
      localStorage.getItem("@megua:access_token")
    )
      .then(response => {
        document.getElementById("form_exercise").title.value = response.Title;
        document.getElementById("form_exercise").problem.value =
          response.Problem;
        document.getElementById("form_exercise").tags.value = response.Tags
          ? response.Tags.slice(1, -1)
              .split(",")
              .map(tag => tag.slice(1, -1))
          : "";
        document.getElementById(
          "form_exercise"
        ).suggestion.value = response.Suggestion
          ? response.Suggestion.trim()
              .slice(1, -1)
              .split(",")
              .map(suggestion => suggestion.trim().slice(1, -1))
          : "";
        document.getElementById("form_exercise").solution.value =
          response.Solution;
        document.getElementById("form_exercise").resolution.value =
          response.Resolution;
        get(
          "/subheading/" + props.match.params.id + "/",
          {},
          localStorage.getItem("@megua:access_token")
        )
          .then(response2 => {
            setSubheadingCount(response2.results.length);
            if (!response2.hasNotSubHeadings) {
              response2.results.map((subheading, i) => {
                addSubheading(i);
                document.getElementsByName("subheading_order_" + i)[0].value =
                  subheading.Order;
                document.getElementsByName(
                  "subheading_question_" + i
                )[0].value = subheading.Question;
                document.getElementsByName(
                  "subheading_tags_" + i
                )[0].value = subheading.Tags
                  ? subheading.Tags.slice(1, -1)
                      .split(",")
                      .map(tag => tag.trim().slice(1, -1))
                  : "";
                document.getElementsByName(
                  "subheading_suggestion_" + i
                )[0].value = subheading.Suggestion
                  ? subheading.Suggestion.slice(1, -1)
                      .split(",")
                      .map(suggestion => suggestion.trim().slice(1, -1))
                  : "";
                document.getElementsByName(
                  "subheading_solution_" + i
                )[0].value = subheading.Solution;
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const addSubheading = (index = null) => {
    var count = subheadingCount;
    if (index !== null) {
      count = index;
    }
    const div = document.getElementById("subheadings");
    var subheading = document.createElement("div");
    subheading.setAttribute("id", "subheading_" + count);
    subheading.setAttribute("style", "margin-bottom: 50px");
    var title = document.createElement("h3");
    title.innerHTML = "Alínea " + (count + 1);
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
    textArea.setAttribute("name", "subheading_order_" + count);
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
    textArea.setAttribute("name", "subheading_question_" + count);
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
    textArea.setAttribute("name", "subheading_tags_" + count);
    textArea.setAttribute("placeholder", "Separadas por vírgulas");
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
    textArea.setAttribute("name", "subheading_suggestion_" + count);
    textArea.setAttribute("placeholder", "Separadas por vírgulas");
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
    textArea.setAttribute("name", "subheading_solution_" + count);
    formGroup.appendChild(label);
    col.appendChild(textArea);
    formGroup.appendChild(col);
    subheading.appendChild(formGroup);

    div.appendChild(subheading);
    if (index === null) setSubheadingCount(subheadingCount + 1);
  };

  const removeSubheading = () => {
    const temp = document.getElementById("subheadings");
    temp.removeChild(temp.lastChild);
    setSubheadingCount(subheadingCount - 1);
  };

  const sendExercise = async event => {
    event.preventDefault();
    setShow(true);
    setProcessing(true);
    put(
      "/exercise/" + props.match.params.id + "/",
      {
        Title: event.target.elements.title.value,
        Problem: event.target.elements.problem.value,
        Tags:
          event.target.elements.tags.value.trim().length === 0
            ? ""
            : "[" +
              event.target.elements.tags.value
                .split(",")
                .map(tag => "'" + tag.trim() + "'") +
              "]",
        Suggestion:
          event.target.elements.suggestion.value.trim().length === 0
            ? ""
            : "[" +
              event.target.elements.suggestion.value
                .split(",")
                .map(suggestion => "'" + suggestion.trim() + "'") +
              "]",
        Resolution: event.target.elements.resolution.value
      },
      localStorage.getItem("@megua:access_token")
    )
      .then(async response => {
        await remove(
          "/subheading/" + props.match.params.id + "/",
          {},
          localStorage.getItem("@megua:access_token")
        )
          .then(async response_remove => {
            await addSubheadings(response);
          })
          .catch(async error => {
            console.log(error);
            document.getElementById("results").innerHTML +=
              "<h4>Sem alíneas para atualizar! <i class='fa fa-check fa-1x text-success' /></h4>";
            await addSubheadings(response);
          });

        setProcessing(false);
      })
      .catch(error => {
        //TODO Tratamento de erros
        console.log(error);
        setProcessing(false);
        document.getElementById("results").innerHTML +=
          "<h4>Ocorreu um erro ao adicionar o exercício! <i class='fa fa-times fa-1x text-danger' /></h4>";
      });
  };

  const addSubheadings = async response => {
    document.getElementById("results").innerHTML +=
      "<h4>Exercício adicionadao com sucesso! <i class='fa fa-check fa-1x text-success' /></h4>";
    for (var i = 0; i < subheadingCount; i++) {
      await post(
        "/subheading/",
        {
          Exercise: response.id,
          Order: document.getElementsByName("subheading_order_" + i)[0].value,
          Question: document.getElementsByName("subheading_question_" + i)[0]
            .value,
          Tags:
            document.getElementsByName("subheading_tags_" + i)[0].value.trim()
              .length === 0
              ? ""
              : "[" +
                document
                  .getElementsByName("subheading_tags_" + i)[0]
                  .value.split(",")
                  .map(tag => "'" + tag.trim() + "'") +
                "]",
          Suggestion:
            document
              .getElementsByName("subheading_suggestion_" + i)[0]
              .value.trim().length === 0
              ? ""
              : "[" +
                document
                  .getElementsByName("subheading_suggestion_" + i)[0]
                  .value.split(",")
                  .map(suggestion => "'" + suggestion.trim() + "'") +
                "]",
          Solution: document.getElementsByName("subheading_solution_" + i)[0]
            .value
        },
        localStorage.getItem("@megua:access_token")
      )
        .then(reponse2 => {
          document.getElementById("results").innerHTML +=
            "<h4>Alínea " +
            (i + 1) +
            " adicionada com sucesso! <i class='fa fa-check fa-1x text-success' /></h4>";
        })
        .catch(error => {
          console.log(error);
          document.getElementById("results").innerHTML +=
            "<h4>Ocorreu um erro ao adicionar a alínea " +
            (i + 1) +
            "! <i class='fa fa-times fa-1x text-danger' /></h4>";
        });
    }
  };

  useEffect(() => {
    getExercise();
  }, []);

  return (
    <>
      <div className="background">
        <Navigationbar search_string={search_string} setSearch={setSearch} />
        <div className="content-body">
          <div className="content">
            <Container>
              <Form
                id="form_exercise"
                onSubmit={event => {
                  sendExercise(event);
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
                    <Form.Control name="tags" type="text" />
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
                <Button onClick={() => addSubheading()}>
                  Adicionar alínea
                </Button>
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
                  Editar
                </Button>
              </Form>
            </Container>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        aria-labelledby="contained-modal-title-vcenter"
        data-backdrop="static"
        data-keyboard="false"
        centered
      >
        <Modal.Body className="text-center">
          {processing && (
            <h4 id="processing">
              <Spinner animation="border" variant="primary" /> A processar...
            </h4>
          )}
          <div id="results" className="mt-3"></div>
        </Modal.Body>
        {!processing && (
          <Modal.Footer>
            <Button variant="success" href="/dashboard/">
              Dashboard
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}
