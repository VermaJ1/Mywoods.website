import { useState } from "react";
// import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
//  const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const raw = {
                email: email,
                password: password,

            };

            const response = await fetch("https://testbackend-fdpd.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(raw),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            localStorage.setItem("token",result?.token)
            window.location.reload(true);
            // navigate("/");
            console.log(result);

        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
        <>
            <label>Email</label>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => handleLogin()}>Login</button>
        </>
    )
}

export default Login;