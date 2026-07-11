import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
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
                throw new Error("Invalid email or password.");
            }

            const result = await response.json();

            localStorage.setItem("token", result?.token);
            navigate("/");
            window.location.reload();
        } catch (err) {
            console.error("Error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Welcome Back</h2>
                {error && <div style={{ color: "var(--accent-red)", marginBottom: "15px", textAlign: "center", fontSize: "14px", fontWeight: "600" }}>{error}</div>}
                
                <form onSubmit={handleLogin}>
                    <label>Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        placeholder="you@example.com"
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
                    Don't have an account? <a href="/signup" style={{ color: "var(--forest-light)", fontWeight: "600" }}>Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;