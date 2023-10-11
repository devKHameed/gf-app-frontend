import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { CognitoConfig } from 'configs/AppConfig';
import { removeLocalStorage, setLocalStorage } from 'utils';

export class Auth {
  private static userPool: CognitoUserPool;

  private static getUserPool() {
    if (!this.userPool) {
      this.userPool = new CognitoUserPool({
        UserPoolId: CognitoConfig.USER_POOL_ID!,
        ClientId: CognitoConfig.APP_CLIENT_ID!,
      });
    }
    return this.userPool;
  }
  static async signIn(email: string, password: string) {
    const user = new CognitoUser({ Username: email, Pool: this.getUserPool() });
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          setLocalStorage('token', result.getIdToken().getJwtToken(), false);
          resolve(result);
        },
        onFailure: (err) => reject(err),
      }),
    );
  }

  static async checkIfUserExist(email: string) {
    return Auth.signIn(email.toLowerCase(), '0  ')
      .then((res) => {
        return false;
      })
      .catch((error) => {
        const code = error.code;
        console.log(error);
        //  return error;
        switch (code) {
          case 'UserNotFoundException':
            return false;
          default:
            return true;
        }
      });
  }

  static async signUp(email: string, password: string) {
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
    ];

    return new Promise((resolve, reject) =>
      this.getUserPool().signUp(
        email,
        password,
        attributeList,
        [],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      ),
    );
  }

  static getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  static signOut() {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
      removeLocalStorage('token');
      removeLocalStorage('account-id');
    }
  }

  static async authenticate() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error("Can't authenticate without a current user");
    }

    return new Promise((resolve, reject) => {
      currentUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          reject(err);
        } else {
          if (!session.isValid()) {
            reject(new Error('Session is invalid'));
          } else {
            setLocalStorage('token', session.getIdToken().getJwtToken(), false);
            resolve(session.getIdToken());
          }
        }
      });
    });
  }
}
