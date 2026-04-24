//onready wired up
document.addEventListener("DOMContentLoaded", onReady);
function onReady() {
    console.log("onReady called");



    
}
const cart = []; // initialize an empty cart array
const budget = 100; // set a budget limit

// // form submit function
// function submitForm(event) {
//     event.preventDefault(); // prevent default form submission behavior

//     const nameInput = document.getElementById("item_name");
// const priceInput = document.getElementById("item_price");

// const newItem = {
//     name: nameInput.value,
//     price: Number(priceInput.value)
// };

// nameInput.value = "";
// priceInput.value = "";

//     // // get form values
//     // const name = document.getElementById("item_name").value;
//     // const price = document.getElementById("item_price").value;

//     // // create new item object
//     // const newItem = {
//     //     name: name.value,
//     //     price: Number(price.value)
//     // };


//     // add new item to the list (for demonstration, we will just log it)
//     console.log("New Item Added:", newItem);
//     cart.push(newItem);

//     // // clear form fields
//     // name.value = "";
//     // price.value = 0;

// // rendershoppingCart();
// // renderRemainingBudget();

  
// }

function submitForm(event) {
    event.preventDefault();

    const nameInput = document.getElementById("item_name");
    const priceInput = document.getElementById("item_price");

    const newItem = {
        name: nameInput.value,
        price: Number(priceInput.value)
    };

    cart.push(newItem);

    nameInput.value = "";
    priceInput.value = "";

    rendershoppingCart();   
    renderRemainingBudget();
}

function rendershoppingCart() {
    const shoppingList = document.getElementById("shopping-list");
    shoppingList.innerHTML = ""; // Clear the list

    for (let i = 0; i < cart.length; i++) {
       shoppingList.innerHTML += `
       <li>
       <strong>Name:</strong> ${cart[i].name}
       <strong>Price:</strong> $${cart[i].price}
       <button onclick="removeItem(event)">Remove</button>
       </li>`
    }
}


function remainingBudget() {
    let total = 0;
    for( const item of cart) {
        total += Number(item.price);
    }
    const remaining = budget - total;
    return remaining;
}   

function renderRemainingBudget() {

    const newRemaining = remainingBudget();
   const paraElement = document.getElementById("remaining-budget");
   paraElement.innerText = `Remaining Budget: $${newRemaining}`;
}

function removeItem(event) {
    const button = event.target;
    const li = button.closest("li");
    li.remove();
}