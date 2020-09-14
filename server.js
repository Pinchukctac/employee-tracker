// Dependencies
const connection = require("./db/db.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");


// prompt and promise
 function askQuestion() {
  inquirer
    .prompt({
      type: "list",
      name: "start",
      message: "What would you like to do?",
      choices: [
        "view all employees",
        "view all roles",
        "view all departments",
        "add employee",
        "add department",
        "add role",
        "update employee role",
        "remove employee",
        "Cancel"
      ]
    })
    .then(function(answer) {
      console.log(answer);

      switch (answer.start) {
        case "view all employees":
          viewemployees();
          break;

        case "view all roles":
          viewroles();
          break;

        case "view all departments":
          viewdepartments();
          break;

        case "add employee":
          addEmployee();
          break;

        case "update employee role":
          updateEmpRole();
          break;

        case "add department":
          addDepartment();
          break;

        case "add role":
          addRole();
          break;

        case "Cancel":
          connection.end();
          break;
      }
    });
};

//  view all departments currently in the database
function viewdepartments() {
  connection.query("SELECT * FROM department", function(err, answer) {
    if (err) throw err;
    console.table(answer);
    askQuestion();
  });
}

// view all employee roles currently in the database
function viewroles() {
  connection.query("SELECT * FROM roles", function(err, answer) {
    if (err) throw err;
    console.table(answer);
    askQuestion();
  });
}

// view all employees currently in the database
function viewemployees() {
  var query =
    "SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department on roles.department_id = department.id;";
  connection.query(query, function(err, answer) {
    if (err) throw err;
    console.table(answer);
    askQuestion();
  });
}

// add a new department into the database
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      message: "enter department name",
      name: "dept"
    })
    .then(function(answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.dept
        },
        function(err, answer) {
          if (err) throw err;
          console.table(answer);
        askQuestion();
        }
      );
  })
};
// add a new employee to database
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter employee first name",
        name: "firstname"
      },
      {
        type: "input",
        message: "Enter employee last name",
        name: "lastname"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstname,
          last_name: answer.lastname,
          role_id: null,
          manager_id: null
        },
        function(err, answer) {
          if (err) {
            throw err;
          }
          console.table(answer);
          askQuestion();
        }
      );
    });
}

function updateEmpRole() {
  let allemployee = [];
  connection.query("SELECT * FROM employee", function(err, answer) {
    // console.log(answer);
    if (err) throw err;
    for (let i = 0; i < answer.length; i++) {
      let employeeString =
        answer[i].id + " " + answer[i].first_name + " " + answer[i].last_name;
      allemployee.push(employeeString);
    }
    inquirer.prompt([
        {
          type: "list",
          name: "updateEmpRole",
          message: "select employee to update role",
          choices: allemployee
        },
      ])
      .then(function(res,){
        console.log(res);
        connection.query("SELECT title, id FROM roles", function(err, data) {
            if (err) throw err;
            console.log(data);
        inquirer.prompt([{    
          type: "list",
          message: "select new role",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < data.length; i++) {
              choiceArray.push({name: data[i].title, value: data[i].id});
            }
            return choiceArray;
          },
          name: "newrole"
        }])
      .then(function(answer) {
        console.log("about to update", answer);
        const idToUpdate = {};
        idToUpdate.employeeId = parseInt(res.updateEmpRole.split(" ")[0]);
       
        connection.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [answer.newrole, idToUpdate.employeeId],
          function(err, data) {
            askQuestion();
          })
        })
      }
    );
  });
})
}
// add a new role
function addRole() {
  connection.query("SELECT * FROM department", function(err, results){
    if (err) throw err;
  inquirer.prompt([
      {
        type: "input",
        message: "enter employee title",
        name: "addtitle"
      },
      {
        type: "input",
        message: "enter employee salary",
        name: "addsalary"
      },
      {
        type: "list",
        message: "What department is the role in?",
        name: "addDepId",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push({name: results[i].name, value: results[i].id});
          }
          return choiceArray;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO roles(title, salary, department_id) values(?,?,?)",
        [
          answer.addtitle,
          answer.addsalary,
          answer.addDepId
        ],
        function(err, answer) {
          if (err) throw err;
          
          console.table(answer);
          askQuestion();
        }
      );
    })
  })
};

askQuestion();