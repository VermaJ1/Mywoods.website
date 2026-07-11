import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
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
                alert(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.log(error);
            alert("Server Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-card" onSubmit={handleSignup}>
                <h2>Create Account</h2>

                <label>Full Name</label>
                <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>Email Address</label>
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
                    Already have an account? <a href="/login" style={{ color: "var(--forest-light)", fontWeight: "600" }}>Login</a>
                </p>
            </form>
        </div>
    );
};

export default Signup;