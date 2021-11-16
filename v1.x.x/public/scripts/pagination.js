const paginate           = document.getElementById('paginate'),
	  $voituresContainer = $('#voitures-container');

paginate.addEventListener('click', function(e) {
	e.preventDefault();
	fetch(this.href)
		.then(response => response.json())
		.then(data => {
			for(const voiture of data.docs) {
				let template = generateVoiture(voiture);
				$voituresContainer.append(template);
			}
			let { nextPage } = data;
			this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
			voitures.features.push(...data.docs);
			map.getSource('voitures').setData(voitures);
		})
		.catch(err => console.log(err));
})

function generateVoiture(voiture) {
	let template = `<div class="card mb-3 nightBG">
						<div class="card m-3 neonBG">
							<div class="row">
								<div class="col-md-4">
									<img class="img-fluid" alt="" src="${ voiture.images[0].url }">
								</div>
								<div class="col-md-8">
									<div class="card-body">
										<h5 class="card-title mdText contentFont">${ voiture.nom }</h5>
										<p class="card-text smText contentFont">${ voiture.sommaire.substring(0, 200) }...</p>
										<p class="card-text">
											<span class="smText contentFont">${ voiture.localisation }</span>		
										</p>
										<a class="neonBtn mdBtn" href="/voitures/${ voiture._id }">Voir ${ voiture.nom }</a>
									</div>
								</div>
							</div>
						</div>
					</div>`;
					return template;
}