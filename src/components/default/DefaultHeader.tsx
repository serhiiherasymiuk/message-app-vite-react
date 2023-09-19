import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthUserActionType, IAuthUser } from "../../entities/Auth.ts";

const DefaultHeader = () => {
  const dispatch = useDispatch();
  const onLogoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    dispatch({ type: AuthUserActionType.LOGOUT_USER });
  };

  const { isAuth } = useSelector((store: any) => store.auth as IAuthUser);

  return (
    <>
      <header className="bg-white">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <div className="relative">
              <Link
                to={"/"}
                className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
                aria-expanded="false"
              >
                Messages
              </Link>
            </div>
          </div>
          {isAuth ? (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <button
                onClick={onLogoutHandler}
                type={"button"}
                className="text-sm font-semibold leading-6 text-gray-900 mr-5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <Link
                to={"/register"}
                className="text-sm font-semibold leading-6 text-gray-900 mr-5"
              >
                Sign in
              </Link>
              <Link
                to={"/login"}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default DefaultHeader;
