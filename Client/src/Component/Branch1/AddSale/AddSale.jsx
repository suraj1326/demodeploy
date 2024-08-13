import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddSale.css';
import { useNavigate } from 'react-router-dom';

const createNewSaleItem = () => ({
  productId: '',
  productDetails: { price: '', stock: '' },
  salePrice: '',
  quantity: '',
  itemTotal: 0,
});

const AddSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [saleItems, setSaleItems] = useState([createNewSaleItem()]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/shala/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  useEffect(() => {
    calculateTotals(saleItems);
  }, [orderDiscount, saleItems]);

  const handleProductChange = async (index, event) => {
    const id = event.target.value;
    const newSaleItems = [...saleItems];
    newSaleItems[index].productId = id;
    try {
      const response = await axios.get(`http://localhost:3000/shala/products/${id}`);
      const { price, stock } = response.data;
      if (stock === 0) {
        alert('Stock is not available. Select another product.');
        newSaleItems[index].productId = '';
        newSaleItems[index].productDetails = { price: '', stock: '' };
        setSaleItems(newSaleItems);
        return;
      }
      newSaleItems[index].productDetails = { price, stock };
      newSaleItems[index].salePrice = '';
      newSaleItems[index].quantity = '';
      newSaleItems[index].itemTotal = 0;
      setSaleItems(newSaleItems);
      calculateTotals(newSaleItems);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleSaleItemChange = (index, field, value) => {
    const newSaleItems = [...saleItems];
    newSaleItems[index][field] = value;

    if (field === 'quantity') {
      const stock = parseFloat(newSaleItems[index].productDetails.stock) || 0;
      const quantity = parseFloat(value) || 0;
      if (quantity > stock) {
        alert('Quantity exceeds available stock. Please adjust.');
        newSaleItems[index].quantity = '';
        newSaleItems[index].itemTotal = 0;
      } else {
        calculateItemTotal(index, newSaleItems);
      }
    } else {
      calculateItemTotal(index, newSaleItems);
    }
    setSaleItems(newSaleItems);
  };

  const calculateItemTotal = (index, saleItems) => {
    const price = parseFloat(saleItems[index].salePrice) || 0;
    const quantity = parseFloat(saleItems[index].quantity) || 0;
    saleItems[index].itemTotal = price * quantity;
    calculateTotals(saleItems);
  };

  const calculateTotals = (saleItems) => {
    const total = saleItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const discountAmount = total * (orderDiscount / 100);
    const totalAfterDiscount = total - discountAmount;
    setOrderTotal(total);
    setTotalAfterDiscount(totalAfterDiscount);
  };

  const handleAddProduct = () => {
    setSaleItems([...saleItems, createNewSaleItem()]);
  };

  const handleRemoveProduct = (index) => {
    const newSaleItems = saleItems.filter((_, i) => i !== index);
    setSaleItems(newSaleItems);
    calculateTotals(newSaleItems);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const salesData = saleItems.map(item => ({
        product_id: item.productId,
        sale_price: item.salePrice,
        quantity: item.quantity,
    }));

    axios.post('http://localhost:3000/shala/sales', {
        customer_name: customerName,
        customer_phone: customerPhone,
        sales_data: salesData,
        payment_method: paymentMethod,
        order_discount: orderDiscount,
        paid
    })
    .then(response => {
        alert(response.data.message);
        navigate('/Component/Branch1/SaleList/SaleList'); // Navigate to the Sale List page
        window.location.reload(); // Reset the page
    })
    .catch(error => {
        console.error('Error submitting sale:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="add-sale-form">
      <h2>Sale Order</h2>
      <div className="customer-info">
        <div className="input-group">
          <label>Customer Name:</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Customer Phone Number:</label>
          <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
        </div>
      </div>
      <button type="button" className="new-row-btn" onClick={handleAddProduct}>+ New Row</button>
      <table className="sale-items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Product MRP</th>
            <th>Sale Price</th>
            <th>Quantity</th>
            <th>Stock</th>
            <th>Item Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {saleItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <select value={item.productId} onChange={(e) => handleProductChange(index, e)} required>
                  <option value="">Select</option>
                  {Array.isArray(products) && products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <input type="text" value={item.productDetails.price} readOnly />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.salePrice} 
                  onChange={(e) => handleSaleItemChange(index, 'salePrice', e.target.value)} 
                  required 
                />
              </td>
              <td>
                <input 
                  type="number" 
                  value={item.quantity} 
                  onChange={(e) => handleSaleItemChange(index, 'quantity', e.target.value)} 
                  required 
                />
              </td>
              <td>
                <input  type="text" value={item.productDetails.stock} readOnly />
              </td>
              <td  id='item'>{item.itemTotal.toFixed(2)}</td>
              <td>
                <button type="button" onClick={() => handleRemoveProduct(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="summary-info">
        <div className="input-group" >
          <label >Payment Method:</label>
          <select id='payment' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
        <div className="input-group">
          <label>Order Total:</label>
          <input type="number" value={orderTotal.toFixed(2)} readOnly />
        </div>
        <div className="input-group">
          <label>Discount (%):</label>
          <input type="number" value={orderDiscount} onChange={(e) => setOrderDiscount(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="input-group">
          <label>Total After Discount:</label>
          <input type="number" value={totalAfterDiscount.toFixed(2)} readOnly />
        </div>
        <div className="input-group">
          <label>Paid Amount:</label>
          <input type="number" value={paid} onChange={(e) => setPaid(parseFloat(e.target.value) || 0)} required />
        </div>
      </div>
      <button type="submit" id="addsale-save-btn">Save</button>
    </form>
  );
};

export default AddSale;
