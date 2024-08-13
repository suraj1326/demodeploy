import React, { useEffect, useState } from "react";
import Quagga from "quagga";
import axios from "axios";
import './BarcodeScanner.css';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(7);
  
  useEffect(() => {
    const initQuagga = () => {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: document.querySelector("#scanner-container"),
            constraints: {
              width: 500,
              height: 300,
              facingMode: "environment",
            },
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader",
              "2of5_reader",
              "code_93_reader",
            ],
          },
        },
        (err) => {
          if (err) {
            console.error(err);
            setError("Error starting the camera.");
            return;
          }
          Quagga.start();
        }
      );
    };

    const scannerContainer = document.querySelector("#scanner-container");
    if (scannerContainer) {
      initQuagga();
    } else {
      setError("Scanner container not found.");
    }

    Quagga.onDetected(handleBarcodeScan);

    return () => {
      Quagga.stop();
      Quagga.offDetected(handleBarcodeScan);
    };
  }, []);

  const handleBarcodeScan = (result) => {
    const scannedBarcode = result.codeResult.code;
    console.log("Scanned Barcode:", scannedBarcode);
    setBarcode(scannedBarcode);
    fetchProductData(scannedBarcode);
  };

  const fetchProductData = async (scannedBarcode) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/doll/products/${scannedBarcode}`
      );
      const newProduct = response.data;
      console.log('Fetched Product Data:', newProduct);

      setProducts((prevProducts) => {
        const existingProductIndex = prevProducts.findIndex(product => product.product_id === newProduct.product_id);

        if (existingProductIndex === -1) {
          return [...prevProducts, newProduct];
        } else {
          return prevProducts.map((product, index) =>
            index === existingProductIndex ? newProduct : product
          );
        }
      });

      setError("");
    } catch (err) {
      console.error("API Error:", err.response ? err.response.data : err.message);
      setError("Product not found.");
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="scanner-wrapper">
      <h1 className="ding">Barcode Scanner</h1>
      <div id="scanner-container" className="scanner-container" />
      <p id="ph1">Scanned Barcode: {barcode}</p>
      {error && <p className="error-message">{error}</p>}
      {currentProducts.length > 0 ? (
        <div>
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Product ID</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.product_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="footer-container">
            <div className="pagination">
              <ul>
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                </li>
                {pageNumbers.map(number => (
                  <li key={number}>
                    <button
                      onClick={() => paginate(number)}
                      className={currentPage === number ? 'active' : ''}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === pageNumbers.length}
                  >
                    &gt;
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        // The message has been removed
        null
      )}
    </div>
  );
};

export default BarcodeScanner;
