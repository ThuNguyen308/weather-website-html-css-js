export const cities_options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fca3786f3fmshf99f7afb612bf2fp13a15bjsn2fc1e9fff24d',
		'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
	}
};


export const CITIES_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/adminDivisions'


fetch('/cities', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
