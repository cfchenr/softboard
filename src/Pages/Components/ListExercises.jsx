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
import "./index.css";

export default function ListExercises(props) {
  const [loggedin, setLoggedState] = useState(null);
  const [exercises, setExercises] = useState([]);

  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }

  const handleEvent = e => {
    console.log(e.currentTarget.href);
  };

  const getExercises = () => {
    console.log(loggedin);
    if (!loggedin) return;
    var str =
      props.search_string.trim() === ""
        ? "/exercise/"
        : "/exercise/?search=" + props.search_string;
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
                        "target='_blank' onClick='handelEvent()' href"
                      );
                    }
                    if (subheading.Solution) {
                      subheading.Solution = subheading.Solution.replace(
                        /href/g,
                        "target='_blank' onClick='handelEvent()' href"
                      );
                    }
                    if (subheading.Suggestion) {
                      subheading.Suggestion = subheading.Suggestion.replace(
                        /href/g,
                        "target='_blank' onClick='handelEvent()' href"
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
                "target='_blank' onClick='handelEvent()' href"
              );
              temp[i] = exercise;
              if (i + 1 === response.results.length) {
                setExercises(temp);
              }
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

  var login_state = localStorage.getItem("@megua:loggedin");

  useState(() => {
    if (login_state !== null) {
      setLoggedState(true);
    }
  }, []);

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
        return (
          <MathJax.Context
            options={{
              asciimath2jax: {
                useMathMLspacing: true,
                delimiters: [["$", "$"]],
                preview: "none"
              }
            }}
            key={index}
          >
            <MathJax.Text
              text={parse("<div>" + tag + "<div>", {
                replace: domNode => {
                  if (domNode.name === "a") {
                    delete domNode.attribs.onclick;
                    return React.createElement(
                      "a",
                      {
                        ...domNode.attribs,
                        onClick: e => {
                          handleEvent(e);
                        }
                      },
                      domNode.children[0].data
                    );
                  }
                }
              })}
            />
          </MathJax.Context>
        );
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
            <MathJax.Text text={"$$" + tag + "$$"} />
          </MathJax.Context>
        );
      }
    });
  }

  return (
    <div className="content-body">
      <div className="content">
        <Container>
          {loggedin ? (
            <Row>
              {exercises.map((exercise, i) => {
                return (
                  <Col key={i} xs={12} className="mt-3">
                    <h1>
                      <a
                        href={"/exercise/" + exercise.ExerciseId}
                        style={{ color: "var(--white-color)" }}
                      >
                        {parse(exercise.Title)}
                      </a>
                    </h1>
                    {render_HTML_MATHJax(exercise.Problem.split("$$"))}
                    {exercise.Subheadings &&
                      exercise.Subheadings.map((subheading, j) => {
                        return (
                          <div key={j}>
                            <b>
                              {subheading.Order}
                              {") "}
                            </b>
                            {render_HTML_MATHJax(
                              subheading.Question.split("$$")
                            )}
                            <ButtonGroup size="sm" className="mt-3 mb-3">
                              {subheading.Suggestion && (
                                <Button
                                  onClick={() => {
                                    setModalTitle("Sugestão");
                                    const string = subheading.Suggestion.substring(
                                      1,
                                      subheading.Suggestion.length - 1
                                    );
                                    const array = string.split(",");
                                    setModalBody(
                                      array.map(item => {
                                        const value =
                                          item
                                            .trim()
                                            .substring(
                                              1,
                                              item.trim().length - 1
                                            ) + " ";
                                        return render_HTML_MATHJax(
                                          value.split("$$")
                                        );
                                      })
                                    );
                                    handleShow();
                                  }}
                                >
                                  Sugestão
                                </Button>
                              )}
                              {subheading.Solution && (
                                <Button
                                  variant="danger"
                                  onClick={() => {
                                    setModalTitle("Solução");
                                    setModalBody(
                                      render_HTML_MATHJax(
                                        subheading.Solution.split("$$")
                                      )
                                    );
                                    handleShow();
                                  }}
                                >
                                  Solução
                                </Button>
                              )}
                              {/*subheading.Tags && <Button
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
                            </Button>*/}
                            </ButtonGroup>
                          </div>
                        );
                      })}
                    <ButtonGroup size="sm" className="mt-3 mb-3">
                      {exercise.Suggestion && (
                        <Button
                          onClick={() => {
                            setModalTitle("Sugestão");
                            const string = exercise.Suggestion.substring(
                              1,
                              exercise.Suggestion.length - 1
                            );
                            const array = string.split(",");
                            setModalBody(
                              array.map(item => {
                                const value =
                                  item
                                    .trim()
                                    .substring(1, item.trim().length - 1) + " ";
                                return render_HTML_MATHJax(value.split("$$"));
                              })
                            );
                            handleShow();
                          }}
                        >
                          Sugestão
                        </Button>
                      )}
                      {exercise.Solution && (
                        <Button
                          variant="danger"
                          onClick={() => {
                            setModalTitle("Solução");
                            setModalBody(
                              render_HTML_MATHJax(exercise.Solution.split("$$"))
                            );
                            handleShow();
                          }}
                        >
                          Solução
                        </Button>
                      )}
                      {/*exercise.Tags && <Button
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
                    </Button>*/}
                      {exercise.Resolution && (
                        <Button
                          variant="success"
                          size="sm"
                          className="mt-3 mb-5"
                          onClick={() => {
                            setModalTitle("Resolução");
                            setModalBody(
                              render_HTML_MATHJax(
                                exercise.Resolution.split("$$")
                              )
                            );
                            handleShow();
                          }}
                        >
                          Resolução
                        </Button>
                      )}
                    </ButtonGroup>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Row style={{ justifyContent: "center" }}>
              <h3>Regista-te e acede a maior base de dados de exercícios!</h3>
            </Row>
          )}
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
