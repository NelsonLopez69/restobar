'use strict';

const models = require('../../models')
const Category = models.Category
const Product = models.Product

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const hamburguesas = await Category.findOne({ where: { name:'HAMBURGUESAS'} })
    const gaseosas = await Category.findOne({ where: { name:'GASEOSAS'} })

    await Product.bulkCreate([
      {
        name: 'Almuerzo Trucha',
        price: 15000,
        stock:  50,
        categoryId: hamburguesas.id
      },
      {
        name: 'Almuerzo Cerdo',
        price: 12000,
        stock:  70,
        categoryId: hamburguesas.id
      },
      {
        name: 'Almuerzo Res',
        price: 12000,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Almuerzo Pollo',
        price: 13000,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Almuerzo Arroz con Pollo',
        price: 12000,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Almuerzo Gallina',
        price: 15000,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Almuerzo Costilla',
        price: 15000,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Almuerzo Sobrebarriga',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Almuerzo Chuleta de Pollo',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },

      {
        name: 'Almuerzo Chuleta de Cerdo',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Cafe completo con arepa ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Cafe completo con envuelto ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Cafe completo con pandebono ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Cafe completo con pan ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Cafe completo con ojaldra ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Aguapanela completa con arepa ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Aguapanela completa con envuelto ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Aguapanela completa con pandebono ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Aguapanela completa con pan ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Aguapanela completa con ojaldra ',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Sopa',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Porción Arroz',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Porción Papa',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Porción Ensalada',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
      {
        name: 'Porción Principio',
        price: 180,
        stock:  70,
        categoryId: gaseosas.id
      },
    ])

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     
     await queryInterface.bulkDelete('Products', null, {});
  }
};
