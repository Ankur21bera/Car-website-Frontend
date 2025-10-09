import React, { useState } from 'react'
import { useAppContext } from '../Context/Appcontext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [state, setState] = useState("login"); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [age, setAge] = useState("");
  const [resetStep, setResetStep] = useState("request"); 
 const {setShowLogin,setToken} = useAppContext();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if(state === "register") {
        if(password !== confirmPassword) {
          toast.error("Password Is Not Match")
        }
        const {data} = await axios.post("/api/user/register",{name,email,password,mobileNumber,age})
        if(data.success) {
          toast.success(data.message)
          sessionStorage.setItem("token",data.token);
          setToken(data.token);
          setShowLogin(false);
        } else{
          toast.error(data.message)
        }
      }

      else if (state === "login") {
        const {data} = await axios.post("/api/user/login",{email,password})
        if(data.success) {
          toast.success(data.message)
          sessionStorage.setItem("token",data.token)
          setToken(data.token)
          setShowLogin(false);
        } else{
          toast.error(data.message)
        }
      }

      else if(state === "forgot" && resetStep === "request") {
        const {data} = await axios.post("/api/user/forgot-password",{email});
        if(data.success) {
          toast.success("Password Reset Successfully")
          setResetStep("reset");
        } else{
          toast.error(data.message)
        }
      }

      else if(state === "forgot" && resetStep === "reset") {
        if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const {data} = await axios.post("/api/user/reset-password",{email,newPassword:password,confirmPassword})
      if(data.success) {
        toast.success(data.message);
        setState("login")
      } else{
        toast.error(data.message)
      }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[560px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Header */}
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span>{" "}
          {state === "login" ? "Login" : state === "register" ? "Sign Up" : "Reset Password"}
        </p>

        {/* ================= REGISTER ================= */}
        {state === "register" && (
          <>
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="text"
                required
              />
            </div>

            <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="email"
                required
              />
            </div>

            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="password"
                required
              />
            </div>

            <div className="w-full">
              <p>Confirm Password</p>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="password"
                required
              />
            </div>

            <div className="w-full">
              <p>Mobile Number</p>
              <input
                onChange={(e) => setMobileNumber(e.target.value)}
                value={mobileNumber}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="text"
                required
              />
            </div>

            <div className="w-full">
              <p>Age</p>
              <input
                onChange={(e) => setAge(e.target.value)}
                value={age}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="text"
                required
              />
            </div>
          </>
        )}

        {/* ================= LOGIN ================= */}
        {state === "login" && (
          <>
            <div className="w-full">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="email"
                required
              />
            </div>

            <div className="w-full">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                type="password"
                required
              />
            </div>

            <div className="text-right w-full">
              <span
                onClick={() => setState("forgot")}
                className="text-indigo-500 cursor-pointer text-sm"
              >
                Forgot Password?
              </span>
            </div>
          </>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {state === "forgot" && (
          <>
            {resetStep === "request" ? (
              <div className="w-full">
                <p>Enter your email to reset password</p>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="type your registered email"
                  className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                  type="email"
                  required
                />
                <button
                  type="button"
                  onClick={() => setResetStep("reset")}
                  className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 mt-4 rounded-md cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <p>New Password</p>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="enter new password"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                    type="password"
                    required
                  />
                </div>
                <div className="w-full">
                  <p>Confirm New Password</p>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    placeholder="confirm new password"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                    type="password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 mt-4 rounded-md cursor-pointer"
                >
                  Reset Password
                </button>
              </>
            )}
            <p className="cursor-pointer text-indigo-500" onClick={() => setState("login")}>
              ← Back to Login
            </p>
          </>
        )}

        {/* ================= FOOTER LINKS ================= */}
        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">
              click here
            </span>
          </p>
        ) : state === "login" ? (
          <p>
            Create an account?{" "}
            <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">
              click here
            </span>
          </p>
        ) : null}

        {state !== "forgot" && (
          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
            {state === "register" ? "Create Account" : "Login"}
          </button>
        )}
      </form>
    </div>
  )
}

export default Login
