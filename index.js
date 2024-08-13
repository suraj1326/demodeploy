const express = require('express');
const app = express();
const mysql = require('mysql2');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');
const stream = require('stream');

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the "uploads" directory

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const db = mysql.createConnection({
    user: 'u913099084_neweyecare',
    host: 'localhost',
    password: 'Eyecare1234', 
    database: 'u913099084_neweyecare',
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to database');
});

app.use(express.json()); // Use built-in middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Get all products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ Status: true, Result: results });
    });
});

// Get a single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            res.json({ Status: true, Result: results[0] });
        } else {
            res.status(404).json({ Status: false, Error: 'Product not found' });
        }
    });
});


app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, stock, product_id, left_eye, right_eye } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = 'INSERT INTO products (branch, name, price, stock, product_id, left_eye, right_eye, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [1, name, price, stock, product_id, left_eye, right_eye, image];
  db.query(sql, values, (err, results) => {
      if (err) {
          console.error('Error adding product:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ Status: true, id: results.insertId, message: 'Product added successfully' });
  });
});



// Update a product by ID
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const productId = req.params.id;
  const { name, price, stock, product_id,left_eye,right_eye } = req.body; // Add product_id to destructured values
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image; // Use existing image path if not updated

  const sql = 'UPDATE products SET name = ?, price = ?, stock = ?, image = ?, product_id = ?, left_eye=?, right_eye=? WHERE id = ?';
  const values = [name, price, stock, image, product_id,left_eye,right_eye, productId]; // Include product_id in values array

  db.query(sql, values, (err) => {
      if (err) {
          console.error('Error updating product:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ Status: true, message: 'Product updated successfully' });
  });
});




// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// -----------------------------Login-----------------------------------------




// Login endpoint
app.post('/branch/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT branch FROM branchlogin WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error' });
      }
      if (result.length > 0) {
        res.status(200).json({ branch: result[0].branch });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  );
});





// -----------------Branch 1 Customer---------------------


// Get all customers
app.get('/branch1/customers', (req, res) => {
    const query = 'SELECT * FROM customers';
    db.query(query, (err, results) => {
        if (err) {
            res.json({ Status: false, Error: err.message });
        } else {
            res.json({ Status: true, Result: results });
        }
    });
});

// Get a single customer by ID
app.get('/branch1/customers/:id', (req, res) => {
    const customerId = req.params.id;
    const sql = 'SELECT * FROM customers WHERE id = ?';
    db.query(sql, [customerId], (err, results) => {
        if (err) {
            console.error('Error fetching customer:', err);
            return res.status(500).json({ Status: false, Error: 'Database error' });
        }
        if (results.length > 0) {
            res.json({ Status: true, Result: results[0] });
        } else {
            res.status(404).json({ Status: false, Error: 'Customer not found' });
        }
    });
});

app.put('/branch1/customers/:id', (req, res) => {
  const customerId = req.params.id;
  const { name, phone, email, address, date_of_birth, gender } = req.body;

  console.log('Updating customer:', {
      name, phone, email, address, date_of_birth, gender, customerId
  });

  const sql = 'UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, date_of_birth = ?, gender = ? WHERE id = ?';
  const values = [name, phone, email, address, date_of_birth, gender, customerId];

  db.query(sql, values, (err) => {
      if (err) {
          console.error('Error updating customer:', err);
          return res.status(500).json({ Status: false, Error: 'Database error' });
      }
      res.json({ Status: true, message: 'Customer updated successfully' });
  });
});


// Add a new customer with branch column set to 1
app.post('/branch1/customers', (req, res) => {
  const { name, phone, email, address, date_of_birth, gender } = req.body;
  const query = 'INSERT INTO customers (branch, name, phone, email, address, date_of_birth, gender) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [1, name, phone, email, address, date_of_birth, gender];

  db.query(query, values, (err, result) => {
      if (err) {
          console.error('Error adding customer:', err);
          res.json({ Status: false, Error: err.message });
      } else {
          res.json({ Status: true, Result: result.insertId });
      }
  });
});



// Delete a customer
app.delete('/branch1/customers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM customers WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.json({ Status: false, Error: err.message });
        } else {
            res.json({ Status: true });
        }
    });
});


// -----------------------------------------Sales-----------------------------------------------


app.get('/shala/sales', (req, res) => {
  const query = `
    SELECT s.id, s.sale_id, s.customer_name, s.customer_phone, s.created_at,
           s.payment_method, s.order_discount, s.paid, s.product_details
    FROM sales s
  `;

  db.query(query, async (error, results) => {
    if (error) {
      console.error('Error fetching sales data:', error);
      return res.status(500).json({ error: 'An error occurred while fetching sales data.', details: error.message });
    }

    // Process each sale
    const processedResults = await Promise.all(results.map(async (sale) => {
      try {
        // Parse product details JSON
        const productDetails = JSON.parse(sale.product_details || '[]');
        const productIds = productDetails.map(detail => detail.product_id);

        // Debugging: Log product IDs
        console.log('Product IDs:', productIds);

        if (productIds.length === 0) {
          return {
            ...sale,
            product_names: ''
          };
        }

        // Fetch product names based on IDs
        const productQuery = `
          SELECT id, name
          FROM products
          WHERE id IN (?)
        `;

        return new Promise((resolve, reject) => {
          db.query(productQuery, [productIds], (productError, productResults) => {
            if (productError) {
              return reject(productError);
            }

            // Debugging: Log product results
            console.log('Product Results:', productResults);

            // Map product IDs to names
            const productNameMap = productResults.reduce((acc, product) => {
              acc[product.id] = product.name;
              return acc;
            }, {});

            // Update product details with names
            const updatedProductDetails = productDetails.map(detail => ({
              ...detail,
              product_name: productNameMap[detail.product_id] || 'Unknown'
            }));

            resolve({
              ...sale,
              product_names: updatedProductDetails.map(detail => detail.product_name).join(', ')
            });
          });
        });
      } catch (err) {
        console.error('Error processing sale:', err);
        throw err;
      }
    }));

    res.json(processedResults);
  });
});


  

// Get all products
app.get('/shala/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
 


// Get product by ID
app.get('/shala/products/:id', (req, res) => {
    const productId = req.params.id;
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(results[0]);
    });
  });
  
 

  const { v4: uuidv4 } = require('uuid'); // Import the UUID function

// Add a new sale
app.post('/shala/sales', (req, res) => {
  const { customer_name, customer_phone, sales_data, payment_method, order_discount, paid } = req.body;
  const sale_id = uuidv4(); // Generate a new UUID for sale_id
  const branch = 1; // Branch ID is hardcoded as 1

  // Prepare the product details as a JSON string
  const product_details = JSON.stringify(sales_data);

  // Create a query for inserting the sale
  const query = `
    INSERT INTO sales (branch, sale_id, customer_name, customer_phone, payment_method, order_discount, paid, product_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query with the prepared parameters
  db.query(query, [branch, sale_id, customer_name, customer_phone, payment_method, order_discount, paid, product_details], (err, results) => {
    if (err) {
      console.error('Error inserting sale:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Sale added successfully' });
  });
});


// --------------------------------------------Supplier------------------------------------


// Your route here
app.post('/branch1/mala/addSupplier', (req, res) => {
    const { name, address, phone_number, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Supplier name and email are required' });
    }

    const query = `INSERT INTO suppliers (branch, name, address, phone_number, email) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [1, name, address, phone_number, email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Supplier added successfully', supplierId: results.insertId });
    });
});


// Fetch all suppliers
app.get('/branch1/mala/suppliers', (req, res) => {
    const query = 'SELECT * FROM suppliers';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});



// ------------------------------------purchase----------------------------------


// Route to fetch all suppliers
app.get('/follow/suppliers', (req, res) => {
    db.query('SELECT * FROM suppliers', (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching suppliers.' });
      }
      res.json(results);
    });
  });
  
  // Route to fetch a specific supplier
  app.get('/follow/suppliers/:id', (req, res) => {
    const supplierId = req.params.id;
    db.query('SELECT name, phone_number FROM suppliers WHERE supplier_id = ?', [supplierId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching supplier details.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Supplier not found.' });
      }
      res.json(results[0]);
    });
  });
  
  // Route to fetch all products
  app.get('/follow/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching products.' });
      }
      res.json(results);
    });
  });
  
  // Route to fetch a specific product
  app.get('/follow/products/:id', (req, res) => {
    const productId = req.params.id;
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching product details.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      res.json(results[0]);
    });
  });
  
  app.get('/wala/shala/purchases', (req, res) => {
    const query = `
      SELECT p.purchase_id, p.created_at, p.supplier_id, p.product_details, p.order_discount, p.paid, p.payment_method
      FROM purchases p
      JOIN suppliers s ON p.supplier_id = s.supplier_id
    `;
  
    db.query(query, async (error, results) => {
      if (error) {
        console.error('Error fetching purchases data:', error);
        return res.status(500).json({ error: 'An error occurred while fetching purchases data.', details: error.message });
      }
  
      // Process each purchase
      const processedResults = await Promise.all(results.map(async (purchase) => {
        try {
          // Parse product details JSON
          const productDetails = JSON.parse(purchase.product_details || '[]');
          const productIds = productDetails.map(detail => detail.product_id);
  
          // Debugging: Log product IDs
          console.log('Product IDs:', productIds);
  
          if (productIds.length === 0) {
            return {
              ...purchase,
              product_names: ''
            };
          }
  
          // Fetch product names based on IDs
          const productQuery = `
            SELECT id, name
            FROM products
            WHERE id IN (?)
          `;
  
          return new Promise((resolve, reject) => {
            db.query(productQuery, [productIds], (productError, productResults) => {
              if (productError) {
                return reject(productError);
              }
  
              // Debugging: Log product results
              console.log('Product Results:', productResults);
  
              // Map product IDs to names
              const productNameMap = productResults.reduce((acc, product) => {
                acc[product.id] = product.name;
                return acc;
              }, {});
  
              // Update product details with names
              const updatedProductDetails = productDetails.map(detail => ({
                ...detail,
                product_name: productNameMap[detail.product_id] || 'Unknown'
              }));
  
              resolve({
                ...purchase,
                product_names: updatedProductDetails.map(detail => detail.product_name).join(', ')
              });
            });
          });
        } catch (err) {
          console.error('Error processing purchase:', err);
          throw err;
        }
      }));
  
      // Fetch supplier details
      const supplierQuery = `
        SELECT s.supplier_id, s.name AS supplier_name, s.phone_number AS supplier_phone
        FROM suppliers s
      `;
  
      db.query(supplierQuery, (supplierError, supplierResults) => {
        if (supplierError) {
          console.error('Error fetching suppliers data:', supplierError);
          return res.status(500).json({ error: 'An error occurred while fetching supplier data.', details: supplierError.message });
        }
  
        // Map supplier details to each purchase
        const supplierMap = supplierResults.reduce((acc, supplier) => {
          acc[supplier.supplier_id] = {
            supplier_name: supplier.supplier_name,
            supplier_phone: supplier.supplier_phone
          };
          return acc;
        }, {});
  
        const finalResults = processedResults.map(purchase => ({
          ...purchase,
          supplier_name: supplierMap[purchase.supplier_id]?.supplier_name || 'Unknown',
          supplier_phone: supplierMap[purchase.supplier_id]?.supplier_phone || 'Unknown'
        }));
  
        res.json(finalResults);
      });
    });
  });
  

  app.post('/follow/purchases', (req, res) => {
    const { supplier_id, supplier_phone, purchase_data, payment_method, order_discount, paid } = req.body;
    const purchase_id = uuidv4(); // Generate a new UUID for purchase_id
    const branch = 1; // Branch ID is hardcoded as 1
  
    // Prepare the product details as a JSON string
    const product_details = JSON.stringify(purchase_data);
  
    // Create a query for inserting the purchase
    const query = `
      INSERT INTO purchases (branch, purchase_id, supplier_id, supplier_phone, payment_method, order_discount, paid, product_details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    // Execute the query with the prepared parameters
    db.query(query, [branch, purchase_id, supplier_id, supplier_phone, payment_method, order_discount, paid, product_details], (err, results) => {
      if (err) {
        console.error('Error inserting purchase:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json({ message: 'Purchase successfully' });
    });
  });
  


 

// Add Purchase
app.post('/follow/purchases', (req, res) => {
  const { supplier_id, supplier_phone, purchase_data, payment_method, order_discount, paid } = req.body;

  // Assuming purchase_data is an array of items
  const purchaseItems = purchase_data.map(item => [
    supplier_id,
    item.product_id,
    item.purchase_price,
    item.quantity,
    item.purchase_price * item.quantity,
    order_discount,
    paid,
    payment_method,
    new Date()
  ]);

  const query = `
    INSERT INTO purchases (supplier_id, product_id, purchase_price, quantity, item_total, order_discount, paid, payment_method, created_at)
    VALUES ?
  `;

  db.query(query, [purchaseItems], (error, results) => {
    if (error) {
      console.error('Error inserting purchase data:', error);
      return res.status(500).json({ error: 'An error occurred while adding the purchase.', details: error.message });
    }

    res.json({ message: 'Purchase added successfully!' });
  });
});

  // --------------------------------------Transaction-------------------------------------------



  app.get('/hamara/transaction', (req, res) => {
    const salesQuery = `
      SELECT
        sale_id,
        customer_name,
        created_at,
        payment_method,
        paid AS amount,
        product_details
      FROM sales
    `;
  
    db.query(salesQuery, (err, salesResults) => {
      if (err) {
        console.error('Error fetching sales:', err);
        return res.status(500).send('Error fetching sales');
      }
  
      // Extract product IDs from salesResults
      const productIds = salesResults
        .flatMap(sale => JSON.parse(sale.product_details).map(detail => detail.product_id))
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  
      if (productIds.length > 0) {
        const productsQuery = `
          SELECT id, name
          FROM products
          WHERE id IN (?)
        `;
  
        db.query(productsQuery, [productIds], (err, productsResults) => {
          if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
          }
  
          // Create a mapping of product IDs to names
          const productMap = productsResults.reduce((map, product) => {
            map[product.id] = product.name;
            return map;
          }, {});
  
          // Add product names to salesResults
          const salesWithProductNames = salesResults.map(sale => {
            const productDetails = JSON.parse(sale.product_details);
            const productNames = productDetails
              .map(detail => productMap[detail.product_id])
              .filter(name => name !== undefined)
              .join(', ');
  
            return {
              ...sale,
              product_names: productNames
            };
          });
  
          res.json({
            sales: salesWithProductNames,
            products: productsResults
          });
        });
      } else {
        res.json({
          sales: salesResults,
          products: []
        });
      }
    });
  });
  


  // -------------------------------------------------Barcode-------------------------------------


  // app.get('/api/products/barcode/:barcode', (req, res) => {
  //   const { barcode } = req.params;
  //   const query = 'SELECT * FROM products WHERE barcode = ?';
  
  //   db.query(query, [barcode], (err, results) => {
  //     if (err) {
  //       console.error('Error fetching product:', err);
  //       res.status(500).json({ message: 'Internal Server Error' });
  //       return;
  //     }
  //     if (results.length > 0) {
  //       res.json(results[0]);
  //     } else {
  //       res.status(404).json({ message: 'Product not available' });
  //     }
  //   });
  // });



  // ---------------------------------------------------Bracode------------------------------------


app.get('/doll/products/:product_id', (req, res) => {
  const productId = req.params.product_id;

  const query = 'SELECT * FROM products WHERE product_id = ?';
  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log('Product not found:', productId);
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log('Fetched Product:', results[0]);
    res.json(results[0]);
  });
});



// -----------------------------------------bill print  sale-------------------------



app.get('/shala/sale-details/:id', (req, res) => {
  const saleId = req.params.id;
  const query = `
    SELECT s.id, s.sale_id, s.customer_name, s.customer_phone, s.created_at,
           s.payment_method, s.order_discount, s.paid, s.product_details
    FROM sales s
    WHERE s.id = ?
  `;

  db.query(query, [saleId], (error, results) => {
    if (error) {
      console.error('Error fetching sale details:', error);
      return res.status(500).json({ error: 'An error occurred while fetching sale details.', details: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const sale = results[0];

    try {
      // Parse product details JSON
      const productDetails = JSON.parse(sale.product_details || '[]');
      const productIds = productDetails.map(detail => detail.product_id);

      // If no product IDs, return the sale details with empty products
      if (productIds.length === 0) {
        return res.json({
          ...sale,
          products: []
        });
      }

      // Fetch product names based on IDs
      const placeholders = productIds.map(() => '?').join(',');
      const productQuery = `
        SELECT id, name, price
        FROM products
        WHERE id IN (${placeholders})
      `;

      db.query(productQuery, productIds, (productError, productResults) => {
        if (productError) {
          console.error('Error fetching product names:', productError);
          return res.status(500).json({ error: 'An error occurred while fetching product names.', details: productError.message });
        }

        // Map product IDs to names
        const productNameMap = productResults.reduce((acc, product) => {
          acc[product.id] = { name: product.name, price: product.price };
          return acc;
        }, {});

        // Update product details with names
        const updatedProductDetails = productDetails.map(detail => ({
          ...detail,
          product_name: productNameMap[detail.product_id]?.name || 'Unknown',
          sale_price: productNameMap[detail.product_id]?.price || 'Unknown'
        }));

        res.json({
          ...sale,
          product_details: JSON.stringify(updatedProductDetails)
        });
      });
    } catch (err) {
      console.error('Error processing sale:', err);
      res.status(500).json({ error: 'An error occurred while processing sale details.', details: err.message });
    }
  });
});


// --------------------------------------------Bill print Purchase---------------------------------------





app.get('/wala/shala/purchase-details/:purchase_id', (req, res) => {
  const purchaseId = req.params.purchase_id;

  // Query to fetch the purchase details by purchase_id
  const query = `
    SELECT p.purchase_id, p.created_at, p.supplier_id, p.product_details, p.order_discount, p.paid, p.payment_method
    FROM purchases p
    WHERE p.purchase_id = ?
  `;

  db.query(query, [purchaseId], async (error, results) => {
    if (error) {
      console.error('Error fetching purchase data:', error);
      return res.status(500).json({ error: 'An error occurred while fetching purchase data.', details: error.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const purchase = results[0];
    const productDetails = JSON.parse(purchase.product_details || '[]');
    const productIds = productDetails.map(detail => detail.product_id);

    // Fetch product names based on IDs
    const productQuery = `
      SELECT id, name, price
      FROM products
      WHERE id IN (?)
    `;

    db.query(productQuery, [productIds], (productError, productResults) => {
      if (productError) {
        console.error('Error fetching product data:', productError);
        return res.status(500).json({ error: 'An error occurred while fetching product data.', details: productError.message });
      }

      const productNameMap = productResults.reduce((acc, product) => {
        acc[product.id] = { name: product.name, price: product.price };
        return acc;
      }, {});

      // Update product details with names and prices
      const updatedProductDetails = productDetails.map(detail => ({
        ...detail,
        product_name: productNameMap[detail.product_id]?.name || 'Unknown',
        product_price: productNameMap[detail.product_id]?.price || 'Unknown'
      }));

      // Fetch supplier details
      const supplierQuery = `
        SELECT s.name AS supplier_name, s.phone_number AS supplier_phone
        FROM suppliers s
        WHERE s.supplier_id = ?
      `;

      db.query(supplierQuery, [purchase.supplier_id], (supplierError, supplierResults) => {
        if (supplierError) {
          console.error('Error fetching supplier data:', supplierError);
          return res.status(500).json({ error: 'An error occurred while fetching supplier data.', details: supplierError.message });
        }

        const supplier = supplierResults[0] || {};

        // Combine all data
        const purchaseDetails = {
          ...purchase,
          product_details: updatedProductDetails,
          supplier_name: supplier.supplier_name || 'Unknown',
          supplier_phone: supplier.supplier_phone || 'Unknown'
        };

        res.json(purchaseDetails);
      });
    });
  });
});


// ---------------------------------------------summary sale code----------------------------------------



app.get('/api/summary', (req, res) => {
  const branch = 1; // Fixed branch ID as per requirement
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

  // Query to fetch summary data
  const query = `
    SELECT 
      COALESCE(
        (SELECT SUM(paid) FROM sales WHERE DATE(created_at) = ? AND branch = ?), 0
      ) AS totalSales,
      COALESCE(
        (SELECT COUNT(*) FROM sales WHERE DATE(created_at) = ? AND branch = ?), 0
      ) AS totalOrders,
      COALESCE(
        (SELECT SUM(stock) FROM products WHERE branch = ?), 0
      ) AS totalStock,
      COALESCE(
        (SELECT SUM(order_discount) FROM sales WHERE DATE(created_at) = ? AND branch = ?), 0
      ) AS totalDiscount, -- Changed this line to sum discounts
      COALESCE(
        (SELECT COUNT(*) FROM customers WHERE DATE(created_at) = ? AND branch = ?), 0
      ) AS newCustomers
  `;

  // Execute query
  db.query(query, [today, branch, today, branch, branch, today, branch, today, branch], (err, results) => {
    if (err) {
      console.error('Error fetching summary data:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Send response with summary data
    res.json(results[0]);
  });
});


// ----------------------------------------------------Pie chart-------------------------------------


// Get purchase and sales data for today for branch 1
app.get('/api/income-data', (req, res) => {
  const branch = 1;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const purchaseQuery = `SELECT SUM(paid) AS total_purchase FROM purchases WHERE branch = ? AND DATE(created_at) = ?`;
  const salesQuery = `SELECT SUM(paid) AS total_sales FROM sales WHERE branch = ? AND DATE(created_at) = ?`;

  db.query(purchaseQuery, [branch, today], (err, purchaseResults) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(salesQuery, [branch, today], (err, salesResults) => {
      if (err) return res.status(500).json({ error: err.message });

      const totalPurchase = purchaseResults[0].total_purchase || 0;
      const totalSales = salesResults[0].total_sales || 0;
      const left = totalSales - totalPurchase;

      res.json({
        spent: totalPurchase,
        left: left,
      });
    });
  });
});

// ---------------------------------------------------------------Bar Code---------------------------------------



// Route to get total revenue for the current day
app.get('/api/revenue', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Query to get online sales revenue
  db.query(`
    SELECT SUM(paid) AS total
    FROM sales
    WHERE branch = 1
    AND payment_method = 'UPI'
    AND DATE(created_at) = ?
  `, [today], (error, onlineSales) => {
    if (error) {
      console.error('Error fetching online sales:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Query to get offline sales revenue
    db.query(`
      SELECT SUM(paid) AS total
      FROM sales
      WHERE branch = 1
      AND payment_method = 'Cash'
      AND DATE(created_at) = ?
    `, [today], (error, offlineSales) => {
      if (error) {
        console.error('Error fetching offline sales:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({
        onlineSales: onlineSales[0].total || 0,
        offlineSales: offlineSales[0].total || 0
      });
    });
  });
});
