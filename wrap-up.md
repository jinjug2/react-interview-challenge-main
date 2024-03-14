## Questions

### Please provide instructions on how to run your project in a bulleted list below.

    * Clone the public repo from here https://github.com/jinjug2/react-interview-challenge-main.git
    * After cloning, navigate to the directory and open the project folder in VSCode
    * Do the `docker-compose up -d` as the instructions in the README.md file
    * Open a terminal window and change the current directory by typing "cd challenge"
    * Type in "npm install"
    * In a new terminal in the `challenge` directory Type in "npm run start:server" to run the server
    * And finally in a new terminal window in the `challenge` directory type in "npm start" to run the frontend app. It will open a browser tab at localhost port 3000

### Were there any pieces of this project that you were not able to complete that you'd like to mention?

    I think I completed all of them, unless checking out the dates for implementing that $400/per day withdrawal limit mechanism is intended, I just save the dates in a local const for faster demo and debugging, but I could have saved them in the db.

### If you were to continue building this out, what would you like to add next?

    A better user interface probably and more error checking mechanisms and repetitive tasks put in the npm scripts

### If you have any other comments or info you'd like the reviewers to know, please add them below.

    The `init-db.sql` insert statement actually missing some null values, this prevents insertion of new data because credit_limit do not have the NOT NULL modifier in the CREATE TABLE statement. I don't know if this was unintentional or just part of the test. So I have to modify this file to be able to insert and proceed.

    Node version used: 20.11.1 LTS
    React project sa created using creat-react-app
