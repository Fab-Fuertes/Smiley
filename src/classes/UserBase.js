export default class UserBase {
  constructor(name, email, password, userType) {
    this._name = name;
    this._email = email;
    this._password = password;
    this.userType = userType; // Tipo de usuario
  }

  // Método común para todos los usuarios
  displayInfo() {
    console.log(`User: ${this.name}, Email: ${this.email}`);
  }

  // GETTERS and SETTERS

  getName() {
    return this._name;
  }

  setName(newName) {
    this._name = newName;
  }

  getEmail() {
    return this._email;
  }

  setEmail(newEmail) {
    this._email = newEmail;
  }

  setPassword(newPassword) {
    this._password = newPassword;
  }
}