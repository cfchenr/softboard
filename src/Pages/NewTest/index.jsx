import React, { useState, useEffect } from 'react';

import Navigationbar from '../Components/Navigationbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import parse from 'html-react-parser';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { get } from '../../services/api';
import MathJax from 'react-mathjax2';
import 'font-awesome/css/font-awesome.min.css';

export default function NewTest(props) {
	const [exercises, setExercises] = useState([]);
	const [search_string, setSearch] = useState('');
	const [test, setTest] = useState('');
	const [count, setCount] = useState(0);

	const getExercises = () => {
		var str =
			search_string.trim() === ''
				? '/exerciseDashboard/'
				: '/exerciseDashboard/?search=' + search_string;
		get(str, {}, localStorage.getItem('@megua:access_token'))
			.then(response => {
				const temp = [];
				if (response.results.length === 0) {
					setExercises([]);
				}

				response.results.map((exercise, i) => {
					temp[i] = exercise;
					if (i + 1 === response.results.length) setExercises(temp);
				});
			})
			.catch(error => {
				console.log(error);
			});
	};

	function render_HTML_MATHJax(tags) {
		return tags.map((tag, index) => {
			if (index % 2 === 0) {
				return (
					<MathJax.Context
						options={{
							asciimath2jax: {
								useMathMLspacing: true,
								delimiters: [['$', '$']],
								preview: 'none'
							}
						}}
						key={index}>
						<MathJax.Text text={parse('<div>' + tag + '<div>')} />
					</MathJax.Context>
				);
			} else {
				return (
					<MathJax.Context
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
						key={index}>
						<MathJax.Text text={'$$' + tag + '$$'} />
					</MathJax.Context>
				);
			}
		});
	}

	const make_test = async event => {
		var statement_of_exercises = '';
		var resolution_solutions_of_exercises = '';
		var suggestion_of_exercises = '';
		event.preventDefault();
		const elements = document.getElementsByName('check');
		for (var index = 0; index < elements.length; index++) {
			var element = elements[index];
			if (element.checked) {
				await get(
					'/exercise/' + element.value + '/',
					{},
					localStorage.getItem('@megua:access_token')
				)
					.then(async response => {
						console.log(response);
						statement_of_exercises +=
							'<h3>' +
							response.Title +
							'</h3>' +
							'<br>' +
							response.Problem +
							'<br>';

						await get(
							'/subheading/' + element.value + '/',
							{},
							localStorage.getItem('@megua:access_token')
						)
							.then(response2 => {
								console.log(response2);
								if (!response2.hasNotSubHeadings) {
									response2.results.map(
										(subheading, subheading_i) => {
											statement_of_exercises +=
												subheading.Order +
												') ' +
												subheading.Question +
												'<br>';
										}
									);
									if (
										response.Resolution &&
										response.Resolution.trim().length !== 0
									) {
										resolution_solutions_of_exercises +=
											'Resolução do exercício ' +
											response.Title +
											'<br>' +
											response.Resolution +
											'<br>';
									}
									if (
										response.Solution &&
										response.Solution.trim().length !== 0
									) {
										resolution_solutions_of_exercises +=
											'Solução do exercício ' +
											response.Title +
											'<br>' +
											response.Solution +
											'<br>';
										response2.results.map(
											(subheading, subheading_i) => {
												if (
													subheading.Solution &&
													subheading.Solution.trim()
														.length !== 0
												) {
													resolution_solutions_of_exercises +=
														subheading.Order +
														') ' +
														subheading.Solution +
														'<br>';
												}
											}
										);
									} else {
										response2.results.map(
											(subheading, subheading_i) => {
												if (
													subheading.Solution &&
													subheading.Solution.trim()
														.length !== 0
												) {
													if (
														resolution_solutions_of_exercises.indexOf(
															'Solução do exercício ' +
																response.Title
														) === -1
													) {
														resolution_solutions_of_exercises +=
															'Solução do exercício ' +
															response.Title +
															'<br>' +
															subheading.Order +
															') ' +
															subheading.Solution +
															'<br>';
													} else {
														resolution_solutions_of_exercises +=
															subheading.Order +
															') ' +
															subheading.Solution +
															'<br>';
													}
												}
											}
										);
									}
									if (
										response.Suggestion &&
										response.Suggestion.trim().length !== 0
									) {
										suggestion_of_exercises +=
											'Sugestão do exercício ' +
											response.Title +
											'<br>' +
											response.Suggestion.slice(1, -1)
												.split(',')
												.map(item => {
													return item
														.trim()
														.slice(1, -1);
												}) +
											'<br>';
										response2.results.map(
											(subheading, subheading_i) => {
												if (
													subheading.Suggestion &&
													subheading.Suggestion.trim()
														.length !== 0
												) {
													suggestion_of_exercises +=
														subheading.Order +
														') ' +
														subheading.Suggestion.slice(
															1,
															-1
														)
															.split(',')
															.map(item => {
																return item
																	.trim()
																	.slice(
																		1,
																		-1
																	);
															}) +
														'<br>';
												}
											}
										);
									} else {
										response2.results.map(
											(subheading, subheading_i) => {
												if (
													subheading.Suggestion &&
													subheading.Suggestion.trim()
														.length !== 0
												) {
													if (
														suggestion_of_exercises.indexOf(
															'Sugestão do exercício ' +
																response.Title
														) === -1
													) {
														suggestion_of_exercises +=
															'Sugestão do exercício ' +
															response.Title +
															'<br>' +
															subheading.Order +
															') ' +
															subheading.Suggestion.slice(
																1,
																-1
															)
																.split(',')
																.map(item => {
																	return item
																		.trim()
																		.slice(
																			1,
																			-1
																		);
																}) +
															'<br>';
													} else {
														suggestion_of_exercises +=
															subheading.Order +
															') ' +
															subheading.Suggestion.slice(
																1,
																-1
															)
																.split(',')
																.map(item => {
																	return item
																		.trim()
																		.slice(
																			1,
																			-1
																		);
																}) +
															'<br>';
													}
												}
											}
										);
									}
								}
							})
							.catch(error => console.log(error));
					})
					.catch(error => {
						console.log(error);
					});
			}
		}
		setTest(
			statement_of_exercises +
				'<br><br><br>' +
				resolution_solutions_of_exercises +
				'<br><br><br>' +
				suggestion_of_exercises
		);
	};

	useEffect(() => {
		getExercises();
	}, [search_string, count]);

	return (
		<>
			<div className='background'>
				<Navigationbar
					search_string={search_string}
					setSearch={setSearch}
				/>
				<div className='content-body'>
					<div className='content'>
						<Container>
							<Form
								onSubmit={event => {
									make_test(event);
								}}>
								<Row>
									<Col sm={6}>
										{exercises.map((exercise, i) => {
											return (
												<Row
													key={i}
													className='mt-3 ml-4'>
													<Col sm={10}>
														<h5>
															<a
																href={
																	'/exercise/' +
																	exercise.ExerciseId
																}
																target='_blank'
																style={{
																	color:
																		'var(--white-color)'
																}}>
																{parse(
																	exercise.Title
																)}
															</a>
														</h5>
													</Col>
													<Col sm={2}>
														<Form.Check
															name={'check'}
															value={exercise.id}
															type='checkbox'
														/>
													</Col>
												</Row>
											);
										})}
									</Col>
									<Col sm={6}>
										<Row className='mt-3 ml-5'>
											<h5>Template</h5>
											<Form.Control as='select'>
												<option>Choose...</option>
												<option>...</option>
											</Form.Control>
										</Row>
									</Col>
								</Row>
								<Button
									type='submit'
									className='mt-3 ml-4'
									variant='success'>
									Criar
								</Button>
							</Form>
							<div>{render_HTML_MATHJax(test.split('$$'))}</div>
						</Container>
					</div>
				</div>
			</div>
		</>
	);
}
