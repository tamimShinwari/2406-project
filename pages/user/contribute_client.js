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

    for (var i in currentUser.moviesContributed) {
        document.getElementById("userMovies").innerHTML += `<option value="${currentUser.moviesContributed[i][0]}">${currentUser.moviesContributed[i][1]}</option>`;
    }
}


function startFunction() {
    if (!getCookie("token")) window.location.href = "/";

    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            let body = JSON.parse(this.response);
            if (Object.keys(body).length == 0) window.location.href = "/";
            else currentUser = body;

            if (currentUser.accountType != "contributer") {
                alert("Only contributers can upload a movie.")
                return window.location.href = "/home";
            }

            setPage();
        }
    };
	xhttp.open("POST", "/getSession", true);
    xhttp.setRequestHeader('token', getCookie("token"));
    xhttp.send();
}

function fetchMovie(id) {
    if (id == "0") {
        document.forms[0]['id'].value = "Set by server";
        document.forms[0]['year'].value = "";
        document.forms[0]['title'].value = "";
        document.forms[0]['genre'].value = "";
        document.forms[0]['rated'].value = "";
        document.forms[0]['actors'].value = "";
        document.forms[0]['poster'].value = "";
        document.forms[0]['runtime'].value = "";
        document.forms[0]['director'].value = "";
    }
    else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let body = JSON.parse(this.response);

                document.forms[0]['id'].value = body._id;
                document.forms[0]['year'].value = body.Year;
                document.forms[0]['title'].value = body.Title;
                document.forms[0]['genre'].value = body.Genre;
                document.forms[0]['rated'].value = body.Rated;
                document.forms[0]['actors'].value = body.Actors;
                document.forms[0]['poster'].value = body.Poster;
                document.forms[0]['runtime'].value = body.Runtime;
                document.forms[0]['director'].value = body.Director;
            }
        };
        xhttp.open("POST", "/getMovie", true);
        xhttp.setRequestHeader('movieID', id);
        xhttp.send();
    }
}

function saveMovie() {
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            let body = this.response;
            
            if (body == "true") alert("Created Movie");
            location.reload();
        }
    };
	xhttp.open("POST", "/makeMovie", true);
    xhttp.setRequestHeader('username', currentUser.username);
    xhttp.setRequestHeader('year', document.forms[0]['year'].value);
    xhttp.setRequestHeader('title', document.forms[0]['title'].value);
    xhttp.setRequestHeader('genre', document.forms[0]['genre'].value);
    xhttp.setRequestHeader('rated', document.forms[0]['rated'].value);
    xhttp.setRequestHeader('actors', document.forms[0]['actors'].value);
    xhttp.setRequestHeader('poster', document.forms[0]['poster'].value);
    xhttp.setRequestHeader('runtime', document.forms[0]['runtime'].value);
    xhttp.setRequestHeader('director', document.forms[0]['director'].value);
    xhttp.send();
}

function deleteMovie() {
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            let body = this.response;
            
            if (body == "true") alert("Deleted Movie");
            location.reload();
        }
    };
	xhttp.open("POST", "/deleteMovie", true);
    xhttp.setRequestHeader('username', currentUser.username);
    xhttp.setRequestHeader('movieID', document.forms[0]['id'].value);
    xhttp.setRequestHeader('title', document.forms[0]['title'].value);
    xhttp.send();
}