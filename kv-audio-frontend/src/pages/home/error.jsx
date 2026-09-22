import { Link } from "react-router-dom";

export default function ErrorNotFound(){
    return(
    <>
        <h1 className="m-1">404 Error : Page not found</h1>
        <Link className= "bg-[#ebaf3a] p-1" to="/">Go back to home</Link>

    </>
    )
}