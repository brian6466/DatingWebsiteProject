const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

const userRouter = require('./routes/users')

app.use('/users', userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

