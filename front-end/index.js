#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import figlet from 'figlet';
import fetch from 'node-fetch';

const getAllMenuItems = async () => {
    console.clear();
    const response = await fetch(`http://localhost:8080/menu`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
    });

    const status = response.status;
    const data = await response.json();

    if (status === 200) {
        console.log('Menu items:\n');
        data.forEach((dish) => {
            console.log(`Dish ID: ${dish.id}\nDish Name: ${dish.name}\nDish Price: ${dish.price}\nDish Description: ${dish.description}\n`);
        });
    }
    else if (status === 204) {
        console.log(chalk.blue('There are no menu items.'));
    }
    else {
        console.log(chalk.red(`Error: ${data.message}`));
    }
};

const createMenuItem = async () => {
    const askName = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Choose a name for the new menu item.',
        default() {
            return 'Cheeseburger';
        },
    });

    const askPrice = await inquirer.prompt({
        name: 'price',
        type: 'input',
        message: 'Choose a price for the new menu item.',
        default() {
            return '9.99';
        },
    });

    const askDescription = await inquirer.prompt({
        name: 'description',
        type: 'input',
        message: 'Choose a description for the new menu item.',
        default() {
            return 'A classic cheeseburger.';
        },
    });

    const response = await fetch(`http://localhost:8080/menu`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: askName.name,
            price: askPrice.price,
            description: askDescription.description,
        }),
    });

    const status = response.status;
    const data = await response.json();

    if (status === 201) {
        console.log(chalk.green(`\nMenu item created: ${data.name}\n`));
    }
    else {
        console.log(chalk.red(`Error: ${data.message}`));
    }
};

const updateMenuItem = async () => {
    const askID = await inquirer.prompt({
        name: 'id',
        type: 'input',
        message: 'Enter the ID of the menu item you want to update.',
        default() {
            return '1';
        }
    });

    const askName = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Choose a new name for the menu item.',
        default() {
            return 'Fresh Froiz';
        }
    });

    const askPrice = await inquirer.prompt({
        name: 'price',
        type: 'input',
        message: 'Choose a new price for the menu item.',
        default() {
            return '3.25';
        }
    });

    const askDescription = await inquirer.prompt({
        name: 'description',
        type: 'input',
        message: 'Choose a new description for the menu item.',
        default() {
            return 'Shoutout to the Belgians.';
        }
    });

    const response = await fetch(`http://localhost:8080/menu`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: askID.id,
            name: askName.name,
            price: askPrice.price,
            description: askDescription.description,
        }),
    });

    const status = response.status;
    const data = await response.json();

    if (status === 200) {
        console.log(chalk.green(`\nMenu item updated: ${data.name}\n`));
    } else if (status === 404) {
        console.log(chalk.red(`\nError: ${data.message}\n`));
    } else {
        console.log(chalk.red(`Error: ${data.message}`));
    }
};

const deleteMenuItem = async () => {
    const askID = await inquirer.prompt({
        name: 'id',
        type: 'input',
        message: 'Enter the ID of the menu item you want to delete.',
        default() {
            return '1';
        }
    });

    const response = await fetch(`http://localhost:8080/menu`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: askID.id,
        }),
    });

    const status = response.status;
    const data = await response.json();

    if (status === 200) {
        console.log(chalk.green(`\nMenu item deleted: ${data.name}\n`));
    } else {
        console.log(chalk.red(`\nError: ${data.message}\n`));
    }
};

const main = async () => {
    const welcome = "Menu Maker";

    const figletPromise = new Promise((resolve, reject) => {
        figlet(welcome, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(gradient('orange', 'red', 'green').multiline(data));
                resolve();
            }
        });
    });

    await figletPromise;

    while (true) {
        const askQuestion = await inquirer.prompt({
            name: 'answer',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Get all menu items',
                'Create a new menu item',
                'Update a menu item',
                'Delete a menu item',
                'Exit',
            ],
            default() {
                return 'Get all menu items';
            },
        });

        console.log();

        if (askQuestion.answer === 'Get all menu items') {
            await getAllMenuItems();
        }
        else if (askQuestion.answer === 'Create a new menu item') {
            await createMenuItem();
        }
        else if (askQuestion.answer === 'Update a menu item') {
            await updateMenuItem();
        }
        else if (askQuestion.answer === 'Delete a menu item') {
            await deleteMenuItem();
        }
        else if (askQuestion.answer === 'Exit') {
            console.log(chalk.blue('Goodbye!'));
            break;
        }
    }

};

await main();