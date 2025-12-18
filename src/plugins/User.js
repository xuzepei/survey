import Keys from '@/plugins/keys.js';
import Tool from '@/plugins/tool.js'

class User {
  constructor() {
  }

  authorization() {
    return `Bearer ${this.getAccessToken()}`;
  }

  saveRegion(value) {
    localStorage.setItem(Keys.selected_region, value);
  }

  getRegion() {
    return localStorage.getItem(Keys.selected_region) || "";
  }

  getAccessToken() {
    return localStorage.getItem(Keys.access_token) || "";
  }

  getRefreshToken() {
    return localStorage.getItem(Keys.refresh_token) || "";
  }

  saveLoginInfo(info) {
    console.log("Save login info: " + JSON.stringify(info, null, 2));

    const accessToken = Tool.getValueIgnoreCase(info, "accessToken");
    const expiresIn = Tool.getValueIgnoreCase(info, "expiresIn");
    const refreshToken = Tool.getValueIgnoreCase(info, "refreshToken");

    if (!accessToken || !expiresIn || !refreshToken) {
      console.error("Invalid login info");
      return;
    }

    localStorage.setItem(Keys.access_token, accessToken);
    localStorage.setItem(Keys.expires_in, expiresIn);
    localStorage.setItem(Keys.refresh_token, refreshToken);
  }

   upateTokenInfoByRefreshing(info) {
    console.log("upateTokenInfoByRefreshing: " + JSON.stringify(info, null, 2));

    const accessToken = Tool.getValueIgnoreCase(info, "access_token");
    const expiresIn = Tool.getValueIgnoreCase(info, "expires_in");
    const refreshToken = Tool.getValueIgnoreCase(info, "refresh_token");

    if (!accessToken || !expiresIn || !refreshToken) {
      console.error("Invalid token info");
      return;
    }

    localStorage.setItem(Keys.access_token, accessToken);
    localStorage.setItem(Keys.expires_in, expiresIn);
    localStorage.setItem(Keys.refresh_token, refreshToken);
  }

  logout() {
    localStorage.removeItem(Keys.access_token);
    localStorage.removeItem(Keys.expires_in);
    localStorage.removeItem(Keys.refresh_token);

    //清空相关记录
    window.sessionStorage.clear();
  }

}

export const userShared = new User();