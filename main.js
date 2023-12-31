const express = require('express');
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;

app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'whs',
});

app.use((err, req, res, next) => {
  console.error('오류:', err);
  res.status(500).json({ error: '내부 서버 오류' });
});

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// 회원가입
app.post('/signup', [
  body('username').notEmpty().withMessage('사용자 이름은 필수입니다'),
  body('password').notEmpty().withMessage('비밀번호는 필수입니다'),
], async (req, res) => {
  const { username, password } = req.body;

  try {
    validationResult(req).throw();

    // DB에 사용자 등록
    await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    res.status(201).json({ message: '가입 성공' });
  } catch (error) {
    console.error('가입 중 오류:', error);

    res.status(400).json({ errors: error.array() });
  }
});

// 로그인
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // DB 조회
    const result = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

    if (result.length > 0) {
      res.status(200).json({ message: '로그인 성공' });
    } else {
      res.status(401).json({ error: '정보가 없습니다.' });
    }
  } catch (error) {
    console.error('로그인 중 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 주문
app.post('/place-order', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // DB 정보 등록
    const result = await pool.query('INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity]);

    res.status(201).json({ message: '주문 성공', orderId: result.insertId });
  } catch (error) {
    console.error('주문 등록 중 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 주문내역
app.get('/order-history/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);

    res.status(200).json(result);
  } catch (error) {
    console.error('주문 내역 조회 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 주문 상세 정보 
app.get('/order/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // 주문 상세 정보 조회
    const result = await pool.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ error: '주문을 찾을 수 없음' });
    }
  } catch (error) {
    console.error('주문 상세 정보 조회 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 카테고리
app.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Categories');
    res.status(200).json(result);
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 검색
app.get('/search', async (req, res) => {
  const keyword = req.query.keyword;

  try {
    const result = await pool.query('SELECT * FROM Posts INNER JOIN Categories ON Posts.category_id = Categories.id WHERE Categories.name = ?', [keyword]);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: '일치하는 결과가 없습니다.' });
    }
  } catch (error) {
    console.error('검색 중 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});


// 제품
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Products');

    res.status(200).json(result);
  } catch (error) {
    console.error('제품 조회 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 주문 정보
app.get('/order-details/:orderID', async (req, res) => {
  const orderID = req.params.orderID;

  try {
    const result = await pool.query('SELECT * FROM OrderDetails WHERE orderID = ?', [orderID]);
    res.status(200).json(result);
  } catch (error) {
    console.error('주문 상세 정보 조회 오류:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 배송 정보 
app.get('/shipping/:orderID', async (req, res) => {
  const orderID = req.params.orderID;

  try {
    const result = await pool.query('SELECT * FROM Shipping WHERE orderID = ?', [orderID]);

    res.status(200).json(result);
  } catch (error) {
    console.error('배송 정보 조회 오류:', error);

    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 리뷰
app.get('/reviews/:productID', async (req, res) => {
  const productID = req.params.productID;

  try {
    const result = await pool.query('SELECT * FROM Reviews WHERE productID = ?', [productID]);

    res.status(200).json(result);
  } catch (error) {
    console.error('리뷰 조회 오류:', error);

    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 수신 대기 중입니다`);
});
