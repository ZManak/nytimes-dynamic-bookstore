let canvas = document.querySelector(".canvas");
const arrayCategories = [];

async function getCategories() {
    let resp = await fetch ("https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=GAcpHtEABQGQmAlDrXlHGWSjtTBLAo3A");
    let categories = await resp.json();
    document.getElementById("gif").style.display = "none";
    console.log(categories)
    printCategories(categories, canvas)
}

function printCategories(cat, canvas) {
    let bookCategories = cat.results
    
    for (let i = 0; i < bookCategories.length; i++){
        arrayCategories.push(bookCategories[i])
    }

    for (let i = 0; i < arrayCategories.length; i++){
        let card = document.createElement("div")
        card.setAttribute("class", "catCard")
        card.innerHTML = 
            `<h3>${bookCategories[i].display_name}</h3>
            <p>Last published: ${bookCategories[i].newest_publised_date}</p>
            <p>Oldest Published: ${bookCategories[i].oldest_publised_date}</p>
            <p>This list is updated ${bookCategories[i].updated}</p>
            <a href="" target="_blank">READ MORE >></a>`
        canvas.appendChild(card);
    }
}

getCategories()