// 회원가입
app.post('/signup', (req, res) => {
    const { email, password, firstName, lastName } = req.body;
  
    // 새로운 사용자 데이터베이스에 추가
    connection.query(
      'INSERT INTO sales.customers (passwd, first_name, last_name, email) VALUES (?, ?, ?, ?)',
      [password, firstName, lastName, email],
      (error, results, fields) => {
        if (error) {
          console.error('Error:', error);
          res.json({ success: false, message: 'Failed to signup' });
        } else {
          res.json({ success: true, message: 'Signup successful' });
        }
      }
    );
  });
  