<h1>BAMAZON README</h1>

--------------------------------------------------------------------------------------------

This application use MySQL to simulate an online selling store. There are 3 different options, CUSTOMER, MANAGER and SUPERVISOR. I use the
npm of MySQL, Inquirer and Console Table to make the results shown below. The CUSTOMER and MANAGER applications are done with the same table
but the Supervisor does it with the combination of two tables, the products table and the department table. The use of INNER JOIN is
necesarry to create a combination of tables of both.

See a video explanation https://drive.google.com/file/d/1iFf4ucIpXTMz6cGwm8rJDUXHBKGBahEQ/view


<h2>Customer</h2>
In the Customer part you are able to select two option:
1. See what items are available for purchasing. Each of the items is arrange by ID, product name and the price.
2. Make an order. IF you make an order and the order is bigger than the stock quantity it doesn't allow you to place the order.
If the order is below stock quantity then it allows you to create the order. When it process the order the inventory is deplinish in the
table of MYSQL.

<h2>Manager</h2>
The Manager has 4 options:
1. View products for Sale - Here you can see the items id, product name, the price and the stock quantity.
2. View Low Inventory - Thru a query you are able to see all the items that have an inventory of 5 or less.
3. Add to Inventory - It allows you to add stock to the the stock quantity.
4. Add New Product - It let's you add new product to the table.

<h2>Supervisor</h2>
The supervisor has 2 options:
1. View Product Sales by Department - Each time a customer makes an order the purchase get's added to the department sales and it allows
you yo see how much you have sale per department. The department also has an over_head cost so it allows you to calculate the profit
between sales and the overhead costs.
2. Add Department - It allows you to add a new department to the table. 
