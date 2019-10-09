import React from 'react';

export default function ListExercises() {
	return (
		<div className='content-body'>
			<div className='content'>
				<div>
					<div disabled='' className='content-high'>
						<div className='high'>
							<div className='high-header'>
								<img
									src={require('../../media/set-square.svg')}
									alt='Exercicio1Logo'
								></img>
								<h1>Exercicio 1</h1>
								<span>
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
									Enunciado do exercicio, ou alguma descrição.
								</span>
								<div className='tag-list'>
									<div className='tag'>Álgebra</div>
									<div className='tag'>Análise</div>
									<div className='tag'>Estatística</div>
									<div className='tag'>Programação</div>
								</div>
							</div>
							<a
								href='#'
								target='_blank'
								rel='noopener noreferrer'
								className='high-bottom'
							>
								<strong>Praticar</strong>
							</a>
						</div>
					</div>
					<a className='normal-flex'>
						<div className='normal'>
							<div className='normal-content'>
								<img
									src={require('../../media/chalkboard.svg')}
									alt='Exercicio2Logo'
								></img>
								<h1>Exercicio 2</h1>
								<span>
									Enunciado do exercicio, ou alguma descrição
								</span>
								<div className='tag-list'>
									<div className='tag'>Álgebra</div>
									<div className='tag'>Estatística</div>
									<div className='tag'>Programação</div>
								</div>
							</div>
						</div>
					</a>
					<a className='normal-flex'>
						<div className='normal'>
							<div className='normal-content'>
								<img
									src={require('../../media/notebook.svg')}
									alt='Exercicio3Logo'
								></img>
								<h1>Exercicio 3</h1>
								<span>
									Enunciado do exercicio, ou alguma descrição
								</span>
								<div className='tag-list'>
									<div className='tag'>Álgebra</div>
									<div className='tag'>Estatística</div>
									<div className='tag'>Programação</div>
								</div>
							</div>
						</div>
					</a>
					<a className='normal-flex'>
						<div className='normal'>
							<div className='normal-content'>
								<img
									src={require('../../media/mortarboard.svg')}
									alt='Exercicio4Logo'
								></img>
								<h1>Exercicio 4</h1>
								<span>
									Enunciado do exercicio, ou alguma descrição
								</span>
								<div className='tag-list'>
									<div className='tag'>Álgebra</div>
									<div className='tag'>Estatística</div>
									<div className='tag'>Programação</div>
								</div>
							</div>
						</div>
					</a>
					<a className='normal-flex'>
						<div className='normal'>
							<div className='normal-content'>
								<img
									src={require('../../media/earth-globe.svg')}
									alt='Exercicio5Logo'
								></img>
								<h1>Exercicio 5</h1>
								<span>
									Enunciado do exercicio, ou alguma descrição
								</span>
								<div className='tag-list'>
									<div className='tag'>Álgebra</div>
									<div className='tag'>Estatística</div>
									<div className='tag'>Programação</div>
								</div>
							</div>
						</div>
					</a>
					<a className='normal-flex'>
						<div className='normal'>
							<div className='normal-content'>
								<img
									src={require('../../media/paint-palette.svg')}
									alt='Exercicio6Logo'
								></img>
								<h1>Exercicio 6</h1>
								<span>
									Enunciado do exercicio, ou alguma descrição
								</span>
								<div className='tag-list'>
									<div className='tag'>Álgebra</div>
									<div className='tag'>Estatística</div>
									<div className='tag'>Programação</div>
								</div>
							</div>
						</div>
					</a>
					<a className='normal-flex'>
						<div className='normal'>
							<div className='normal-content'>
								<img
									src={require('../../media/open-book.svg')}
									alt='Exercicio7Logo'
								></img>
								<h1>Exercicio 7</h1>
								<span>
									Enunciado do exercicio, ou alguma descrição
								</span>
								<div className='tag-list'>
									<div className='tag'>Álgebra</div>
									<div className='tag'>Estatística</div>
									<div className='tag'>Programação</div>
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
}
