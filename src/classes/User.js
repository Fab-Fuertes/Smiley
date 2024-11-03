import { v4 as uuidv4 } from "uuid"; // Para generar IDs únicos

export default class Usuario {
  constructor(nombre, email, password, userType) {
    this._id = uuidv4(); // Genera el ID único al crear el objeto
    this._nombre = nombre;
    this._email = email;
    this._password = password;
    this._usertype = userType; // 1 para usuario trabajador por defecto; cámbialo según necesites
  }

  // Getter para el ID (sin setter, ya que el ID no debería cambiar)
  get id() {
    return this._id;
  }

  // Getter y Setter para el nombre
  get name() {
    return this._nombre;
  }

  set name(value) {
    this._nombre = value;
  }

  // Getter y Setter para el email
  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  // Getter y Setter para el password
  get password() {
    return this._password;
  }

  set password(value) {
    this._password = value;
  }

  // Getter y Setter para el tipo de usuario
  get userType() {
    return this._usertype;
  }

  set userType(value) {
    if (value === 0 || value === 1) {
      this._usertype = value;
    } else {
      throw new Error(
        "El tipo de usuario debe ser 0 (usuario normal) o 1 (usuario trabajador)"
      );
    }
  }
}
