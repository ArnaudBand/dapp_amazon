// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract AmazonDapp {
  address public owner;

  struct Product {
    uint256 id;
    string name;
    string category;
    string image;
    uint price;
    uint256 rating;
    uint256 quantity;
  }

  struct Order {
    uint256 time;
    Product product;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can list products");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  mapping(uint256 => Product) public products;
  mapping(address => mapping(uint256 => Order)) public orders;
  mapping(address => uint256) public orderCount;

  event ProductListed(string name, uint256 price, uint256 quantity);

  // List products
  function listProduct(uint256 _id, string memory _name, string memory _category, string memory _image, uint _price, uint256 _rating, uint256 _quantity) public onlyOwner {
    // Add product to products array
    Product memory product = Product(_id, _name, _category, _image, _price, _rating, _quantity);

    // Add product to mapping
    products[_id] = product;

    // Trigger event
    emit ProductListed(_name, _price, _quantity);
  }

  // Purchase products
  function purchaseProduct(uint256 _id) public payable {

    // Fetch product from mapping
    Product memory product = products[_id];

    // Get product from mapping
    Order memory order = Order(block.timestamp, product);

    // Add order to orders mapping
    orderCount[msg.sender]++;  // Increment order count
    orders[msg.sender][orderCount[msg.sender]] = order;

    // Reduce quantity of product
    products[_id].quantity = product.quantity - 1;
  }
}
