import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

export default function Signup() {

    const [passwordsAreNotEqual, setPasswordsAreNotEqual] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(event){

        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (data.password != data.confirmPassword){
            setPasswordsAreNotEqual(true);
        }
const user = {
    email: data.email,
    password: data.password,
    name: data["name"],
    role: data.role,
    termsAccepted: data.terms === "on",
  };
 
  const response = fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  console.log(response)
  navigate('/', {state: {message: 'user registado com sucesso'}})
    }
 
    return (
      <form onSubmit={handleSubmit} action = "/backend">
        <h2>Welcome to our restaurant</h2>
        <p>Let's get you started </p>
 
        <div className="control">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </div>
 
        <div className="control-row">
          <div className="control">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" required />
          </div>
          <div className="control">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              name="confirmPassword"
              required
            />
          </div>
          {passwordsAreNotEqual && <p>passwords don't match</p>}
        </div>
 
        <hr />
 
        <div className="control-row">
          <div className="control">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name"
            required/>
          </div>
 
        </div>
 
        <div className="control">
          <label htmlFor="phone">role?</label>
          <select id="role" name="role" required>
            <option value="client">Client</option>
            <option value="kitchen">Kitchen</option>
            <option value="bar">bar</option>
          </select>
        </div>
        <div className="control">
          <label htmlFor="terms-and-conditions">
            <input required type="checkbox" id="terms-and-conditions" name="terms" />I
            agree to the terms and conditions
          </label>
        </div>
 
        <p className="form-actions">
          <button type="submit" className="button">
            Sign up
          </button>
        </p>
      </form>
    );
  }