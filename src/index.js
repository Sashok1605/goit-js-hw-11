import './sass/main.scss';
//import * as bootstrap from 'bootstrap';
//mport {getUrl, getDataServer} from './fetchPictures'
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const loadMoreBtn = document.querySelector('.load-more');
const inputForm = document.querySelector('#search-form');
const searchGallery = document.querySelector('.gallery');
loadMoreBtn.classList.add("is-hidden");

let searchText;

let page;
const per_page = 40;

function cleanView() {
    searchGallery.innerHTML = '';
    loadMoreBtn.classList.add("is-hidden");
    newCards.length = 0;
    return;
  }
  const newCards = [];
 const getUrl = (searchText, page) =>{
    const baseUrl = 'https://pixabay.com/api';
    const searchParams = new URLSearchParams({
        key: '23761306-59ca6a0f0608395e39c81a3c2',
        q: searchText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      });
    const searchURL = baseUrl+`/?${searchParams}`;
    console.log(searchURL);
    
    getDataInfo(searchURL);
  }
 const getDataServer = async (searchURL) => {
    try {
        const response = await axios.get(searchURL);
        
        if (response.status >= 200 && response.status < 300) {
            return response.data;
          }
          throw response;
      
        } catch (error) {
          console.error(error);
          return Promise.reject(error);
        }
      }

function getDataInfo(searchURL) {
    getDataServer(searchURL)
          .then(data => {
            const { hits: cardsArray, totalHits } = data;
            console.log(data);
            console.log(cardsArray.length);
            if (cardsArray.length === 0) {
                cleanView();
                return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again...");
              }      
              if (cardsArray.length === per_page) {
                loadMoreBtn.classList.remove("is-hidden");
              }
        
              newCards.push(...cardsArray);
              console.log(newCards);
              if (newCards.length >= totalHits) {
                loadMoreBtn.classList.add("is-hidden");
                Notiflix.Notify.success(`We're sorry, but you've reached the end of search results`)
              }
        
              if (newCards.length <= cardsArray.length) {
                Notiflix.Notify.success(`Hooray! We found over ${totalHits} images`);
              }
        
            makePicturiesList(newCards);
          })
          .catch(error => console.error(error));
      }
           
inputForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();
    cleanView();
    searchText = event.currentTarget.elements.searchQuery.value;
    if (!searchText) {
        return Notiflix.Notify.failure("Oops, there is nothing to search");
    }
        page = 1;
        getUrl(searchText, page);
}    
loadMoreBtn.addEventListener('click', onClick);

function onClick() {
        page = page+1;
        console.log(page);
        getUrl(searchText, page);
}  
function makePicturiesList (newCards) {
    console.log(newCards);
    const markup = newCards.map((item) => {
        return `<div class="photo-card">
        <a href="${item.largeImageURL}">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${item.likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${item.views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${item.comments}</b>
          </p>
          
        </div>
        </div>`
      })
      .join("");
      
    searchGallery.innerHTML = markup;
    const lightbox = new SimpleLightbox('.gallery a');
    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: searchGallery.offsetHeight,
    behavior: "smooth",
  });
  };



  