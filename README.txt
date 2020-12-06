Comp 2406:
Project: Movie Database

Name: Mohammad Tamim Shinwari
Student ID: 101127675


Partner Name: Yize Zhao
Student ID: 101103310


Instructions:
    - Install the server, open command prompt and type "npm install" to install all dependancies. Then type "npm start" to run the server.
    - Your server is now running on the localhost:3000.
    - Going to http://localhost:3000/ will open the login page (not setup yet). Just press login and it will take you to the main page.


The main page makes an AJAX request to get all the genres in the database so the user can browse through them.



3. Outline some details regarding your planned REST API. The project specification includes a minimum API that you must support, but you will likely want to add additional routes/parameters/etc. to support the functionality of your application.

Make requests to get general info about the database (number of movies by each actor, movies by country, etc..)



We will create the individual user pages once we have Sessions implimented into the system.

P.S. Use the "movie-data-short.json" and not the "movie-data.json" as browse page does not have pagination implimented yet and calling http://localhost:3000/browse without any params will try to render all the movies onto the page.