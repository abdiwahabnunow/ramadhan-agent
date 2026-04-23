//onready wired up
document.addEventListener("DOMContentLoaded", onReady);
function onReady() {
    console.log("onReady called");
    
}
const cart = []; // initialize an empty cart array
const budget = 100; // set a budget limit

// form submit function
function submitForm(event) {
    event.preventDefault(); // prevent default form submission behavior

    // get form values
    const name = document.getElementById("item_name").value;
    const price = document.getElementById("item_price").value;

    // create new item object
    const newItem = {
        name: name,
        price: price
    };

    // add new item to the list (for demonstration, we will just log it)
    console.log("New Item Added:", newItem);
    cart.push(newItem);
  
}