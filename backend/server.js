
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 2200;
const SALT_ROUNDS = 10;
const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://localhost:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  text: String
});
const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send('Missing required fields');
  }
  bcrypt.hash(password, SALT_ROUNDS)
    .then(hashedPassword => {
      const newUser = new User({ name, email, password: hashedPassword });
      newUser.save()
        .then(user => {
          res.redirect('/home.html');
        })
        .catch(err => {
          if (err.code === 11000) {
            res.send('<script>alert("Email already registered. Please try a different email.");</script>');
          } else {
            console.error(err);
            res.status(500).send('Error signing up');
          }
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error signing up');
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.send('<script>alert("User not found. Please sign up."); </script>');
      } else {
        console.log('Password:', password);
        console.log('User password:', user.password);
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            console.log('Password match:', isMatch);
            if (isMatch) {
              res.redirect('/home.html');
            } else {
              res.send('<script>alert("Incorrect password. Please try again.");</script>');
            }
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Error logging in');
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error logging in');
    });
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  const task = new Task({ text: req.body.text });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    console.log('Delete request received for task ID:', req.params.id); // Add this line
    const task = await Task.findByIdAndDelete(req.params.id);
    console.log('Deleted task:', task); // Add this line
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err); // Add this line
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
