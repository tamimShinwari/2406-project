function toggleForm(t) {
	switch (t) {
		case "login":
			document.getElementById("login-form").style.display = "block";
			document.getElementById("register-form").style.display = "none";
			break;
		
		case "register":
			document.getElementById("login-form").style.display = "none";
			document.getElementById("register-form").style.display = "block";		
			break;

		default:
			break;
	}
}

function validateLogin() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
            let body = JSON.parse(this.response);
			if (body[0]) {
				var d = new Date();
  				d.setTime(d.getTime() + 86400000);
				document.cookie = `token=${body[1]}; expires=${d.toGMTString()}`
				window.location.href = "/home";
			}
			else alert(body[1]);
		}
	};
	xhttp.open("POST", "/startSession", true);
	xhttp.setRequestHeader('username', document.getElementById("login_username").value);
	xhttp.setRequestHeader('password', document.getElementById("login_password").value);
    xhttp.send();
}

function registerUser() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let body = JSON.parse(this.response);
			console.log(body)
			if (body[0]) {
				alert("User created\nYou can now login");
				toggleForm("login");
			}
			else alert("Username already exists");
		}
	};
	xhttp.open("POST", "/createUser", true);
	xhttp.setRequestHeader('username', document.getElementById("register_username").value);
	xhttp.setRequestHeader('password', document.getElementById("register_password").value);
    xhttp.send();
}

document.getElementById("login_password").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        validateLogin();
    }
});

document.getElementById("register_password").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        registerUser();
    }
});