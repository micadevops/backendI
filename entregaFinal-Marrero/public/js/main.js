const socket = io();

const productTable = document.getElementById("product-table");

socket.on("init", (products) => {
    productTable.innerHTML = "";
    products.forEach((product) => {
        const row = createProductRow(product);
        productTable.appendChild(row);
    });
});


socket.on("productCreated", (product) => {
    const row = createProductRow(product);
    productTable.appendChild(row);
});

function createProductRow(product) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>$${product.price}</td>
    `;
    return tr;
}
