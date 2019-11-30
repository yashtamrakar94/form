import React from "react";
import { FormErrors } from "./form-errors";
import Modal from 'react-modal';
import "./form.css";

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        nameValid: false,
        emailValid: false,
        passwordValid: false,
        confirmpasswordvalid: false,
      conditions: false,
      formErrors: { name: "", email: "", password: "", confirmpassword: "" },
      numbers: [{ phone: "+91-" }],
      show: false,
      isFormValid: false
    };
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name] : value }, () => this.validate(name, value))

  };

  handlePhoneChange = (i, e) => {
    const { name, value } = e.target;
    let numbers = [...this.state.numbers];
    numbers[i] = { ...numbers[i], [name]: value };
    this.setState({ numbers });
  };

  handleCheckbox = (e) => {
    this.setState({ conditions: e.target.checked })
  }

  removeClick = i => {
    let numbers = [...this.state.numbers];
    numbers.splice(i, 1);
    this.setState({ numbers });
  };

  addClick = () => {
    this.setState(prevState => ({
      numbers: [...prevState.numbers, { phone: "+91-" }]
    }));
  };

  createPhoneField = () => {
    const { numbers } = this.state;
    return (
      numbers.length > 0 &&
      numbers.map((el, i) => (
        <span key={i}>
          <input
            placeholder="Phone Number"
            name="phone"
            className="form-control"
            value={el.phone || ""}
            onChange={e => this.handlePhoneChange(i, e)}
          />
          <input
            type="button"
            style={{margin: '10px'}}
            value="Remove number"
            onClick={this.removeClick}
          />
        </span>
      ))
    );
  };

  validate = (fieldName, value) => {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;
    let confirmpasswordvalid = this.state.confirmpasswordvalid;
    switch (fieldName) {
      case "name":
        let regex = /^([a-zA-Z'-.]+ [a-zA-Z'-.]+)$/;
        nameValid = value.match(regex);
        fieldValidationErrors.name = nameValid
          ? ""
          : " is invalid. Please enter First Name and Last Name";
        break;
      case "email":
        let emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let domain = value.substring(value.length - 3);
        let isCorrect = domain === "org" || domain === "com" ? true : false;
        emailValid = value.match(emailregex) && isCorrect;
        fieldValidationErrors.email = emailValid
          ? ""
          : " is invalid. Please use .com or .org only";
        break;
      case "password":
        let passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        passwordValid = value.match(passwordregex);
        fieldValidationErrors.password = passwordValid
          ? ""
          : " is invalid. Password must be minimum 8 characters and contain 1 lower case alphabet, 1 upper case alphabet, 1 number, special character ";
        break;
      case "confirmpassword":
        confirmpasswordvalid =
          this.state.password === this.state.confirmpassword
            ? true
            : false;
        fieldValidationErrors.confirmpassword = confirmpasswordvalid
          ? ""
          : "Passwords do not match";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        nameValid: nameValid,
        emailValid: emailValid,
        passwordValid: passwordValid,
        confirmpasswordvalid: confirmpasswordvalid,
      }, this.validateForm);
  };

  validateForm = () => {
    const { nameValid, emailValid, passwordValid, confirmpasswordvalid} = this.state;
    this.setState({ isFormValid: nameValid && emailValid && passwordValid && confirmpasswordvalid })
  }

  showDialogue = () => {
    this.setState({ show : true })
  }

  hideModal = () => {
    this.setState({ show: false })
  }

  render() {
    const { name, email, password, confirmpassword, formErrors, conditions, show, isFormValid } = this.state;
    const validform = isFormValid && conditions;
    return (
      <>
        <Modal className="Modal" isOpen={show} onRequestClose={this.hideModal}>
          <p>Your form has been submitted</p>
          <button className="btn btn-primary" onClick={this.hideModal}>Close</button>
        </Modal>
        <FormErrors formErrors={formErrors} />
        <form className="demoForm">
          <div className="form-group">
            <label>Name:</label>
            <input required
              type="text"
              name="name"
              className="form-control"
              onChange={this.handleChange}
              value={name}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input required
              type="text"
              name="email"
              className="form-control"
              onChange={this.handleChange}
              value={email}
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            {this.createPhoneField()}
            <input required
              type="button"
              style={{ marginBottom: "15px" }}
              value="Add"
              onClick={this.addClick}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input required
              type="password"
              name="password"
              className="form-control"
              onChange={this.handleChange}
              value={password}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input required
              type="password"
              name="confirmpassword"
              className="form-control"
              onChange={this.handleChange}
              value={confirmpassword}
            />
          </div>
          <div>
            <input type="checkbox" checked={conditions} onChange={this.handleCheckbox}/>
            I agree with the terms and conditions
          </div>
        </form>
        <button className="btn btn-primary" disabled={!validform} onClick={this.showDialogue}>
          Submit
        </button>
      </>
    );
  }
}

export default Form;
