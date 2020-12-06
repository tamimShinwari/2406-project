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
    "following": []
}

function setPage() {
    document.getElementById("userName_placeholder").innerHTML = `<i class="fas fa-user"></i> &nbsp; ${currentUser.username}`;
}

function userDetails() {
    document.getElementById("username").innerHTML = currentUser.username;
    document.getElementById("type").innerHTML = currentUser.accountType;
    document.getElementById("followers").innerHTML = currentUser.followers.length;
    document.getElementById("following").innerHTML = currentUser.following.length;

    let followersList = document.getElementById("followers_list");
    let followingList = document.getElementById("following_list");

    if (currentUser.followers.length == 0) {
        followersList.innerHTML = `
            <li class="w3-border-0">
                <h3>Nothing to show here</h3>
            </li>
        `;
    }
    else {
        for (var i in currentUser.followers) {
            followersList.innerHTML += `
                <li class="w3-border-0" onclick="window.location.href='/user/${currentUser.followers[i]}'">
                    <img src="default-profile-icon.jpg" />
                    <h3>${currentUser.followers[i]}</h3>
                </li>
            `;
        }
    }

    if (currentUser.following.length == 0) {
        followingList.innerHTML = `
            <li class="w3-border-0">
                <h3>Nothing to show here</h3>
            </li>
        `;
    }
    else {
        for (var i in currentUser.following) {
            followingList.innerHTML += `
                <li class="w3-border-0" onclick="window.location.href='/user/${currentUser.following[i]}'">
                    <img src="default-profile-icon.jpg" />
                    <h3>${currentUser.following[i]}</h3>
                </li>
            `;
        }
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
            setPage();
            userDetails();
        }
    };
	xhttp.open("POST", "/getSession", true);
    xhttp.setRequestHeader('token', getCookie("token"));
    xhttp.send();
}