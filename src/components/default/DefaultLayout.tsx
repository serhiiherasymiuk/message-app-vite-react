import { Outlet } from "react-router-dom";
import DefaultHeader from "./DefaultHeader";

const DefaultLayout = () => {
    return (
        <>
            <DefaultHeader />
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <Outlet />
            </div>
        </>
    );
};

export default DefaultLayout;