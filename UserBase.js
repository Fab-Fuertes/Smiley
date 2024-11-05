class UserBase {
  constructor(name, email, password, userType) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.userType = userType; // Tipo de usuario
  }

  // Método común para todos los usuarios
  displayInfo() {
    console.log(`User: ${this.name}, Email: ${this.email}`);
  }
}