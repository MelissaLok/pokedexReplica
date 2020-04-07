// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokemonName = document.querySelector('.poke-name');
const pokemonID = document.querySelector('.poke-id');
const pokemonFrontImg = document.querySelector('.poke-front-image');
const pokemonBackImg = document.querySelector('.poke-back-image');
const pokemonT1 = document.querySelector('.poke-type-one');
const pokemonT2 = document.querySelector('.poke-type-two');
const pokemonWeight = document.querySelector('.poke-weight');
const pokemonHeight = document.querySelector('.poke-height');
const pokemonListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');


// Constants and variables 
const TYPES = [
    'normal', 'fighting', 'flying', 'poison', 
    'ground', 'rock', 'bug', 'ghost', 'steel', 
    'fire', 'water', 'grass', 'electric', 
    'psychic', 'ice', 'dark', 'dragon', 'fairy'
];

/** 
 * we're gonna update these 
 * so we use let instead of const
*/
let prevUrl = null;
let nextUrl = null;


// Functions

const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const screenReset = () => {
    mainScreen.classList.remove('hide');
    for(const type of TYPES){
        mainScreen.classList.remove(type);
    }
};

const fetchList = url => {
    /**
    * get data for right side of screen
    */
    fetch(url)
        .then(res => res.json())
        .then(data => {

            // destructing an object's properties to a variable with { }
            // below code is essentially the same as doing const results = data['results'];
            const { results, prev, next } = data;
            prevUrl = prev;
            nextUrl = next;

            for(let i = 0; i < pokemonListItems.length; i++){
                const listItem = pokemonListItems[i];
                const resultData = results[i];

                if(resultData){
                    const {name, url} = resultData;
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length - 2];
                    listItem.textContent = id + '. ' +capitalize(name);
                } 
                else listItem.textContent = '';
            }
        });
};

const fetchPokemonData = id => {
    /** 
     * gets data for left side of screen
     * fetch is used to get data from API 
     * fetching takes time for js file to get data from API, 
     * this is where asynchronous code comes into play
     */ 
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        // once data from URL is finished recieving, will go into then function
        // res == short for response
        
        .then(res => res.json())    
        .then(data => {
            
            screenReset();
            
            const dataTypes = data['types'];
            const firstType = dataTypes[0];
            const secondType = dataTypes[1];
            pokemonT1.textContent = capitalize(firstType['type']['name']);

            if(secondType){
                pokemonT2.classList.remove('hide');
                pokemonT2.textContent = capitalize(secondType['type']['name']);
            } else {
                pokemonT2.classList.add('hide');
                pokemonT2.textContent = '';
            }
            mainScreen.classList.add(firstType['type']['name']);
    
            pokemonName.textContent = data['name'];
            pokemonID.textContent = '#'+ data['id'].toString().padStart(3, '0');
            pokemonWeight.textContent = data['weight'];
            pokemonHeight.textContent = data['height'];
            pokemonFrontImg.src = data['sprites']['front_default'] || '';
            pokemonBackImg.src = data['sprites']['back_default'] || '';
        });
};


const handleItemClick = (e) => {
    // if it doesn't exist, do nothing
    if(!e.target) return;

    //if it does exist
    //if text content is empty, do nothing
    const listItem = e.target;
    if(!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokemonData(id);
};

const handleRightButtonClick = () => {
    if(nextUrl) fetchList(nextUrl);
};
const handleLeftButtonClick = () => {
    if(prevUrl) fetchList(prevUrl);
};

// add event listeners

// we're passing the handle function as a reference instead of calling it
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);

for(const pokemonListItem of pokemonListItems){
    pokemonListItem.addEventListener('click', handleItemClick);
}

// initialize app
fetchList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
