const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile)

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { type } = require("os");

const teamMembers = [];

function startApp() {
    console.log("Welcome! Let's build your team");
    createTeam();
}

async function createTeam() {
    response = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Please provide team member's name?"
        },

        {
          type: "input",
          name: "id",
          message: "Please provide team member's id number?"
        },

        {
          type: "input",
          name: "email",
          message: "Please provide the team member's email:"
        },

        {
          type: "list",
          name: "role",
          message: "What is the team member's role?",
          choices: [
            "Manager",
            "Engineer",
            "Intern"
          ]

        }
        

    ]);

    let roleQuestion = "";

    if (response.role === "Manager") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "officeNumber",
                message: "What is the Manager's office number?"
            }

        ]);

        const manager = new Manager(response.name, response.id, response.email, roleQuestion.officeNumber);
        teamMembers.push(manager);
    }

    if (response.role === "Engineer") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "github",
                message: "What is the engineer's Github username?",
            }


        ]);

        const engineer = new Engineer(response.name, response.id, response.email, roleQuestion.github);
        teamMembers.push(engineer);
    }

    if (response.role === "Intern") {
        roleQuestion = await inquirer.prompt([
            {
                type: "input",
                name: "school",
                message: "What school does the intern attend?",
            }


        ]);

        const intern = new Intern(response.name, response.id, response.email, roleQuestion.school);
        teamMembers.push(intern);
    }

    console.log(teamMembers);

    askToContinue = await inquirer.prompt([
        {   
            type: "list",
            name: "continue",
            message: "Would you like to add another team member?",
            choices: [
                "Yes",
                "No"
            ]
        }
    ]);

    if (askToContinue.continue === "Yes") {

        createTeam();

    } else {
        console.log("Here is your team:")
        console.log(teamMembers);

        const html = render(teamMembers);

        //Make sure directory exists.  Create if not.
        if (fs.existsSync(OUTPUT_DIR) === false) {
            fs.mkdirSync(OUTPUT_DIR);
        }

        await writeFileAsync(outputPath, html);

        
        console.log("Great!  Your team html is created!");



    }




}


startApp();
