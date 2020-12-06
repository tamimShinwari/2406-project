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
    "accountType": "",
    "moviesContributed": [],
    "followers": [],
    "following": []
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

let movies = [];
let containerSize = 0;
function loadMovies() {
	startFunction();
	let args = {};
	let temp = window.location.href.split("?");
	let reqArgs = "";
	
	if (temp.length > 1) {
		reqArgs = `?${temp[1]}`;
		temp = temp[1].split("&");
		for (var i in temp) {
			let key = temp[i].split("=")[0];
			let data = temp[i].split("=")[1];
			args[key] = data;
		}
	}
	
	if ("filter" in args) document.getElementById("filter-lable").innerHTML = "Browse - Recommended";
	if ("director" in args) document.getElementById("filter-lable").innerHTML = `Browse - Director: ${args["director"].replace(/%20/g, " ")}`;
	if ("genre" in args) document.getElementById("filter-lable").innerHTML = `Browse - Genre: ${args["genre"].replace(/%20/g, " ")}`;
	if ("title" in args) document.getElementById("filter-lable").innerHTML = `Browse - Title: ${args["title"].replace(/%20/g, " ")}`;
	if ("actor" in args) document.getElementById("filter-lable").innerHTML = `Browse - Actor: ${args["actor"].replace(/%20/g, " ")}`;
	if ("year" in args) document.getElementById("filter-lable").innerHTML = `Browse - Year: ${args["year"]}`;
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let body = JSON.parse(this.response);
			movies = body;
			fillMovies()
		}
	};
	xhttp.open("GET", `/movies${reqArgs}`, true);
	xhttp.send();
}

let movieContainer = document.getElementById("movies-container");
function fillMovies() {
	for (i=containerSize; i<(containerSize+12); i++) {
		movieContainer.innerHTML += `
			<div class="movie-container">
				<div class="movie-container-inner">
					<div class="movie-container-front" style="background-image: url('${movies[i].Poster}')">
						<p class="rating">${movies[i].Rated}</p>
					</div>
					<div class="movie-container-back">
						<p><b>Title: </b>${movies[i].Title}</p>
						<p><b>Year: </b>${movies[i].Year}</p>
						<p><b>Runtime: </b>${movies[i].Runtime}</p>
						<p><b>Director: </b>${movies[i].Director}</p>
						<p><b>Genre: </b>${movies[i].Genre}</p>
						<p><b>Actors: </b>${movies[i].Actors}</p>
					</div>
				</div>
			</div>
		`;
	}
	containerSize+=12;
}