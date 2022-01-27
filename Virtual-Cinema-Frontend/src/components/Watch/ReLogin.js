import {useNavigate} from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const token = window.localStorage.getItem("jwt");
  if (token)
  {
    navigate("../login");
  }
}