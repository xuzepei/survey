
class Errors {
    static getLoginError(errorCode) {
        switch (errorCode) {
            case -1:
            case -3:
                return "Internal server error.";
            case -2:
                return "This account does not exist in the current region.";
            case -7:
                return "Please check your account name and password.";
            default:
                return "Please check your account name and password.";
        }
    }
}

export default Errors;
