import './css/styles.css';
import Notiflix from 'notiflix';
let debounce = require('lodash.debounce');
import countries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const ul = document.querySelector('.country-list');
const inputCountry = document.querySelector('#search-box');
const divCountry = document.querySelector('.country-info');

inputCountry.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  let countryName = e.target.value.trim();
  if (!countryName) return;
  countries
    .fetchCountries(countryName)
    .then(response => {
      ul.innerHTML = '';
      if (countryName == '') {
        divCountry.innerHTML = ' ';
      } else if (response.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      makeup(response);
    })
    .catch(err => {
      console.log(err);
    });
}
function makeup(response) {
  divCountry.innerHTML = '';
  if (response.length == 1) {
    divCountry.insertAdjacentHTML('afterbegin', dataCardTemp(response));
  } else {
    ul.insertAdjacentHTML('afterbegin', template(response));
  }
}
const dataCardTemp = response => {
  return response
    .map(({ name, flags, capital, population, languages }) => {
      return `<h1 class="item">
      <img src="${flags.svg}" width="40px"
        alt="${name.official}">${name.official}</h1>
        <ul>
          <li>Capital: ${capital}</li>
          <li>Population: ${population}</li>
          <li>Languages: ${Object.values(languages)}</li>
        </ul>`;
    })
    .join('');
};
const template = response => {
  return response
    .map(el => {
      console.log(el);
      return `<li class="item"><img src="${el.flags.svg}" width="40px" height="30px" alt="${el.name.official}"><p>${el.name.official}</p></li>`;
    })
    .join('');
};
