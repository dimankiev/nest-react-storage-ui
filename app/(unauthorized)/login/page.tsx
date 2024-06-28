import Login from "./_components/Login";
import {GoogleOAuthProvider} from "@react-oauth/google";

const Page = () => {
    return (
        <GoogleOAuthProvider
            clientId={process.env.GOOGLE_CLIENT_ID!}
        >
            <Login />
        </GoogleOAuthProvider>
    );
}

export default Page;