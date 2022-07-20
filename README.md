# Health Care API

Health Care is meant to be a system able to manage all hospital activities and staff managment. This repo only contains the back-end side for this system. See also [Health Care](https://github.com/diegosalasmartinez/health_care) to get access to the front-end project.

## Basic Usage

You can visit the project on [Health Care](https://diegosalas-healthcare.web.app). You can use the following credentials to access as the administrator of the system: 

```bash
username: admin
password: adminadmin
```

## Instalation

1. Clone the project to your computer.

2. Install all the dependencies of the project

``` bash
npm install
```

3. Create a [MongoDB](https://account.mongodb.com/) for the application. Select a name for the project and it will deploy a cluster automatically.

4. Create a database user in `Database Access`. Copy the username and password

5. Allow your current IP Address to access to the database in `Network Access`. Select the IP Adress 0.0.0.0/0

6. Select your cluster and select connect in `Databases`. Click on `Connect your application` and copy the connection url.

7. Create a `.env` file with the following content:

```bash
DB_USER =  user you created
DB_PASSWORD = password you created
CONNECTION_URL = connection url you copied. Do not forget to change <password> with your the password you created
JWT_SECRET = JWT Secret the app will use to manage authentication and authorization
JWT_LIFETIME = JWT Lifetime the app will use. e.g. 30d
```

8. Start the project

``` bash
npm start
```

9. Navigate to [http://localhost:5000](http://localhost:5000). The app will automatically reload if you change any of the source files.

10. As user routes are protected, you might need to manually insert your admin user in your MongoDB. Remember passwords are encrypted with bcryptjs.

## App Info

### Author

[Diego Salas](https://www.linkedin.com/in/diego-alejandro-salas-martinez/)

### Version

1.0.0

### License

This project is licensed under the MIT License.
