export default {
    application : {
        title : "My New App"
        , views : {
            signUp : {
                title : "Sign Up"
                , buttons: {
                    signIn: "Sign In"
                    , signUp: "Sign Up"
                    , next: "Next"
                }
            }
            , signIn : {
                title : "Sign In"
                , buttons: {
                    signIn: "Sign In"
                }
            }
        }
    }
    , authentication: {
        common : {
            labels : {
                mailAddress: "Mail Address"
                , password: "Password"
            }
            , validations : {
                isRequired: (what: string) => `${ what } is required`
                , isMalformed: (what: string) => `${ what } must be valid`
                , isTooShort: (what: string, minLength: number) => `${ what } is too short. It should be equal to or greater than ${minLength} characters.`
                , isTooLong: (what: string, maxLength: number) => `${ what } is too long. It should be equal to or less than ${maxLength} characters.`
            }
        }
        
    }
};