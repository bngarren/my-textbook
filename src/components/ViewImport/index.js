import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./pdfViewer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ViewImportPage = () => (
  <>
    <ViewImport />
  </>
);

const ViewImport = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [innerText, setInnerText] = useState("");

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    setPageNumber(1);
    console.log(pdf);
  };

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(
      ".react-pdf__Page__textContent"
    );
    textLayers.forEach((layer) => {
      const { style } = layer;
      style.top = "0";
      style.left = "0";
      style.transform = "";
      style.lineHeight = "1";
      console.debug(layer);
    });
  }

  const getInnerText = () => {
    const textLayers = document.querySelectorAll(
      ".react-pdf__Page__textContent"
    );
    textLayers.forEach((layer) => {
      setInnerText(layer.innerHTML.innerText);
      console.log(layer.innerHTML.innerText);
    });
  };

  return (
    <div>
      <div className="upload">
        <label htmlFor="file">Load from file:</label>{" "}
        <input onChange={onFileChange} type="file" />
      </div>
      <Document file={file} onLoadSuccess={onLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          onLoadSuccess={removeTextLayerOffset}
          renderMode="svg"
        />
      </Document>
    </div>
  );
};

export default ViewImportPage;
