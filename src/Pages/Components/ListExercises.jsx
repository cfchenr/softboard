import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { get } from "../../services/api";
import parse from "html-react-parser";
import MathJax from "react-mathjax2";

export default function ListExercises(props) {
  const [exercises, setExercises] = useState([]);

  const getExercises = () => {
    const str =
      props.search_string.trim() === ""
        ? "/exercise/"
        : "/exercise/?search=" + props.search_string;
    get(str, {})
      .then(response => {
        console.log(response);
        //TODO: para cada exercicio, ir buscar as alineas
        const temp = [];
        if (response.results.length === 0) {
          setExercises([]);
        }
        response.results.map((exercise, i) => {
          get("/subheading/" + exercise.id + "/", {})
            .then(response2 => {
              exercise.Subheadings = response2.results;
              temp[i] = exercise;
              if (i + 1 === response.results.length) setExercises(temp);
            })
            .catch(error2 => {
              temp[i] = exercise;
              if (i + 1 === response.results.length) setExercises(temp);
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
                      return <div key={k}>{parse(tag)}</div>;
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
                          <MathJax.Text text={tag} />
                        </MathJax.Context>
                      );
                    }
                  })}

                  {exercise.Subheadings &&
                    exercise.Subheadings.map((subheading, j) => {
                      const tags2 = subheading.Question.split("$$");
                      return (
                        <div key={j}>
                          {subheading.Order}
                          {") "}
                          {tags2.map((tag, m) => {
                            if (m % 2 === 0) {
                              return parse(tag);
                            } else {
                              return (
                                <MathJax.Context key={m}>
                                  <MathJax.Text text={tag} />
                                </MathJax.Context>
                              );
                            }
                          })}
                          <div>{subheading.Sugestion}</div>
                        </div>
                      );
                    })}
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </div>
  );
}
