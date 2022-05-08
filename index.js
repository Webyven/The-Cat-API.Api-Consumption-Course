const BASE_URL = "https://api.thecatapi.com/v1";
const URL_FAVOURITES = BASE_URL + '/favourites/';
const URL_UPLOAD_CAT = BASE_URL + '/images/upload';
const URL_DELETE_FAVOURITE = (num) => {return URL_FAVOURITES + num};
const URL_RANDOM_CATS = (num) => { return BASE_URL + `/images/search?limit=${num}` };

const API_KEY = "8958bb13-cf28-421c-a758-5772ceb9e5f5";

async function getRandomCats(){
    const res = await fetch(URL_RANDOM_CATS(6));
    const data = await res.json();

    const container = document.querySelector('#cats-images');
    container.innerHTML = "";

    for(let i = 0; i < 6; i++){
        const img = document.createElement('img');
        img.src = data[i].url;
        img.onclick = () => { saveFavouriteCat(data[i].id) }

        container.appendChild(img);
    }
}

async function saveFavouriteCat(id){
    const res = await fetch(URL_FAVOURITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
        body: JSON.stringify({
            image_id: id
        })
    });
    const data = await res.json();

    if(res.status == 200){
        getFavouriteCats();
    }
}

async function getFavouriteCats(){
    const res = await fetch(URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY
        }
    });
    const data = await res.json();

    const container = document.querySelector('#favourites-cats-images');
    container.innerHTML = "";

    if(res.status == 200){
        data.forEach(cat => {
            const img = document.createElement('img');
            img.src = cat.image.url;
            img.onclick = () => { deleteFavouriteCat(cat.id) }
    
            container.appendChild(img);
        });
    }
}

async function deleteFavouriteCat(id){
    const res = await fetch(URL_DELETE_FAVOURITE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_KEY,
        }
    });
    const data = await res.json();

    if(res.status == 200){
        getFavouriteCats();
    }
}

async function uploadCat(){
    const form = document.getElementById('upload-form');
    const formData = new FormData(form);

    const res = await fetch(URL_UPLOAD_CAT, {
        method: 'POST',
        headers: {
            'X-API-KEY': API_KEY,
        },
        body: formData
    });
    const data = await res.json();

    if(res.status == 200){
        getFavouriteCats();
    } else{
        document.getElementById('span-error').innerText = `ERROR ${res.status}: ` + data.message;
    }
}

function chargeThumb(){
    const file = document.querySelector('#file').files;
    const thumb = document.getElementById("uploading-img");

    if (file.length > 0) {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
          thumb.setAttribute("src", e.target.result);
          thumb.style = "margin-top: 15px; margin-bottom: 5px;"
        };
        fileReader.readAsDataURL(file[0]);
    }
    else{
        thumb.setAttribute("src", "");
        thumb.style = "margin: 0px;"
        document.getElementById('span-error').innerText = "";
    }
}

getRandomCats();
getFavouriteCats();
