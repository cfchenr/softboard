import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Badge from "react-bootstrap/Badge";
import { get } from "../../services/api";
import parse from "html-react-parser";
import MathJax from "react-mathjax2";

export default function ListExercises(props) {
  const [exercises, setExercises] = useState([]);

  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  const getExercises = () => {
    var str = ""
    if(props.retrieve) {
      str =
      props.search_string.trim() === ""
        ? "/exerciseRetrieve/"
        : "/exerciseRetrieve/?search=" + props.search_string;
    }
    else {
      str =
      props.search_string.trim() === ""
        ? "/exercise/"
        : "/exercise/?search=" + props.search_string;
    }
    return get(str, {})
      .then(response => {
        //TODO: para cada exercicio, ir buscar as alineas
        const temp = [];
        if (response.results.length === 0) {
          setExercises([]);
        }

        response.results.map(async (exercise, i) => {
          return await get("/subheading/" + exercise.id + "/", {})
            .then(response2 => {
              if (!exercise.hasNotSubHeadings) {
                var indexSubheading = 0;
                if (response2.results) {
                  response2.results.map(subheading => {
                    if (subheading.Question) {
                      subheading.Question = subheading.Question.replace(
                        /href/g,
                        "target='_blank' href"
                      );
                    }
                    if (subheading.Solution) {
                      subheading.Solution = subheading.Solution.replace(
                        /href/g,
                        "target='_blank' href"
                      );
                    }
                    if (subheading.Suggestion) {
                      subheading.Suggestion = subheading.Suggestion.replace(
                        /href/g,
                        "target='_blank' href"
                      );
                    }
                    response2.results[indexSubheading] = subheading;
                    indexSubheading++;
                  });
                }
                exercise.Subheadings = response2.results;
              }
              exercise.Problem = exercise.Problem.replace(
                /href/g,
                "target='_blank' href"
              );
              temp[i] = exercise;
              if (i + 1 === response.results.length) setExercises(temp);
            })
            .catch(error2 => {
              console.log(error2);
            });
        });
      })
      .catch(error => {
        //TODO Tratamento de erros
        console.log(error);
      });
  };

  useEffect(() => {
    getExercises();
  }, [props.search_string]);


  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("Error");
  const [modalBody, setModalBody] = useState("Error");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function render_HTML_MATHJax(tags) {
    return tags.map((tag, index) => {
      if (index % 2 === 0) {
        return <MathJax.Context
        options={{
          asciimath2jax: {
            useMathMLspacing: true,
            delimiters: [
              ["$", "$"]
            ],
            preview: "none"
          }
        }}
        key={index}
      >
        <MathJax.Text text={parse("<div>"+tag+"<div>")} />
      </MathJax.Context>
      } else {
        return (
          <MathJax.Context
            options={{
              asciimath2jax: {
                useMathMLspacing: true,
                delimiters: [
                  ["$$", "$$"],
                  ["$", "$"]
                ],
                preview: "none"
              }
            }}
            key={index}
          >
            <MathJax.Text text={"$$"+tag+"$$"} />
          </MathJax.Context>
        );
      }
    })
  }

  return (
    <div className="content-body">
      <div className="content">
        <Container>
          <Row>
            {exercises.map((exercise, i) => {
              return (
                <Col key={i} xs={12} className="mt-3">
                  <h1><a href={'/exercise/'+exercise.ExerciseId} style={{color: 'var(--white-color)'}}>{parse(exercise.Title)}</a></h1>
                  {render_HTML_MATHJax(exercise.Problem.split("$$"))}
                  {exercise.Subheadings &&
                    exercise.Subheadings.map((subheading, j) => {
                      return (
                        <div key={j}>
                          <b>
                            {subheading.Order}
                            {") "}
                          </b>
                          {render_HTML_MATHJax(subheading.Question.split("$$"))}
                          <ButtonGroup size="sm" className="mt-3 mb-3">
                            {subheading.Suggestion && <Button
                              variant="outline-warning"
                              onClick={() => {
                                setModalTitle("Sugestão");
                                const string = subheading.Suggestion.substring(1, subheading.Suggestion.length-1)
                                const array = string.split(",")
                                setModalBody(array.map((item) => {
                                  const value = item.trim().substring(1, item.trim().length-1)+" ";
                                  return render_HTML_MATHJax(value.split("$$"))
                                }))
                                handleShow();
                              }}
                            >
                              Sugestão
                            </Button>}
                            {subheading.Solution && <Button
                              variant="outline-danger"
                              onClick={() => {
                                setModalTitle("Solução");
                                setModalBody(render_HTML_MATHJax(subheading.Solution.split("$$")));
                                handleShow();
                              }}
                            >
                              Solução
                            </Button>}
                            {subheading.Tags && <Button
                              variant="outline-info"
                              onClick={() => {
                                setModalTitle("Tags");
                                const array = subheading.Tags.replace(/'/g, '"');
                                setModalBody(JSON.parse(array).map((tag, tagi) => {
                                  return <Badge variant="info mr-2">{tag}</Badge>
                                })
                                );
                                handleShow();
                              }}
                            >
                              Tags
                            </Button>}
                          </ButtonGroup>
                        </div>
                      );
                    })}
                  <ButtonGroup size="sm" className="mt-3 mb-3">
                    {exercise.Suggestion && <Button
                      variant="outline-warning"
                      onClick={() => {
                        setModalTitle("Sugestão");
                        const string = exercise.Suggestion.substring(1, exercise.Suggestion.length-1)
                        const array = string.split(",")
                        setModalBody(array.map((item) => {
                          const value = item.trim().substring(1, item.trim().length-1)+" ";
                          return render_HTML_MATHJax(value.split("$$"))
                        }));
                        handleShow();
                      }}
                    >
                      Sugestão
                    </Button>}
                    {exercise.Solution && <Button
                      variant="outline-danger"
                      onClick={() => {
                        setModalTitle("Solução");
                        setModalBody(render_HTML_MATHJax(exercise.Solution.split("$$")));
                        handleShow();
                      }}
                    >
                      Solução
                    </Button>}
                    {exercise.Tags && <Button
                      variant="outline-info"
                      onClick={() => {
                        setModalTitle("Tags");
                        const array = exercise.Tags.replace(/'/g, '"');
                        setModalBody( JSON.parse(array).map((tag, tagi) => {
                          return <Badge variant="info mr-2">{tag}</Badge>
                        })
                        );
                        handleShow();
                      }}
                    >
                      Tags
                    </Button>}
                    {exercise.Resolution && <Button
                      variant="outline-success"
                      size="sm"
                      className="mt-3 mb-5"
                      onClick={() => {
                        setModalTitle("Resolução");
                        setModalBody(render_HTML_MATHJax(exercise.Resolution.split("$$")));
                        handleShow();
                      }}
                    >
                      Resolução
                    </Button>}
                  </ButtonGroup>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
