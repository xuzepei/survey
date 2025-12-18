import axios from 'axios';
import { urlConfigShared } from '@/plugins/UrlConfig.js';
import { userShared } from './User';
import Keys from '@/plugins/keys.js';

class LoginTool {

  constructor(baseURL = '/') {
    this.http = axios.create({
      baseURL,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // async login(username, password, captcha, mode, onSuccess, onError) {

  //   try {

  //     var dataBody = {}
  //     dataBody.username = username;
  //     if (password) {
  //       dataBody.password = password;
  //     } else if (captcha) {
  //       dataBody.code = captcha;
  //     }
  //     dataBody.loginModule = mode;
  //     console.log("dataBody: " + JSON.stringify(dataBody, null, 2));

  //     const urlString = urlConfigShared.userTokenUrl();
  //     console.log("urlString: " + urlString);

  //     const response = await this.http.post(encodeURI(urlString), dataBody);
  //     console.log("response.statue: " + response.status);

  //     if (
  //       response.status === 200 &&
  //       response.headers['content-type']?.includes('application/json') &&
  //       response.data.success &&
  //       response.data.data
  //     ) {
  //       const dict = response.data.data;
  //       console.log(JSON.stringify(dict, null, 2));

  //       if (dict.code === 0) {
  //         onSuccess?.(dict.content);
  //       } else {
  //         if (dict.code === -5) {
  //           this.login(username, password, captcha, 0, onSuccess, onError);
  //         } else if (dict.code === -7) {
  //           onError?.(-7); // 用户名密码错误
  //         } else {
  //           onError?.(dict.code);
  //         }
  //       }

  //       return;
  //     }

  //     console.error(response.data.errorMessage);

  //   } catch (err) {
  //     console.error(err);
  //   }

  //   onError?.(-100); // 通用错误码
  // }

  // async refreshToken(onResult) {

  //   const refresh_token = localStorage.getItem(Keys.refresh_token);
  //   if (!refresh_token) {
  //     onResult?.(false);
  //     return;
  //   }

  //   try {

  //     let bodyString = `client_id=mobile&client_secret=secret&grant_type=refresh_token&login_module=1&refresh_token=${encodeURIComponent(refresh_token)}`;

  //     const urlString = urlConfigShared.refreshUserTokenUrl();
  //     console.log("urlString: " + urlString);

  //     const response = await this.http.post(encodeURI(urlString), bodyString, {
  //       headers: {
  //         'Authorization': userShared.authorization(),
  //         "Accept": "*/*",
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       }
  //     });
  //     console.log("response.statue: " + response.status);

  //     if (
  //       response.status === 200 &&
  //       response.headers['content-type']?.includes('application/json') &&
  //       response.data.success &&
  //       response.data.data
  //     ) {
  //       const dict = response.data.data;
  //       console.log(JSON.stringify(dict, null, 2));

  //       onResult?.(true);
  //       return;
  //     }

  //     console.error(response.data.errorMessage);

  //   } catch (err) {
  //     console.error(err);
  //   }

  //   onResult?.(false);
  // }


  //Promise + async/await
  async loginAsync(username, password, captcha, mode) {
    try {
      const dataBody = { username, loginModule: mode };
      if (password) {
        dataBody.password = password;
      } else if (captcha) {
        dataBody.code = captcha;
      }

      const urlString = urlConfigShared.userTokenUrl();
      console.log("login url:", urlString);

      const response = await this.http.post(encodeURI(urlString), dataBody);

      if (
        response.status === 200 &&
        response.headers['content-type']?.includes('application/json') &&
        response.data.success &&
        response.data.data
      ) {
        const dict = response.data.data;
        console.log("login response:", dict);

        if (dict.code === 0) {
          return dict; // ✅ 成功返回数据
        } else if (dict.code === -5) {
          // 如果需要再次登录（如验证码模式切换），递归调用
          return await this.loginAsync(username, password, captcha, 0);
        } else {
          throw dict.code; // 其他错误码抛出
        }
      }

      throw new Error(response.data.errorMessage || "Login failed");
    } catch (err) {
      console.error("login error:", err);
      throw err; // 抛出错误
    }
  }

  async refreshTokenAsync() {
    const refresh_token = localStorage.getItem(Keys.refresh_token);
    if (!refresh_token) {
      throw new Error("No refresh token");
    }

    try {
      const bodyString = `client_id=mobile&client_secret=secret&grant_type=refresh_token&login_module=1&refresh_token=${encodeURIComponent(refresh_token)}`;
      const urlString = urlConfigShared.refreshUserTokenUrl();
      console.log("urlString:", urlString);

      const response = await this.http.post(encodeURI(urlString), bodyString, {
        headers: {
          'Authorization': userShared.authorization(),
          'Accept': '*/*',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log("#### refresh response:", response);

      if (
        response.status === 200 &&
        response.headers['content-type']?.includes('application/json') &&
        response.data
      ) {
        const dict = response.data;
        console.log("token refreshed:", dict);
        return dict; // 返回新 token 数据
      }

      throw new Error(response.data.errorMessage || "Refresh token failed");
    } catch (err) {
      console.error("refreshToken error:", err);
      throw err;
    }
  }

}

// 导出单例（默认 baseURL 为 '/'）
export const loginToolShared = new LoginTool();