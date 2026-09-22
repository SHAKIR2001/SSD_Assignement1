export function loadCart (){  //this function get related cart details that is stored in localStorage(browser)
    let cart = localStorage.getItem("cart")

    if(cart == null){ // new user / or he dont have put anything in the cart
        cart = {
            orderedItems : [],
            days : 1,
            startingDate : formatDate(new Date()), //get the current day and send it to formate data function to convert that in to string
            endingDate : formatDate(new Date())  
        }

        const cartString = JSON.stringify(cart); //change the cart JSON in to String
        localStorage.setItem("cart", cartString); //save the converted(String) cart in to the localStorage(browser)
        return cart;

    }

        cart = JSON.parse(cart); //if already a cart avauilable then get the cart details in to cart

        // normalize old/invalid cart shapes
        let changed = false;
        if (!cart || typeof cart !== "object") {
            cart = {};
            changed = true;
        }
        if (!Array.isArray(cart.orderedItems)) {
            cart.orderedItems = [];
            changed = true;
        }
        if (typeof cart.days !== "number" || Number.isNaN(cart.days) || cart.days < 1) {
            cart.days = 1;
            changed = true;
        }
        if (typeof cart.startingDate !== "string" || cart.startingDate.length === 0) {
            cart.startingDate = formatDate(new Date());
            changed = true;
        }
        if (typeof cart.endingDate !== "string" || cart.endingDate.length === 0) {
            cart.endingDate = formatDate(new Date());
            changed = true;
        }

        if (changed) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        return cart;
}

export function addToCart(key, quantity){  //using this function we can add an item to the cart
    const cart = loadCart(); //get the already avilable carts
    let found  = false;

    for(let i=0; i<cart.orderedItems.length; i++){ //ingu already kurippitta key udiyya items ulladha ena check seidhal, awwaru iruppin quantity koottinaal podhum
        if(cart.orderedItems[i].key == key){
            cart.orderedItems[i].quantity += quantity;
            found = true; //if porduct key found , make found true
        }
    }

    if (!found){
        cart.orderedItems.push({key,quantity})
    }

    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);

    window.dispatchEvent(new Event("cartUpdated"));

}

export function removeFromCart(key) {
  const cart = loadCart();
  const newCart = cart.orderedItems.filter((item) => item.key != key); //anuppiya ket itku porundhaadah itemshalei weru newCart endra varibale itku podudhal(filter)
  cart.orderedItems = newCart; //filter sidha itemsei maaththiram localStorage il save seidhal so andha key irukkum item save aahadhu
  const cartString = JSON.stringify(cart);
  localStorage.setItem("cart", cartString);

    window.dispatchEvent(new Event("cartUpdated"));
}








export function formatDate(date) {  //This function is used to convert a JavaScript Date object into a clean, readable date string in the format : YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
  const day = String(date.getDate()).padStart(2, '0');       // Ensure two digits

  return `${year}-${month}-${day}`;
}
