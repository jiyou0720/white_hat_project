const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL 연결 설정
const connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '1234',
        database: 'sales.customers'
});

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 로그인
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // 해당 이메일과 비밀번호를 가진 사용자가 있는지 확인함
  connection.query('SELECT * FROM sales.customers WHERE email = ? AND passwd = ?', [email, password], (error, results, fields) => {
    if (error) throw error;

    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// 서버 start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
