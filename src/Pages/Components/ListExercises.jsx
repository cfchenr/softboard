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
    const str =
      props.search_string.trim() === ""
        ? "/exercise/"
        : "/exercise/?search=" + props.search_string;
    return get(str, {})
      .then(response => {
		console.log(response)
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
                    if (subheading.Sugestion) {
                      subheading.Sugestion = subheading.Sugestion.replace(
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

  return (
    <div className="content-body">
      <div className="content">
        <Container>
          <Row>
            {exercises.map((exercise, i) => {
              const tags = exercise.Problem.split("$$");
              return (
                <Col key={i} xs={12} className="mt-3">
                  <h1>{parse(exercise.Title)}</h1>
                  {tags.map((tag, k) => {
                    if (k % 2 === 0) {
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
                              key={k}
                            >
                              <MathJax.Text text={parse("<div>"+tag+"<div>")} />
                            </MathJax.Context>;
                    } else {
                      return (
                        <MathJax.Context
                          key={k}
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
                        >
                          <MathJax.Text text={"$$"+tag+"$$"} />
                        </MathJax.Context>
                      );
                    }
                  })}

                  {exercise.Subheadings &&
                    exercise.Subheadings.map((subheading, j) => {
                      const tags2 = subheading.Question.split("$$");
                      return (
                        <div key={j}>
                          <b>
                            {subheading.Order}
                            {") "}
                          </b>
                          {tags2.map((tag2, m) => {
                            if (m % 2 === 0) {
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
                              key={m}
                            >
                              <MathJax.Text text={parse("<div>"+tag2+"<div>")} />
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
                                  key={m}
                                >
                                  <MathJax.Text text={"$$"+tag2+"$$"} />
                                </MathJax.Context>
                              );
                            }
                          })}
                          <ButtonGroup size="sm" className="mt-3 mb-3">
                          {subheading.Suggestion && <Button
                              variant="outline-warning"
                              onClick={() => {
                                setModalTitle("Sugestão");
                                const string = subheading.Suggestion.substring(1, subheading.Suggestion.length-1)
                                const array = string.split(",")

                                console.log(subheading.Suggestion)
                                setModalBody(array.map((item) => {
                                  const value = item.trim().substring(1, item.trim().length-1)+" ";
                                  return value.split("$$").map((tag3, tag3I) => {
                                    if(tag3I % 2 == 0) {
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
                                      key={tag3I}
                                    >
                                      <MathJax.Text text={parse("<div>"+tag3+"<div>")} />
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
                                          key={tag3I}
                                        >
                                          <MathJax.Text text={"$$"+tag3+"$$"} />
                                        </MathJax.Context>
                                      );
                                    }
                                  })
                                  return parse()
                                }))
                                /*var array = subheading.Suggestion.replace(/"/g, '\'');
                                array = array.replace(/'/g, '"');
                                console.log(array)
                                console.log(JSON.parse(array))
                                */
                                /*setModalBody(JSON.parse(array).map((tag, tagi) => {
                                  return parse(tag)
                                }));*/
                                handleShow();
                              }}
                            >
                              Sugestão
                            </Button>}
                            {subheading.Solution && <Button
                              variant="outline-danger"
                              onClick={() => {
                                setModalTitle("Solução");
                                setModalBody(subheading.Solution.split("$$").map((subheadingTag, subheadingTagI) => {
                                  if(subheadingTagI % 2 === 0) {
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
                                      key={subheadingTagI}
                                    >
                                      <MathJax.Text text={parse("<div>"+subheadingTag+"<div>")} />
                                    </MathJax.Context>;
                                  } else {
                                    console.log(subheadingTag)
                                    return <MathJax.Context
                                    key={subheadingTagI}
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
                                  >
                                    <MathJax.Text text={"$$" + subheadingTag + "$$"} />
                                  </MathJax.Context>
                                  }
                                }));
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
                              const array = exercise.Suggestion.replace(/'/g, '"');
                              setModalBody(JSON.parse(array).map((tag, tagi) => {
                                return parse(tag)
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
                      setModalBody(exercise.Solution);
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
                      setModalBody(exercise.Resolution);
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
