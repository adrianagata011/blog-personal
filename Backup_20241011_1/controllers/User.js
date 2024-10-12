class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    // Método para verificar si la contraseña es correcta
    verifyPassword(password) {
        return this.password === password;
    }

    // Método para generar un objeto que se pueda guardar en la base de datos JSON
    toJSON() {
        return {
            username: this.username,
            password: this.password
        };
    }
}

module.exports = User;
