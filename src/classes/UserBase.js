export default class UserBase {
  constructor(name, last_name, email, phone, userType) {
    this._name = name;
    this._last_name = last_name;
    this._email = email;
    this._phone = phone;
    this._userType = userType; // Tipo de usuario
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

  getLastName() {
    return this._last_name;
  }

  setLastName(newLastName) {
    this._last_name = newLastName;
  }

  getEmail() {
    return this._email;
  }

  setEmail(newEmail) {
    this._email = newEmail;
  }

  getPhoneNumber() {
    return this._phone;
  }

  setPhoneNumber(newPhone) {
    this._phone = newPhone;
  }

  getUserType() {
    this._userType;
  }
}
