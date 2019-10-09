import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export default function ListExercises() {
	return (
		<div className='content-body'>
			<div className='content'>
				<Container>
					<Row>
						<Col md={4} className='mt-3'>
							<div className='normal'>
								<div className='normal-content'>
									<img
										src={require('../../media/chalkboard.svg')}
										alt='Exercicio1Logo'
									></img>
									<h1>Exercício 1</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<div className='tag-list'>
										<div className='tag'>Álgebra</div>
										<div className='tag'>Estatística</div>
										<div className='tag'>Programação</div>
									</div>
								</div>
							</div>
						</Col>
						<Col md={4} className='mt-3'>
							<div className='normal'>
								<div className='normal-content'>
									<img
										src={require('../../media/notebook.svg')}
										alt='Exercicio2Logo'
									></img>
									<h1>Exercício 2</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<div className='tag-list'>
										<div className='tag'>Álgebra</div>
										<div className='tag'>Estatística</div>
										<div className='tag'>Programação</div>
									</div>
								</div>
							</div>
						</Col>
						<Col md={4} className='mt-3'>
							<div className='normal'>
								<div className='normal-content'>
									<img
										src={require('../../media/mortarboard.svg')}
										alt='Exercicio3Logo'
									></img>
									<h1>Exercício 3</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<div className='tag-list'>
										<div className='tag'>Álgebra</div>
										<div className='tag'>Estatística</div>
										<div className='tag'>Programação</div>
									</div>
								</div>
							</div>
						</Col>
						<Col md={4} className='mt-3'>
							<div className='normal'>
								<div className='normal-content'>
									<img
										src={require('../../media/earth-globe.svg')}
										alt='Exercicio4Logo'
									></img>
									<h1>Exercício 4</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<div className='tag-list'>
										<div className='tag'>Álgebra</div>
										<div className='tag'>Estatística</div>
										<div className='tag'>Programação</div>
									</div>
								</div>
							</div>
						</Col>
						<Col md={4} className='mt-3'>
							<div className='normal'>
								<div className='normal-content'>
									<img
										src={require('../../media/paint-palette.svg')}
										alt='Exercicio5Logo'
									></img>
									<h1>Exercício 5</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<div className='tag-list'>
										<div className='tag'>Álgebra</div>
										<div className='tag'>Estatística</div>
										<div className='tag'>Programação</div>
									</div>
								</div>
							</div>
						</Col>
						<Col md={4} className='mt-3'>
							<div className='normal'>
								<div className='normal-content'>
									<img
										src={require('../../media/open-book.svg')}
										alt='Exercicio6Logo'
									></img>
									<h1>Exercício 6</h1>
									<span>
										Enunciado do exercicio, ou alguma
										descrição
									</span>
									<div className='tag-list'>
										<div className='tag'>Álgebra</div>
										<div className='tag'>Estatística</div>
										<div className='tag'>Programação</div>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
}
