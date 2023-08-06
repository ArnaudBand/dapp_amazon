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

  constructor() {
    owner = msg.sender;
  }

  mapping(uint256 => Product) public products;

  // List products
  function listProduct(uint256 _id, string memory _name, string memory _category, string memory _image, uint _price, uint256 _rating, uint256 _quantity) public {
    require(msg.sender == owner, "Only owner can list products");
    // Add product to products array
    Product memory product = Product(_id, _name, _category, _image, _price, _rating, _quantity);

    // Add product to mapping
    products[_id] = product;
  }
}
