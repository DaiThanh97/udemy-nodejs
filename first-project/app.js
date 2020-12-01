const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(): cho phép thêm mới middleware function, khá linh động. 
// function truyền vào use() sẽ được thực thi với mọi request gọi lên.
// next là 1 function sẽ được truyền vào bởi express
// và next phải dc thực thi để cho phép request đi tới middleware tiếp theo.
// app.use((req, res, next) => {
//     console.log("In middleware");
//     next();
// })

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).send("<h1>Page Not Found</h1>")
});

app.listen(3000);
