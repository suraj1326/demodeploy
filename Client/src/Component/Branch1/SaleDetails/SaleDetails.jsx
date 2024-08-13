import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SaleDetails.css';

const SaleDetails = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaleDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/shala/sale-details/${id}`);
        console.log('API Response:', response.data);
        const saleData = response.data;

        if (typeof saleData.product_details === 'string') {
          saleData.products = JSON.parse(saleData.product_details);
        } else {
          saleData.products = saleData.product_details;
        }

        setSale(saleData);
      } catch (error) {
        console.error('Error fetching sale details:', error);
        setError('Unable to fetch sale details. Please try again later.');
      }
    };

    if (id) {
      fetchSaleDetails();
    }
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!sale) {
    return <div>Loading...</div>;
  }

  const finalTotal = sale.products.reduce((total, product) => {
    const productTotal = product.sale_price * product.quantity;
    return total + productTotal;
  }, 0);

  return (
    <div className="sale-details-container">
      <h2 className="invoice-header">New Eye Care</h2>
      <p className="contact-info">GSTIN: -</p>
      <p className="contact-info">9922177297</p>

      <div className="customer-details">
        <div>Name: {sale.customer_name}</div>
        <div>Mobile No.: {sale.customer_phone}</div>
        <div>Receipt No: {sale.receipt_no}</div>
        <div>Receipt Date: {new Date(sale.created_at).toLocaleDateString('en-GB')}</div>
        <div>Delivery Date: {new Date(sale.delivery_date).toLocaleDateString('en-GB')}</div>
        <div>Time: {new Date(sale.created_at).toLocaleTimeString('en-GB')}</div>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Sn.</th>
            <th>Particulars</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Dis.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sale.products.map((product, index) => {
            const productTotal = product.sale_price * product.quantity;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.product_name}</td>
                <td>{product.quantity}</td>
                <td>{product.sale_price.toFixed(2)}</td>
                <td>{product.discount?.toFixed(2) || "0.00"}</td>
                <td>{productTotal.toFixed(2)}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan="5" className="total-label">Total Amt:</td>
            <td className="final-total">{finalTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="payment-details">
        <div>Payment Mode: {sale.payment_method} - {sale.paid}</div>
        <div>Booked By: {sale.booked_by || "NA"}</div>
        <div>Referred By: {sale.referred_by || ""}</div>
        <div>Total Amt.: {finalTotal.toFixed(2)}</div>
        <div>Paid Amt.: {sale.paid}</div>
        <div>Balance: {sale.balance}</div>
      </div>

      <div className="eye-prescription">
        <div className="eye-prescription-row">
          <div className="eye-prescription-section">
            <strong>RIGHT EYE</strong>
            <table>
              <tbody>
                <tr>
                  <td>SPH</td><td>{sale.right_eye_sph}</td>
                  <td>CYL</td><td>{sale.right_eye_cyl}</td>
                  <td>AXIS</td><td>{sale.right_eye_axis}</td>
                  <td>V/N</td><td>{sale.right_eye_vn}</td>
                </tr>
                <tr>
                  <td>DV</td><td>{sale.right_eye_dv}</td>
                  <td>NV</td><td>{sale.right_eye_nv}</td>
                  <td>ADD</td><td>{sale.right_eye_add}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="eye-prescription-section">
            <strong>LEFT EYE</strong>
            <table>
              <tbody>
                <tr>
                  <td>SPH</td><td>{sale.left_eye_sph}</td>
                  <td>CYL</td><td>{sale.left_eye_cyl}</td>
                  <td>AXIS</td><td>{sale.left_eye_axis}</td>
                  <td>V/N</td><td>{sale.left_eye_vn}</td>
                </tr>
                <tr>
                  <td>DV</td><td>{sale.left_eye_dv}</td>
                  <td>NV</td><td>{sale.left_eye_nv}</td>
                  <td>ADD</td><td>{sale.left_eye_add}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <p className="thank-you">Thank you for your purchase</p>
      <p className="contact-info">Technopuls Softwares | Contact: +918669048580</p>
    </div>
  );
};

export default SaleDetails;
