let canvasCategories = document.querySelector(".canvasCat");
let canvasBooks = document.querySelector(".canvasBooks")
const arrayCategories = [];
const arrayBooks = [];
const botones = [];

async function getCategories() {
    let resp = await fetch ("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=GAcpHtEABQGQmAlDrXlHGWSjtTBLAo3A");
    let categories = await resp.json();
    document.getElementById("gif").style.display = "none";
    console.log(categories)
    printCategories(categories, canvasCategories)
    buttonEvent();
}

async function getBooks(catName){
    document.querySelector(".canvasCat").style.display = "none";
    document.getElementById("gif").style.display = "block";
    let resp = await fetch (`https://api.nytimes.com/svc/books/v3/lists/current/${catName}.json?api-key=GAcpHtEABQGQmAlDrXlHGWSjtTBLAo3A`);
    let books = await resp.json();
    document.getElementById("gif").style.display = "none";
    console.log(books)
    document.querySelector(".canvasBooks").style.display = "flex";
    document.querySelector(".canvasBooks").style.flexDirection = "column";
    document.querySelector(".canvasBooks").style.justifyContent = "center";
    printBooks(books, canvasBooks);
    document.querySelector(".bookCard").style.width = "75vw";
    
}

function printCategories(categories, canvas) {
    let bookCategories = categories.results
    
    for (let i = 0; i < bookCategories.length; i++){
        arrayCategories.push(bookCategories[i])
    }

    for (let i = 0; i < arrayCategories.length; i++){
        let card = document.createElement("div")
        card.setAttribute("class", "catCard")
        card.innerHTML = 
            `<h3>${bookCategories[i].display_name}</h3>
            <p>Last published: ${bookCategories[i].newest_published_date}</p>
            <p>Oldest Published: ${bookCategories[i].oldest_published_date}</p>
            <p>This list is updated ${bookCategories[i].updated}</p>
            <button class="readMore${i}">READ MORE</button>`
        canvas.appendChild(card);
    }
}

function printBooks(books, canvas) {
    let bookList = books.results.books
    
    for (let i = 0; i < bookList.length; i++){
        arrayBooks.push(bookList[i])
    }

    for (let i = 0; i < arrayBooks.length; i++){
        let card = document.createElement("div")
        card.setAttribute("class", "bookCard")
        card.innerHTML = 
            `<h3>#${arrayBooks[i].rank} ${arrayBooks[i].title}</h3>
            <img class="bookImg" src=${arrayBooks[i].book_image} alt=${bookList[i].title}>
            <p>Weeks on chart: ${arrayBooks[i].weeks_on_list}</p>
            <p>Description: ${bookList[i].description}</p>
            <a href=${bookList[i].amazon_product_url} target="_blank"}>BUY</a>`
        canvas.appendChild(card);
    }
}

function buttonEvent (){
        for (let i = 0; i < arrayCategories.length; i++) {
            let boton = document.querySelector(`.readMore${i}`);
            botones.push(boton);
    
        }
        botones.forEach((element, i) => element.addEventListener("click", function (){
        getBooks(arrayCategories[i].list_name_encoded)}));
        }

getCategories()


/*const signUp = document.querySelector(".signupbtn")
signUp.addEventListener("click", function() {
    handleSignUp() 
})*/
