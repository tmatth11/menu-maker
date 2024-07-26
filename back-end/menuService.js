const dbClient = require('./client');

const getMenuItems = (request, response) => {
    console.log('Fetching menu items...');
    const query = 'SELECT * FROM menu ORDER BY dish_id'; 

    dbClient.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching menu items:', error);
            response.status(500).send('Internal Server Error');
            return;
        }

        console.log('Query results:', results);

        if (results.rows.length === 0) {
            console.log('There are no menu items.');
            response.status(204).send();
        } else {
            const menuItems = results.rows.map(row => ({
                id: row.dish_id,
                name: row.dish_name,
                price: row.dish_price,
                description: row.dish_description
            }));
            console.log('Menu items:', menuItems);
            response.status(200).json(menuItems);
        }
    });
};

const createMenuItem = (request, response) => {
    console.log('Creating menu item...');
    const { name, price, description } = request.body;
    const query = 'INSERT INTO menu (dish_name, dish_price, dish_description) VALUES ($1, $2, $3) RETURNING dish_name';
    const values = [name, price, description];

    dbClient.query(query, values, (error, results) => {
        if (error) {
            console.error('Error creating menu item:', error);
            response.status(500).send('Internal Server Error');
            return;
        }
        console.log("Menu item created successfully");
        response.status(201).json({ message: 'Menu item created successfully', name: results.rows[0].dish_name });
    });
};

const updateMenuItem = (request, response) => {
    console.log('Updating menu item...');
    const { id, name, price, description } = request.body;
    const query = 'UPDATE menu SET dish_name = $1, dish_price = $2, dish_description = $3 WHERE dish_id = $4 RETURNING dish_name';
    const values = [name, price, description, id];

    dbClient.query(query, values, (error, results) => {
        if (error) {
            console.error('Error updating menu item:', error);
            response.status(500).send('Internal Server Error');
            return;
        }

        if (results.rowCount === 0) {
            console.log('Menu item not found');
            response.status(404).json({ message: 'Menu item not found' });
        } else {
            console.log('Menu item updated successfully');
            response.status(200).json({ message: 'Menu item updated successfully', name: results.rows[0].dish_name });
        }
    });
};

const deleteMenuItem = (request, response) => {
    console.log('Deleting menu item...');
    const { id } = request.body;

    const getNameQuery = 'SELECT dish_name FROM menu WHERE dish_id = $1';
    const deleteQuery = 'DELETE FROM menu WHERE dish_id = $1';
    const values = [id];

    dbClient.query(getNameQuery, values, (error, results) => {
        if (error) {
            console.error('Error fetching menu item name:', error);
            response.status(500).send('Internal Server Error');
            return;
        }

        if (results.rowCount === 0) {
            console.log('Menu item not found');
            response.status(404).json({ message: 'Menu item not found' });
        } else {
            const dishName = results.rows[0].dish_name;

            dbClient.query(deleteQuery, values, (error, results) => {
                if (error) {
                    console.error('Error deleting menu item:', error);
                    response.status(500).send('Internal Server Error');
                    return;
                }

                console.log('Menu item deleted successfully');
                response.status(200).json({ message: 'Menu item deleted successfully', name: dishName });
            });
        }
    });
};

module.exports = { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };