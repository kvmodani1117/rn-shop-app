import moment from 'moment';

class Order {
    // constructor(id, items, totalAmount, date, username, mobile, address, email) {
    constructor(id, items, totalAmount, date, orderStatus) {
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.date = date;
        this.orderStatus = orderStatus;
        // this.username = username;   //Modified
        // this.mobile = mobile;
        // this.address = address;
        // this.email = email;
    }

    get readableDate() {
        // return moment(this.date).format('MMMM Do YYYY, hh:mm');
        // return moment(this.date).format('MMMM Do YYYY, h:mm:ss a');
        return moment(this.date).format('llll');
    }

}


export default Order;