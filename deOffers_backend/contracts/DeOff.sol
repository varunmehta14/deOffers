// contracts/DeLib.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./BasicMetaTransaction.sol";
// import "./PriceConsumerV3.sol";


// contract Offers is BasicMetaTransaction {
contract DeOff is BasicMetaTransaction{
  // Chainlink Oracle
  // PriceConsumerV3 private oracle;

  // Has admin access
  address public admin;
  
  uint256 public offerCount;
//   uint256 public categoryCount;


  // ------------- Structs -----------------
  struct Offer {
    uint256 offerId;
    string brand;
    string description;
    uint256 dateAdded;
    uint256 dateExpired;
    string brandImage; // did
    string offerImage; // did of eBook
    uint256 totalStock;
    uint256 availableStock;
    // uint256 avgRating;
    uint256 offerDiscount;
    string category;
    string code;
  }
   mapping(uint256 => Offer) private offers;
    mapping(address => uint256[]) private myOffers;

//   struct User {
//     uint256 userId;
//     string name;
//     string email;
//     address account;
//     string pub;
//     uint256 dateAdded;
//     bool isMember;
//   }

//   struct Category {
//     uint256 categoryId;
//     string name;
//     string displayImage; // did
//     uint256[] data; // bookIds
//   }

//   struct Shelf {
//     uint shelfId;
//     string name;
//     uint256[] data; // fileIds
//     address owner;
  // }

  // ------------- Mappings -----------------
  // Common mappings
//   mapping(uint256 => User) private users;
//   mapping(address => uint256) private addressIndex;
//   mapping(string => uint256) private emailIndex;

//   mapping(uint256 => Category) private categories;

  // e-Library
//   mapping(uint256 => Shelf) private shelves;
//   mapping(address => uint256[]) private myShelves;

  // ------------- Events -----------------
//   event Rate(
//     uint256 indexed bookId, 
//     address indexed reviewer, 
//     uint256 indexed rating, 
//     string comment, 
//     uint256 timestamp
//   );
//   event Request(
//     string title,
//     string author,
//     address indexed requester,
//     uint256 timestamp
//   );
//   // Library
//   event Borrow(
//     uint256 indexed bookId, 
//     address indexed borrower, 
//     uint256 timestamp
//   );
//   event Return(
//     uint256 indexed bookId, 
//     address indexed borrower, 
//     uint256 timestamp
//   );
//   event Renew(
//     uint256 indexed bookId, 
//     address indexed borrower, 
//     uint256 timestamp
//   );

  event PurchaseOffer(
    uint256 indexed offerId, 
    address indexed purchaser, 
    uint256 timestamp
  );
  
  // ------------- Constructor -----------------
  constructor(address _admin) {
    admin = _admin;
  }
  // constructor(address _admin, address _oracle) {
  //   admin = _admin;
  //   oracle = PriceConsumerV3(_oracle);
  // }

  // ------------- Modifiers -----------------
  modifier onlyAdmin() {
    require(msg.sender == admin , "Not an admin!");
    _;
  }

  // // User with active membership
  // modifier onlyMember() {
  //   User memory user = users[addressIndex[msgSender()]]; 
  //   require(
  //     (user.userId > 0) && (user.isMember), "Not a member!"
  //     );
  //   _;
  // }

  // modifier onlyUser() {
  //   require(addressIndex[msgSender()] > 0, "Not a user!");
  //   _;
  // }

  // ------------- Methods -----------------
  
//   // --- User methods ---
//   function updateMembership(string memory _email, bool _isMember) public onlyAdmin {
//     require(emailIndex[_email] > 0, "No such user exists!");

//     users[emailIndex[_email]].isMember = _isMember;
//   }

//   function getUser(string memory _email) public view returns(User memory user) {
//     return users[emailIndex[_email]];
//   }

//   function getAllUsers() public view returns(User[] memory allUsers) {
//     User[] memory temp = new User[](userCount);

//     for(uint256 i=1; i<=userCount; i++) {
//       temp[i-1] = users[i];
//     }

//     return temp;
//   } 

//   function signup(string memory _name, string memory _email, string memory _pub) public {
//     if(emailIndex[_email] > 0) return;

//     userCount++;
//     emailIndex[_email] = userCount;
//     addressIndex[msgSender()] = userCount;
//     users[userCount] = User(userCount, _name, _email, msgSender(), _pub, block.timestamp, false);
//   }

  // --- Offer methods ---
  function addOffers(string memory _brand,string memory _description,uint256  _dateExpired, string memory _brandImage, string memory _offerImage,uint256 _totalStock,uint256 _offerDiscount,string memory _category,string memory _code) public onlyAdmin {
    
    offerCount++;
    offers[offerCount] = Offer(offerCount, _brand, _description, block.timestamp,block.timestamp+_dateExpired * 1 days, _brandImage,_offerImage,_totalStock, _totalStock,_offerDiscount,_category,_code);
  }

  function updateOffer(uint256 _offerId,string memory _description,uint256  _dateExpired, string memory _brandImage, string memory _offerImage,uint256 _offerDiscount) public onlyAdmin {
    
    Offer storage offer = offers[_offerId];
    
    require(offer.offerId > 0, "No such offer exists!");
    
    offer.description = _description;
    // offer.dateExpired=block.timestamp+_dateExpired * 1 days;
    offer.brandImage = _brandImage;
    offer.offerImage = _offerImage;
    // offer.availableStock += (_stock - offer.totalStock);
    // offer.totalStock = _stock;
    offer.offerDiscount=_offerDiscount;
    // offer.code=_code;

  }

  function getOffer(uint256 _offerId) public view returns(Offer memory offer) {
    return offers[_offerId];
  }

  function getAllOffers() public view returns(Offer[] memory allOffers) {
    Offer[] memory temp = new Offer[](offerCount);

    for(uint256 i=1; i<=offerCount; i++) {
      temp[i-1] = offers[i];
    }

    return temp;
  }

  function getMyOffers(address _account) public view returns(Offer[] memory allMyOffers) {
    uint256[] memory offerIds = myOffers[_account];

    Offer[] memory allOffers = new Offer[](offerIds.length);

    for(uint256 i=0; i<offerIds.length; i++) {
      allOffers[i] = offers[offerIds[i]];
    }

    return allOffers;
  }
 function purchaseOffer(uint256 _offerId, address _purchaser) public  {
    require(offers[_offerId].availableStock > 0, "Offer unavailable!");

    offers[_offerId].availableStock--;
    myOffers[_purchaser].push(_offerId);
    
    emit PurchaseOffer(_offerId, _purchaser, block.timestamp);
  }

//   function updateMyBooks(uint256[] memory _bookIds) public onlyMember {
//     myBooks[msgSender()] = _bookIds;
//   }

//   function borrowBook(uint256 _bookId, address _borrower) public onlyAdmin {
//     require(books[_bookId].availableStock > 0, "Book unavailable!");

//     books[_bookId].availableStock--;
    
//     emit Borrow(_bookId, _borrower, block.timestamp);
//   }

//   function renewBook(uint256 _bookId, address _borrower) public onlyMember {
//     emit Renew(_bookId, _borrower, block.timestamp);
//   }

//   function returnBook(uint256 _bookId, address _borrower) public onlyAdmin {
//     require(books[_bookId].bookId > 0, "No such book exists!");

//     books[_bookId].availableStock++;
    
//     emit Return(_bookId, _borrower, block.timestamp);
//   }

//   function rateBook(uint256 _bookId, uint256 _rating, string memory _comment) public onlyMember {
//     Book storage book = books[_bookId];
    
//     require(book.bookId > 0, "No such book exists!");

//     book.avgRating = (book.avgRating * book.reviewersCount + _rating) / (book.reviewersCount + 1);
//     book.reviewersCount++;

//     emit Rate(_bookId, msgSender(), _rating, _comment, block.timestamp);
//   }

//   function requestBook(string memory _title, string memory _author) public onlyMember {
//     emit Request(_title, _author, msgSender(), block.timestamp);
//   }

//   // --- Category methods ---
//   function addCategory(string memory _name, string memory _displayImage, uint256[] memory _data) public onlyAdmin {

//     categoryCount++;
//     categories[categoryCount] = Category(categoryCount, _name, _displayImage, _data);
//   } 

//   function updateCategory(uint256 _categoryId, string memory _name, string memory _displayImage, uint256[] memory _data) public onlyAdmin {
   
//     Category storage category = categories[_categoryId];

//     require(category.categoryId > 0, "No such category exists!");
    
//     category.name = _name;
//     category.displayImage = _displayImage;
//     category.data = _data;
//   }

//   function removeCategory(uint _categoryId) public onlyAdmin {
//     require(categories[_categoryId].categoryId > 0, "No such category exists!");

//     delete categories[_categoryId];
//   }

//   function getCategories() public view returns(Category[] memory allCategories) {
//     Category[] memory temp = new Category[](categoryCount);

//     for(uint256 i=1; i<=categoryCount; i++) {
//       temp[i-1] = categories[i];
//     }

//     return temp;
//   }

//   // --- Shelf methods ---
//   function addShelf(string memory _name, uint256[] memory _data) public onlyMember {
//     shelfCount++;
//     shelves[shelfCount] = Shelf(shelfCount, _name, _data, msgSender());
    
//     myShelves[msgSender()].push(shelfCount);
//   } 

//   function updateShelf(uint256 _shelfId, string memory _name, uint256[] memory _data) public onlyMember {
//     Shelf storage shelf = shelves[_shelfId];
    
//     shelf.name = _name;
//     shelf.data = _data;
//   }

//   function removeShelf(uint _shelfId) public onlyMember {
//     delete shelves[_shelfId];
//   }

//   function getMyShelves(address _account) public view returns(Shelf[] memory allMyShelves) {
//     uint256[] memory shelfIds = myShelves[_account];

//     Shelf[] memory allShelves = new Shelf[](shelfIds.length);

//     for(uint256 i=0; i<shelfIds.length; i++) {
//       allShelves[i] = shelves[shelfIds[i]];
//     }

//     return allShelves;
//   } 

//   function updateMyShelves(uint256[] memory _shelfIds) public onlyMember {
//     myShelves[msgSender()] = _shelfIds;
//   }

  // --- Chainlink oracle methods ---
  // function getMATICUSDPrice() public view returns(uint256) {
  //   uint256 price8 = uint(oracle.getLatestPriceMatic());
  //   return price8*(10**10);
  // }

  // function setOracle(address _oracle) public onlyAdmin {
  //   oracle = PriceConsumerV3(_oracle);
  // }

  // --- Addtional methods ---
  function setAdmin(address _admin) public onlyAdmin {
    admin = _admin;
  }

  // function withdrawDonations(address payable _account) public onlyAdmin {
  //   require(address(this).balance > 0, "Balance must be positive");

  //   _account.transfer(address(this).balance);
  // }
}