pragma solidity ^0.4.0;

contract DecentScience {

    address public owner;
    address private customer;
    string sensorId;
    uint price;
    event NotSufficientPayment(string error);
    event ReceivedFunds(string message);

    function DecentScience() {
        owner = msg.sender;
    }

    function setId(string id) {
        if (owner != msg.sender) {
            revert();
        } else {
            sensorId = id;
        }
    }

    function setPrice(uint defaultPrice) {
        if (owner != msg.sender) {
            revert();
        } else {
            price = defaultPrice;
        }
    }

    function getPrice() public constant returns (uint definedPrice) {
        return price;
    }

    function getData() public constant returns (string dataLocation) {
        if (this.balance >= price && customer == msg.sender) {
            owner.call.gas(200000).value(this.balance)();
            return sensorId;
        } else {
            NotSufficientPayment("Payment not sufficient");
        }
    }

    function receiveFunds() public payable {
        ReceivedFunds("Received Funds");
        customer = msg.sender;
    }


}