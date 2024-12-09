import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import NavBar from "../components/NavBar";
function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async ({ username, password }) => {
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("User registered successfully");
        navigate("/");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <NavBar />
      <div className="flex flex-grow">
        {/* Left side with gradient and text */}
        <div className="hidden md:flex flex-col justify-center items-start w-1/2 p-10 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
          <h1 className="text-4xl text-white font-bold mb-4">Welcome!</h1>
          <p className="text-blue-100 text-lg">
            You can sign up here.
          </p>
        </div>

        {/* Right side with form, centered */}
        <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100">
          <div className="max-w-sm w-full px-6 py-8 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h2>
            <RegisterForm onRegister={handleRegister} />
            </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
