import React, { useState, useEffect } from 'react';

import Navigationbar from '../Components/Navigationbar';
import Container from 'react-bootstrap/Container';
import parse from 'html-react-parser';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { get, remove } from '../../services/api';
import Modal from 'react-bootstrap/Modal';

export default function Dashboard(props) {
	const [exercises, setExercises] = useState([]);
	const [count, setCount] = useState(0);
	const [search_string, setSearch] = useState('');

	const [show, setShow] = useState(false);
	const [processing, setProcessing] = useState(true);

	const handleClose = () => setShow(false);

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

	const deleteExercise = id => {
		setProcessing(true);
		setShow(true);
		remove(
			'/exercise/' + id + '/',
			{},
			localStorage.getItem('@megua:access_token')
		)
			.then(response => {
				setCount(count + 1);
				document.getElementById('results').innerHTML +=
					"<h4>Exercício eliminado com sucesso! <i class='fa fa-check fa-1x text-success' /></h4>";
				setProcessing(false);
			})
			.catch(error => {
				document.getElementById('results').innerHTML +=
					"<h4>Ocorreu um erro ao eliminar o exercício! <i class='fa fa-times fa-1x text-danger' /></h4>";
				setProcessing(false);
			});
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
							<Row>
								<Button href='/add_exercise/' variant='primary'>
									Adicionar exercício
								</Button>
								<Button
									href='/new_test/'
									variant='primary'
									style={{ marginLeft: 10 }}>
									Criar teste
								</Button>
							</Row>

							{exercises.map((exercise, i) => {
								return (
									<Row key={i} className='mt-3'>
										<div className='mr-auto'>
											<h3>
												<a
													href={
														'/exercise/' +
														exercise.ExerciseId
													}
													style={{
														color:
															'var(--white-color)'
													}}>
													{parse(exercise.Title)}
												</a>
											</h3>
										</div>
										<div className='ml-auto'>
											<ButtonGroup size='sm'>
												<Button
													variant='success'
													href={
														'/edit_exercise/' +
														exercise.id
													}>
													Editar
												</Button>
												<Button
													variant='danger'
													onClick={() => {
														deleteExercise(
															exercise.id
														);
													}}>
													Apagar
												</Button>
											</ButtonGroup>
										</div>
									</Row>
								);
							})}
						</Container>
					</div>
				</div>
			</div>
			<Modal
				show={show}
				aria-labelledby='contained-modal-title-vcenter'
				data-backdrop='static'
				data-keyboard='false'
				centered>
				<Modal.Body className='text-center'>
					{processing && (
						<h4 id='processing'>
							<Spinner animation='border' variant='primary' /> A
							processar...
						</h4>
					)}
					<div id='results' className='mt-3'></div>
				</Modal.Body>
				{!processing && (
					<Modal.Footer>
						<Button variant='danger' onClick={handleClose}>
							Fechar
						</Button>
					</Modal.Footer>
				)}
			</Modal>
		</>
	);
}
