let apiKey = '563492ad6f9170000100000104606eb1c1244340bf2cede1c4a42568';
const searchInput = document.querySelector('.search-input');
const viewMore = document.querySelector('.view-more');
const searchForm = document.querySelector('.search-form');
const mainContent = document.querySelector('.main-content');
let pageNumber = 1;
let fetchLink;
let currentSearch;
let searchValue;

//Event Listeners
searchInput.addEventListener('input', (e) =>{
    //Prevent page reloading
    searchValue = e.target.value;
})
searchForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
})

viewMore.addEventListener('click', loadMoreImages);

const apiHeaders = async (url) => {
    const dataFetch = await fetch(url,
    {
        method: "GET",
        headers:{
            Accept: 'application/json',
            Authorization: apiKey
        }
    });

    const data = await dataFetch.json();
    return data;
};

//Generate HTML Markup
const generateMarkup = (data) =>{
    data.photos.forEach(photo => {
        const gallery = document.createElement('div');
        gallery.classList.add('gallery');
        gallery.innerHTML = `<div class="image-holder"><img src=${photo.src.large}> </img>
                <div class="profile">
                    <a href=${photo.photographer_url}>${photo.photographer}<a>
                    <a href=${photo.src.large}><img src="img/download.svg"></img></a>
                </div>
            </div>`;

        mainContent.appendChild(gallery);
    })
}

//Get Curated Photos
const curatedPhotos = async () => {
    fetchLink = 'https://api.pexels.com/v1/curated?per_page=10';

    const data = await apiHeaders(fetchLink);
    //Data from the Api
    generateMarkup(data);
}

//Clear Input
const clearInput = () => {
    mainContent.innerHTML = '';
    searchInput.value = "";
}

const searchPhotos = async (searchQuery) => { 
    //Clear existing images on submit
    clearInput();
    fetchLink = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=10`;
    const data = await apiHeaders(fetchLink);

    //Data from the Api
    generateMarkup(data);
}


//Load More Images
async function loadMoreImages(){
    pageNumber++;
    if(currentSearch){
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=10&page=${pageNumber}`
    }else{
        fetchLink = `https://api.pexels.com/v1/curated?per_page=10&page=${pageNumber}`;
    }

    const data = await apiHeaders(fetchLink);
    generateMarkup(data);
}

searchPhotos();
curatedPhotos();