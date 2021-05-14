const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
const PORT = process.env.PORT || 5000;

//process.env.PORT

//middelware
app.use(cors());
app.use(express.json());

if(process.env.NODE_ENV === "production"){
    //server static content
    //npm run build
    app.use(express.static(path.join(__dirname, "client/build")));
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
      });
}

//ROUTES//

//create a todo
app.post("/todos", async(req, res) => {
 try {
    const { description } = req.body; 
    const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);

    res.json(newTodo.rows[0]);
 } catch (err) {
     console.error(err.message);
 }
});

//get all todos
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");

        res.json(allTodos.rows);
    }  catch (err) {
        console.error(err.message);
    }
})

//get a todo
app.get("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

        res.json(todo.rows[0]);
    }  catch (err) {
        console.error(err.message);
    }
})

//update a todo
app.put("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body; 
        const updatetodo = await pool.query("UPDATE todo set description = $1 where todo_id = $2", [description, id]);

        res.json("Todo was updated");
    }  catch (err) {
        console.error(err.message);
    }
})

//delete a todo
app.delete("/todos/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("Delete from todo where todo_id = $1", [id]);

        res.json("Todo was deleted");
    }  catch (err) {
        console.error(err.message);
    }
});

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
})


app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`);
})
