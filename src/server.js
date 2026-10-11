const express = require('express')
const path = require('path')
require('dotenv').config()
const db = require('./config/db')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
    res.json({status: "Ok", message: "Kanban API is running smoothly!"});
});
db.query('SELECT * FROM tasks', (err, res) => {
    if(err){
        console.error("Error connecting to database:", err);
    }
    else {
        console.log('PostgreSQL connected Successfully!');
    }
});

app.get('/api/tasks', async(req, res)=> {
    try{
        const result = await db.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(result.rows);
    } catch(err) {
        console.err('Error fetching data', err);
        res.status(500).json({error: "Database error fetching tasks"});
    }
});

app.post('/api/tasks', async(req, res)=>{
    const {title, description, status} = req.body
    try {
        const query = `INSERT INTO tasks (title, description, status)
        VALUES ($1, $2, $3) RETURNING *`;
        const values = [title, description || '', status || 'todo'];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch(err){
        console.error('Error creating tasks:', err);
        res.status(500).json({error: 'Database error creating tasks'});
    }
});

app.patch('/api/tasks/:id', async(req, res) => {
    const {id} = req.params;
    const {status, title, description} = req.body;

    try {
        const query = `UPDATE tasks SET status = COALESCE($1, status),
        title = COALESCE($2, title), description = COALESCE($3, description)
        WHERE ID = $4 RETURNING *`;
        const values = [status, title, description, id];
        const result = await db.query(query, values);
        if (result.rows.length == 0){
            return res.status(404).json({error: "Task not found"});

        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error Updated tasks: ', err);
        res.status(500).json({error: 'Database error updating tasks'});
    }
});
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', deletedTask: result.rows[0] });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Database error deleting task' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});