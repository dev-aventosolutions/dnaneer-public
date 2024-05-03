import React, { useState } from "react";
import { Form, Button, Input,message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import AuthLayout from "../../sharedModules/authLayout";
import FloatLabel from "../../sharedModules/floatingLabel";
import Logo from "../../images/logo-icon.png";
import { loginUser } from "../../services/ApiHandler";

const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const authenticate = async () => {
    
    const body ={
      email:email,
      password:password,
    }
    try {
      setLoader(true)
      const { data } = await loginUser(body);
      if (data) {
        console.log("login Res", data);
        localStorage.setItem("adminToken", data?.token);
        localStorage.setItem("user", {
          name: data?.user?.name,
          email: data?.user?.email,
        });

        Cookies.set("sessionToken", data?.token, { expires: 2 });
        Cookies.set("user", JSON.stringify(data?.user), { expires: 2 });
        // // setUserId(data.user_id);
        message.success("Login Successful!");
      navigate('/');
      }
    } catch (error) {
      console.log("err", error.response.data.message);
      message.error(error.response.data.message);
    } finally {
      setLoader(false);
    }
  };
  return (
    <AuthLayout>
      <div className="auth-body">
        <img src={Logo} />
        <h3>Admin</h3>
        <h2>Login</h2>
        <Form name="basic" autoComplete="off">
          <FloatLabel label="Email" name="email" value={email}>
            <Input
              prefix={<MailOutlined />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatLabel>
          <FloatLabel label="Password" name="password" value={password}>
            <Input.Password
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatLabel>
          <Button
            type="blue"
            block
            shape="round"
            onClick={authenticate}
            loading={loader}
          >
            Login
          </Button>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default Login;
