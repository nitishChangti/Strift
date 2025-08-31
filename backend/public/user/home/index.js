console.log(typeof $); // Should log "function" if jQuery is loaded
$(function () {
    $(".navSection").load("./header.html");
    $(".navSection").load("header.html", function () {

        if (!localStorage.getItem('isLoggedIn')) {
            // Show the login popup with options for new users and profile links
            showLoginPopup();
            console.log('before login popup')
        } else {
            // Show the account-related menu (My Profile, Orders, Wishlist, Logout)
            console.log('after login popup')
            showAccountPopup();
        }

        const logOutButton = document.querySelector('.loginClick');

        logOutButton.addEventListener('click', async (event) => {
            console.log('logout button')
            // event.preventDefault();
            try {
                event.preventDefault();
                const response = await fetch('/account/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (response.ok) {
                    const responseData = await response.json();
                    localStorage.removeItem('isLoggedIn');
                    console.log('logged out', responseData)
                    console.log(responseData.data.redirect)
                    if (responseData.data.redirect) {
                        alert('logout is successfully done')
                        window.location.href = responseData.data.redirect

                    } else {
                        console.error('logout failed or redirect failed')
                    }
                    // responseData.redirect;

                }
                else {
                    console.log('error', response.status)
                    console.error('logout failed')
                }
            } catch (error) {
                console.error('Error:', error);
            }
        })
    });
    $("footer").load("./footer.html");
});

function showLoginPopup() {
    const accountHover = document.querySelector('.accountLink');
    if (accountHover) {
        let beforeLoginPopUp = document.querySelector('.beforeloginPopUp')

        accountHover.addEventListener('mouseenter', () => {
            console.log('hover')
            console.log('mouseover on accountLink')
            accountHover.style.backgroundColor = 'lightgreen'
            beforeLoginPopUp.style.display = "flex ";
        });
        accountHover.addEventListener('mouseleave', () => {
            console.log('mouseleave on accountLink')
            beforeLoginPopUp.style.display = "none ";
        })

        // Keep the popup open when the mouse enters the popup
        beforeLoginPopUp.addEventListener('mouseenter', () => {
            console.log('mouseenter on beforeloginPopUp');
            beforeLoginPopUp.style.display = "flex"; // Keep the popup open
        });

        // Hide the popup when the mouse leaves the popup
        beforeLoginPopUp.addEventListener('mouseleave', () => {
            console.log('mouseleave on beforeloginPopUp');
            beforeLoginPopUp.style.display = "none"; // Hide the popup
            // accountHover1.style.backgroundColor = ''; // Reset background color
        });

    } else {
        console.error("Element not found!");
    }

}
function showAccountPopup() {
    const accountHover = document.querySelector('.accountLink');
    if (accountHover) {
        let afterLoginPopUp = document.querySelector('.afterloginPopUp')

        console.log(document.querySelector('.navLinks a').href = '')
        accountHover.addEventListener('mouseenter', () => {
            console.log('mouseover on accountLink')
            accountHover.style.backgroundColor = 'lightgreen'
            afterLoginPopUp.style.display = "flex ";
        });
        accountHover.addEventListener('mouseleave', () => {
            console.log('mouseleave on accountLink')
            afterLoginPopUp.style.display = "none ";
        })

        // Keep the popup open when the mouse enters the popup
        afterLoginPopUp.addEventListener('mouseenter', () => {
            console.log('mouseenter on afterLoginPopUp');
            afterLoginPopUp.style.display = "flex"; // Keep the popup open
        });

        // Hide the popup when the mouse leaves the popup
        afterLoginPopUp.addEventListener('mouseleave', () => {
            console.log('mouseleave on afterLoginPopUp');
            afterLoginPopUp.style.display = "none"; // Hide the popup
            // accountHover1.style.backgroundColor = ''; // Reset background color
        });

    } else {
        console.error("Element not found!");
    }

}


//navbar hamburgar animation
window.onload = function () {
    var menuButton = document.querySelector(".menuButton");
    var resNavbar = document.querySelector(".res_navbar");

    menuButton.addEventListener("click", function () {
        resNavbar.classList.toggle("fade-in");
    });
};

function myfunction() {
    alert("Order placed Successfully");
}

function scrolltosection() {
    document.querySelector(".cat-logo").scrollIntoView({ behavior: "smooth" });
}

function changeMainImage(imageSrc) {
    document.querySelector("#main-img").src = imageSrc;
}

function selectSize(size) {
    document.querySelector("#size-s").classList.remove("selected");
    document.querySelector("#size-m").classList.remove("selected");
    document.querySelector("#size-l").classList.remove("selected");

    document
        .querySelector("#size-" + size.toLowerCase())
        .classList.add("selected");
}

function selectQuantity(quantity) {
    document.querySelector("#quantity-1").classList.remove("selected");
    document.querySelector("#quantity-2").classList.remove("selected");
    document.querySelector("#quantity-3").classList.remove("selected");

    document
        .querySelector("#quantity-" + quantity.toLowerCase())
        .classList.add("selected");
}

// buy btn
function openCheckoutPopup() {
    document.getElementById("checkout-popup").classList.remove("hidden");
}

function closeCheckoutPopup() {
    document.getElementById("checkout-popup").classList.add("hidden");
}

function placeOrder() {
    const form = document.getElementById("billing-form");
    if (!form.checkValidity()) {
        alert("Please fill in all required fields.");
        // form.reportValidity();
        return;
    }

    //   //   // Clear the cart after order placement
    localStorage.removeItem("cart");
    closeCheckoutPopup();
    document.getElementById("order-confirmation").classList.remove("hidden");
}

function closeOrderConfirmation() {
    document.getElementById("order-confirmation").classList.add("hidden");
    window.location.href = "index.html"; // Redirect to home or any other page
}

////////////////

// const accountHover = document.querySelector('.accountLink');
// if (accountHover) {
//     let beforeLoginPopUp = document.querySelector('.beforeloginPopUp')

//     accountHover.addEventListener('mouseenter', () => {
//         console.log('mouseover on accountLink')
//         accountHover.style.backgroundColor = 'lightgreen'
//         beforeLoginPopUp.style.display = "flex ";

//     });
//     accountHover.addEventListener('mouseleave', () => {
//         console.log('mouseleave on accountLink')
//         beforeLoginPopUp.style.display = "none ";
//     })

//     // Keep the popup open when the mouse enters the popup
//     beforeLoginPopUp.addEventListener('mouseenter', () => {
//         console.log('mouseenter on beforeloginPopUp');
//         beforeLoginPopUp.style.display = "flex"; // Keep the popup open
//     });

//     // Hide the popup when the mouse leaves the popup
//     beforeLoginPopUp.addEventListener('mouseleave', () => {
//         console.log('mouseleave on beforeloginPopUp');
//         beforeLoginPopUp.style.display = "none"; // Hide the popup
//         // accountHover1.style.backgroundColor = ''; // Reset background color
//     });

// } else {
//     console.error("Element not found!");
// }
