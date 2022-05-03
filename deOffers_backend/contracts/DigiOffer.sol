// contracts/DeLib.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./BasicMetaTransaction.sol";
// import "./PriceConsumerV3.sol";


// contract Offers is BasicMetaTransaction {
contract DigiOffer is BasicMetaTransaction,ERC1155, ERC1155Holder, Ownable{
  // Chainlink Oracle
  // PriceConsumerV3 private oracle;

  // Has admin access
  address public admin;
  
  uint256 public offerCount;
//   uint256 public categoryCount;


  // ------------- Structs -----------------
  struct Offer {
    uint256 offerId;
    string tokenURI;
    address payable mintedBy;
    address payable currentOwner;
    uint256 dateAdded;
    uint256 dateExpired;
    uint256 totalStock;
    uint256 availableStock;
    uint256 offerDiscount;
    string category;
  }

    mapping(uint256 => Offer) private offers;
    mapping(address => uint256[]) private myOffers;
    mapping(string => bool) public tokenURIExists;
    mapping(uint256 => uint256) public tokensBalances;

  event PurchaseOffer(
    uint256 indexed offerId, 
    address indexed purchaser, 
    uint256 timestamp
  );
  constructor () ERC1155("https://ipfs.infura.io/ipfs/{id}.json") {}
  
   function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC1155, ERC1155Receiver)
    returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  // ------------- Constructor -----------------
//   constructor(address _admin) {
//     admin = _admin;
//   }
  // constructor(address _admin, address _oracle) {
  //   admin = _admin;
  //   oracle = PriceConsumerV3(_oracle);
  // }

  // ------------- Modifiers -----------------
  modifier onlyAdmin() {
    require(msg.sender == admin , "Not an admin!");
    _;
  }


//   function addOffers(string memory _brand,string memory _description,uint256  _dateExpired, string memory _brandImage, string memory _offerImage,uint256 _totalStock,uint256 _offerDiscount,string memory _category,string memory _code) public onlyAdmin {
    
//     offerCount++;
//     offers[offerCount] = Offer(offerCount, _brand, _description, block.timestamp,block.timestamp+_dateExpired * 1 days, _brandImage,_offerImage,_totalStock, _totalStock,_offerDiscount,_category,_code);
//   }

  function updateOffer(uint256 _offerId,
//   uint256  _dateExpired, 
//   string memory _brandImage, 
//   string memory _offerImage,
  uint256 _offerDiscount
  ) public onlyAdmin {
    
    Offer storage offer = offers[_offerId];
    
    require(offer.offerId > 0, "No such offer exists!");
    
    // offer.description = _description;
    // offer.dateExpired=block.timestamp+_dateExpired * 1 days;
    // offer.brandImage = _brandImage;
    // offer.offerImage = _offerImage;
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
    offers[_offerId].currentOwner = payable(msg.sender);
    _safeTransferFrom(offers[_offerId].currentOwner, msg.sender, _offerId, 1, "");
    emit PurchaseOffer(_offerId, _purchaser, block.timestamp);
  }

  // Can mint multiple tokens (even with the same id).
  function mintMultipleOffers(string memory _uriHash,uint256  _dateExpired,uint256 _totalStock,uint256 _offerDiscount,string memory _category) external {
    // check if this function caller is not an zero address account
    require(msg.sender != address(0));
    require(_totalStock > 0, "Amount should be greater then 0");
    
    uint256[] memory  ids = new uint256[](_totalStock);
    uint256[] memory amounts = new uint256[](_totalStock);
    uint256 tempId = offerCount+1;
    offerCount += _totalStock;
    for(uint256 i = 0; i < _totalStock; i++) {    
      ids[i] = tempId;
      amounts[i] = 1;
      tokensBalances[tempId]++;
      Offer memory newOffer= Offer(
          tempId,
          _uriHash, 
          payable(msg.sender),
          payable(msg.sender),
          block.timestamp,
          block.timestamp+_dateExpired * 1 days, 
          _totalStock, 
          _totalStock,
          _offerDiscount,
          _category
        ); 
  
      // add the token id and it's design to all designs mapping
      offers[tempId] = newOffer; 
      tempId++; 
    } 
    // make passed token URI as exists
    tokenURIExists[_uriHash] = true;


    _mintBatch(msg.sender, ids, amounts, "");
  }


  // --- Chainlink oracle methods ---
  // function getMATICUSDPrice() public view returns(uint256) {
  //   uint256 price8 = uint(oracle.getLatestPriceMatic());
  //   return price8*(10**10);
  // }

  // function setOracle(address _oracle) public onlyAdmin {
  //   oracle = PriceConsumerV3(_oracle);
  // }

  // --- Addtional methods ---
  function setAdmin(address _admin) public{
    admin = _admin;
  }

  // function withdrawDonations(address payable _account) public onlyAdmin {
  //   require(address(this).balance > 0, "Balance must be positive");

  //   _account.transfer(address(this).balance);
  // }
}