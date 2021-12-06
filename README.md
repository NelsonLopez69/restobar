# Restobar

_Restaurant Management App made with NodeJS, Express, MySQL, ReactJS y Redux._

_App para la Administración de Restaurante desarrollada con NodeJS, Express, MySQL, ReactJS y Redux._

### Demo :computer:

La demo puede tener problemas con la velocidad al obtener datos debido a que utiliza una base de datos remota de manera gratuita.

https://restobar-example.herokuapp.com/login

### Instalación 🔧

_1- Clonar el proyecto._

```
git clone https://github.com/matias-rivera/shop.git
```

_2- Instalar las dependencias en la carpeta raíz._

```
cd shop
npm install
```

_3- Instalar las dependencias en la carpeta frontend._

```
cd frontend
npm install
```

_4- Renombrar ".env.example" a ".env", asignar valor a cada variable._


_5- Ejecuta los siguientes comandos para iniciar las migraciones y los seeders. Recordar ubicarse en la carpeta backend._

```
cd backend
npx sequelize-cli db:migrate // ejecuta migraciones
npx sequelize-cli db:seed:all // ejecuta seeders
```

_6- Ejecuta los siguientes comandos para inciar el servidor y el cliente. Hacerlo desde la carpeta raíz._

```
npm run server // inicia el servidor
npm run client // inicia el cliente
npm run dev // inicia ambos
```

### Preview :mag:
![dashboard](https://www.matiasrivera.com/img/restobar.png)
![in_place_orders](https://i.ibb.co/HhmMpwP/inplace.png)
![compra](https://i.ibb.co/0mSLtW4/COMPRA.png)
![order-view](https://i.ibb.co/8sWPrVM/EDIT-ORDER.png)
![orders](https://i.ibb.co/XkCXXct/ORDENES.png)
![users](https://i.ibb.co/cDWsgw7/USERS.png)
![profile](https://i.ibb.co/CBPjKFg/profile.png)
