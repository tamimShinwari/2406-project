function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function toggleMenu() {
    let userMenu = document.getElementById("user-menu");
    let userMenuOut = document.getElementById("user-menu-out");
    
    if (window.getComputedStyle(userMenu, null).display == "none") {
        userMenu.style.display = "block";
        userMenuOut.style.display = "block";
    }
    else {
        userMenu.style.display = "none";
        userMenuOut.style.display = "none";
    }
}

function logout() {
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            if (this.response == "true") {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            }
            window.location.href = "/";
        }
    };
	xhttp.open("POST", "/deleteSession", true);
    xhttp.setRequestHeader('token', getCookie("token"));
    xhttp.send();
}

let currentUser = {
    "username": "user",
    "password": "",
    "email": "",
    "accountType": "",
    "moviesContributed": [],
    "followers": [],
    "following": [],
    "list": []
}

function setPage() {
    document.getElementById("userName_placeholder").innerHTML = `<i class="fas fa-user"></i> &nbsp; ${currentUser.username}`;
}

function startFunction() {
    if (!getCookie("token")) window.location.href = "/";

    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            let body = JSON.parse(this.response);
            if (Object.keys(body).length == 0) window.location.href = "/";
            else currentUser = body;
            setPage();
        }
    };
	xhttp.open("POST", "/getSession", true);
    xhttp.setRequestHeader('token', getCookie("token"));
    xhttp.send();
}

function browseGenre(g) { window.location.href = `/browse?genre=${g}`; }

function searchMovie() {
    let filter = document.getElementById("search-type").value;
    let query = document.getElementById("query").value;

    switch (filter) {
        case "1":
            window.location.href = `/browse?title=${query}`;
            break;

        case "2":
            window.location.href = `/browse?year=${query}`;
            break;

        case "3":
            window.location.href = `/browse?actor=${query}`;
            break;

        case "4":
            window.location.href = `/browse?director=${query}`;
            break;
        
        case "5":
            window.location.href = `/user/${query}`;
            break;
    
        default:
            break;
    }
}

document.getElementById("query").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchbtn").click();
    }
});