import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { get } from '../../services/api';
import parse from 'html-react-parser';
import MathJax from 'react-mathjax2';

export default function ListExercises() {
	const [exercises, setExercises] = useState([]);
	const getExercises = () => {
		get('/exercise/', {})
			.then(response => {
				//TODO: para cada exercicio, ir buscar as alineas
				var temp = [];
				response.results.map((exercise, i) => {
					get('/subheading/' + exercise.id + '/', {})
						.then(response2 => {
							exercise.Subheadings = response2.results;
							temp[i] = exercise;
							setExercises(temp);
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
	}, []);

	return (
		<div className="content-body">
			<div className="content">
				<Container>
					<Row>
						{exercises.map((exercise, i) => {
							const tags = exercise.Problem.split('$$');
							return (
								<Col key={i} xs={12} className="mt-3">
									<h1>{parse(exercise.Title)}</h1>
									{tags.map((tag, k) => {
										if (k % 2 === 0) {
											return (
												<div key={k}>{parse(tag)}</div>
											);
										} else {
											return (
												<MathJax.Context
													key={k}
													options={{
														asciimath2jax: {
															useMathMLspacing: true,
															delimiters: [
																['$$', '$$'],
																['$', '$']
															],
															preview: 'none'
														}
													}}
												>
													<MathJax.Text text={tag} />
												</MathJax.Context>
											);
										}
									})}

									{exercise.Subheadings.map(
										(subheading, j) => {
											const tags2 = subheading.Question.split(
												'$$'
											);
											return (
												<div key={j}>
													{subheading.Order}){' '}
													{tags2.map((tag, m) => {
														if (m % 2 === 0) {
															return parse(tag);
														} else {
															return (
																<MathJax.Context
																	key={m}
																>
																	<MathJax.Text
																		text={
																			tag
																		}
																	/>
																</MathJax.Context>
															);
														}
													})}
													<div>
														{subheading.Sugestion}
													</div>
												</div>
											);
										}
									)}
								</Col>
							);
						})}
						{/*
						<Col md={4} className="mt-3">
							<div className="normal">
								<div className="normal-content">
									<img
										src={require('../../media/chalkboard.svg')}
										alt="Exercicio1Logo"
									></img>
									<h1>Exercício 1</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<Row className="small">
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Álgebra
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Estatística
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Programação
											</Alert>
										</Col>
									</Row>
								</div>
							</div>
						</Col>
						<Col md={4} className="mt-3">
							<div className="normal">
								<div className="normal-content">
									<img
										src={require('../../media/notebook.svg')}
										alt="Exercicio2Logo"
									></img>
									<h1>Exercício 2</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<Row className="small">
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Álgebra
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Estatística
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Programação
											</Alert>
										</Col>
									</Row>
								</div>
							</div>
						</Col>
						<Col md={4} className="mt-3">
							<div className="normal">
								<div className="normal-content">
									<img
										src={require('../../media/mortarboard.svg')}
										alt="Exercicio3Logo"
									></img>
									<h1>Exercício 3</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<Row className="small">
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Álgebra
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Estatística
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Programação
											</Alert>
										</Col>
									</Row>
								</div>
							</div>
						</Col>
						<Col md={4} className="mt-3">
							<div className="normal">
								<div className="normal-content">
									<img
										src={require('../../media/earth-globe.svg')}
										alt="Exercicio4Logo"
									></img>
									<h1>Exercício 4</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<Row className="small">
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Álgebra
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Estatística
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Programação
											</Alert>
										</Col>
									</Row>
								</div>
							</div>
						</Col>
						<Col md={4} className="mt-3">
							<div className="normal">
								<div className="normal-content">
									<img
										src={require('../../media/paint-palette.svg')}
										alt="Exercicio5Logo"
									></img>
									<h1>Exercício 5</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<Row className="small">
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Álgebra
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Estatística
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Programação
											</Alert>
										</Col>
									</Row>
								</div>
							</div>
						</Col>
						<Col md={4} className="mt-3">
							<div className="normal">
								<div className="normal-content">
									<img
										src={require('../../media/open-book.svg')}
										alt="Exercicio6Logo"
									></img>
									<h1>Exercício 6</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<Row className="small">
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Álgebra
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Estatística
											</Alert>
										</Col>
										<Col>
											<Alert
												className="small text-center"
												variant={'success'}
											>
												Programação
											</Alert>
										</Col>
									</Row>
								</div>
							</div>
						</Col> 
						*/}
					</Row>
				</Container>
			</div>
		</div>
	);
}
