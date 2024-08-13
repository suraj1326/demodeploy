import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './PurchaseDetails.css'; // Assuming you have CSS for styling

const PurchaseDetails = () => {
  const { id } = useParams(); // Use the ID parameter from the route
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      try {
        // Fetch purchase details based on purchase_id
        const response = await axios.get(`http://localhost:3000/wala/shala/purchase-details/${id}`);
        console.log('API Response:', response.data); // Log response for debugging
        
        const purchaseData = response.data;

        // Check if product_details is a string, and parse it if necessary
        if (typeof purchaseData.product_details === 'string') {
          purchaseData.products = JSON.parse(purchaseData.product_details);
        } else {
          purchaseData.products = purchaseData.product_details;
        }

        setPurchase(purchaseData);
      } catch (error) {
        console.error('Error fetching purchase details:', error);
      }
    };

    if (id) { // Ensure ID is valid before making API request
      fetchPurchaseDetails();
    }
  }, [id]); // Fetch data whenever `id` changes

  if (!purchase) {
    return <div>Loading...</div>;
  }

  // Calculate the total for each product and the final total
  const finalTotal = purchase.products.reduce((total, product) => {
    const productTotal = product.product_price * product.quantity;
    return total + productTotal;
  }, 0);

  return (
    <div className="sale-details-container">
      <button onClick={() => window.print()} className="print-bill-button">
        Print Bill
      </button>
      <h2 id='scc'>New Eye Care</h2>
      <h6 className='ho'>Optics & Contact Lense Clinic</h6>
      <p className='add'>Add: S.No. 34/2 Gurudware Chowk, Balaji Nagar, 
        <br/>Near Akurdi Railway Station, Pune-411033</p>
      <p className='em'>8669309353 Email: neweyecare1@gmail.com</p>
      <hr/>
      
      <div className="customer-info">
        <div>
          <strong>Supplier Name:</strong> {purchase.supplier_name}
        </div>
        <div>
          <strong>Supplier Phone Number:</strong> {purchase.supplier_phone}
        </div>
        <div>
          <strong>Purchase Date:</strong> {new Date(purchase.created_at).toLocaleDateString('en-GB')}
        </div>
      </div>
          
      <div className="products-section">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {purchase.products.map((product, index) => (
              <tr key={index}>
                <td>{product.product_name}</td>
                <td>{product.product_price}</td>
                <td>{product.quantity}</td>
                <td>{(product.product_price * product.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" className="total-label">Final Total:</td>
              <td className="final-total">{finalTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sale-summary-row">
        <div>
          <strong>Discount %:</strong> {purchase.order_discount}
        </div>
        <div>
          <strong>Payment Mode:</strong> {purchase.payment_method}
        </div>
        <div>
          <strong>Amount Paid:</strong> {purchase.paid}
        </div>
      </div>
      <hr/>
      <p className='th'>Thank you for your purchase</p>
      <p className='te'>Technopuls Softwares | Contact: +918669048580</p>
    </div>
  );
};

export default PurchaseDetails;
