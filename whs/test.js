const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json()); 

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'whs',
});

// 미들웨어: 모든 요청에 대한 기본 응답 헤더 설정
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

/*  app.post('/signup', (req, res) => {
    // 회원가입 로직
    const { username, password } = req.body;
  
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    connection.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('Error in signup: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(201).json({ message: 'Signup successful' });
      }
    });
  });
  
  app.post('/login', (req, res) => {
    // 로그인 로직
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    connection.query(query, [username, password], (err, result) => {
      if (err) {
        console.error('Error in login: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (result.length > 0) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    });
  });*/
  

  app.post('/place-order', (req, res) => {
    const { userId, productId, quantity } = req.body;
    const query = `INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)`;
    connection.query(query, [userId, productId, quantity], (err, result) => {
      if (err) {
        console.error('주문하기 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(201).json({ message: '주문이 성공적으로 완료되었습니다', orderId: result.insertId });
      }
    });
  });

  
  app.get('/order-history/:userId', (req, res) => {
    const userId = req.params.userId;
  
    // MySQL 쿼리를 사용하여 사용자의 주문 내역을 검색
    const query = `SELECT * FROM orders WHERE user_id = ?`;
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.error('주문 내역 검색 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(200).json(result);
      }
    });
  });

  app.get('/order/:orderId', (req, res) => {
    const orderId = req.params.orderId;
  
    // MySQL 쿼리를 사용하여 특정 주문의 상세 정보를 검색
    const query = `SELECT * FROM orders WHERE order_id = ?`;
    connection.query(query, [orderId], (err, result) => {
      if (err) {
        console.error('주문 상세 정보 검색 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        if (result.length > 0) {
          res.status(200).json(result[0]);
        } else {
          res.status(404).json({ error: '주문을 찾을 수 없습니다' });
        }
      }
    });
  });
  

// 제품 정보 추가 -- 이 부분은 어떻게 할지 고민중입니다.
const products = [
    { name: '제품1', description: '이 제품은 좋습니다.', price: 29.99, categoryID: 1 },
    { name: '제품2', description: '놀라운 제품입니다.', price: 49.99, categoryID: 2 },
    { name: '제품3', description: '고품질 제품입니다.', price: 79.99, categoryID: 3 },
    // ... 다른 제품들 추가 
  ];
  
  // 제품 정보를 데이터베이스에 추가
  products.forEach((product) => {
    connection.query(`
      INSERT INTO Products (name, description, price, categoryID)
      VALUES (?, ?, ?, ?);
    `, [product.name, product.description, product.price, product.categoryID], (err) => {
      if (err) {
        console.error('제품 정보 추가 오류: ', err);
      } else {
        console.log('제품 정보가 성공적으로 추가되었습니다.');
      }
    });
  });
  
  
// 모든 카테고리 조회
app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM Categories', (err, result) => {
      if (err) {
        console.error('카테고리 조회 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(200).json(result);
      }
    });
  });

// 모든 제품 조회
app.get('/products', (req, res) => {
    connection.query('SELECT * FROM Products', (err, result) => {
      if (err) {
        console.error('제품 조회 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(200).json(result);
      }
    });
  });
  
  // 특정 주문에 대한 주문 상세 정보 조회
app.get('/order-details/:orderID', (req, res) => {
    const orderID = req.params.orderID;
  
    connection.query('SELECT * FROM OrderDetails WHERE orderID = ?', [orderID], (err, result) => {
      if (err) {
        console.error('주문 상세 정보 조회 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(200).json(result);
      }
    });
  });

// 모든 카테고리 조회
app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM Categories', (err, result) => {
      if (err) {
        console.error('카테고리 조회 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(200).json(result);
      }
    });
  });
  
  // 특정 주문에 대한 배송 정보 조회
app.get('/shipping/:orderID', (req, res) => {
    const orderID = req.params.orderID;
  
    connection.query('SELECT * FROM Shipping WHERE orderID = ?', [orderID], (err, result) => {
      if (err) {
        console.error('배송 정보 조회 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(200).json(result);
      }
    });
  });
  

  // 특정 제품에 대한 모든 리뷰 조회
app.get('/reviews/:productID', (req, res) => {
    const productID = req.params.productID;
  
    connection.query('SELECT * FROM Reviews WHERE productID = ?', [productID], (err, result) => {
      if (err) {
        console.error('리뷰 조회 오류: ', err);
        res.status(500).json({ error: '내부 서버 오류' });
      } else {
        res.status(200).json(result);
      }
    });
  });
  