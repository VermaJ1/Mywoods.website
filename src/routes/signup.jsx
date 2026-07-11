import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Signup = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();
        console.log("Signup button clicked");

        try {

            const response = await fetch(
                "https://testbackend-fdpd.onrender.com/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Registration Successful!");

                localStorage.setItem("token", data.token);

                navigate("/login");

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

            alert("Server Error");

        }
    };

    return (
        <div className="signup-container">

            <form className="signup-card" onSubmit={handleSignup}>

                <h2>Create Account</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button type="submit">
                    Sign Up
                </button>

            </form>

        </div>
    );
};

export default Signup;